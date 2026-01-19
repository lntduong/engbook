'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Note } from '@/lib/notes';
import { ArrowLeft, Calendar, Tag, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NoteCard from '@/components/notes/NoteCard';
import dynamic from 'next/dynamic';
import '@blocknote/shadcn/style.css';

const NoteViewer = dynamic(() => import('@/components/notes/NoteViewer'), {
    ssr: false,
    loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded-lg"></div>
});

interface NoteDetailClientProps {
    note: Note;
    relatedNotes: Note[];
}

export default function NoteDetailClient({ note, relatedNotes }: NoteDetailClientProps) {
    const router = useRouter();

    if (!note) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Note not found</h1>
                <Button onClick={() => router.push('/notes')}>Back to Notes</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <Button
                    variant="ghost"
                    onClick={() => router.push('/notes')}
                    className="mb-6 hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Notes
                </Button>

                <article className="bg-card rounded-xl shadow-sm border border-border">
                    <div className="p-8 border-b border-border">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {note.category && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                                    <Folder className="w-3 h-3 mr-1" />
                                    {note.category}
                                </span>
                            )}
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(note.dateCreated).toLocaleDateString()}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                            {note.title}
                        </h1>

                        {note.tags && note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {note.tags.map(tag => (
                                    <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-muted text-muted-foreground">
                                        <Tag className="w-3 h-3 mr-1" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-8">
                        <NoteViewer content={note.content} title={note.title} />
                    </div>
                </article>

                {/* Related Notes */}
                {relatedNotes.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Related Notes</h2>
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
