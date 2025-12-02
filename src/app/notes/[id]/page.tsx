'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Note } from '@/lib/notes';
import { ArrowLeft, Calendar, Tag, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NoteCard from '@/components/notes/NoteCard';
import dynamic from 'next/dynamic';
import '@blocknote/shadcn/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';

// Import BlockNote viewer dynamically to avoid SSR issues if needed, but try standard first
// const BlockNoteView = dynamic(() => import('@blocknote/shadcn').then(mod => mod.BlockNoteView), { ssr: false });

export default function NoteDetailPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const [note, setNote] = useState<Note | null>(null);
    const [relatedNotes, setRelatedNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    // Create a read-only editor instance for viewing content
    // We need to handle the hook call conditionally or inside a component, but hooks can't be conditional.
    // So we'll use a separate component for the content viewer.

    useEffect(() => {
        if (!params?.id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                console.log('Fetching note with ID:', params.id);
                // Fetch main note
                const noteRes = await fetch(`/api/notes/${params.id}`);
                if (!noteRes.ok) throw new Error('Note not found');
                const noteData = await noteRes.json();
                setNote(noteData);

                // Fetch related notes
                const relatedRes = await fetch(`/api/notes/${params.id}/related`);
                if (relatedRes.ok) {
                    const relatedData = await relatedRes.json();
                    setRelatedNotes(relatedData);
                }
            } catch (error) {
                console.error('Error fetching note:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!note) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Note not found</h1>
                <Button onClick={() => router.push('/notes')}>Back to Notes</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <Button
                    variant="ghost"
                    onClick={() => router.push('/notes')}
                    className="mb-6 hover:bg-gray-200"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Notes
                </Button>

                <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-8 border-b border-gray-100">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {note.category && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                    <Folder className="w-3 h-3 mr-1" />
                                    {note.category}
                                </span>
                            )}
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(note.dateCreated).toLocaleDateString()}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                            {note.title}
                        </h1>

                        {note.tags && note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {note.tags.map(tag => (
                                    <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700">
                                        <Tag className="w-3 h-3 mr-1" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-8">
                        <NoteViewer content={note.content} />
                    </div>
                </article>

                {/* Related Notes */}
                {relatedNotes.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Notes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedNotes.map(relatedNote => (
                                <NoteCard
                                    key={relatedNote.id}
                                    note={relatedNote}
                                    onEdit={() => { }} // Read-only view mainly
                                    onDelete={() => { }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

// Separate component to handle BlockNote hooks
function NoteViewer({ content }: { content: string }) {
    const editor = useCreateBlockNote();
    const [initialContentLoaded, setInitialContentLoaded] = useState(false);

    useEffect(() => {
        if (!editor || initialContentLoaded) return;

        const loadContent = async () => {
            if (content) {
                try {
                    // Check if content is JSON (starts with '[')
                    if (content.trim().startsWith('[')) {
                        const blocks = JSON.parse(content);
                        editor.replaceBlocks(editor.document, blocks);
                    } else {
                        // Fallback for HTML content
                        const blocks = await editor.tryParseHTMLToBlocks(content);
                        editor.replaceBlocks(editor.document, blocks);
                    }
                } catch (e) {
                    console.error("Error loading content:", e);
                }
            }
            setInitialContentLoaded(true);
        };

        loadContent();
    }, [editor, content, initialContentLoaded]);

    if (!editor || !initialContentLoaded) {
        return <div className="animate-pulse h-20 bg-gray-100 rounded-lg"></div>;
    }

    return <BlockNoteView editor={editor} editable={false} theme="light" />;
}
