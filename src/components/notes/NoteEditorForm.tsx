'use client';

import React, { useState, useEffect } from 'react';
import { Note } from '@/lib/notes';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const MarkdownEditor = dynamic(() => import('@/components/ui/MarkdownEditor'), {
    ssr: false,
    loading: () => <div className="h-[500px] w-full border border-gray-300 rounded-lg bg-gray-50 animate-pulse" />
});

interface NoteEditorFormProps {
    initialData?: Note | null;
    onSave: (note: Omit<Note, 'id' | 'dateCreated' | 'lastEdited'>) => Promise<void>;
    categories?: string[];
    isSaving?: boolean;
}

export default function NoteEditorForm({ initialData, onSave, categories = [], isSaving = false }: NoteEditorFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [category, setCategory] = useState(initialData?.category || '');
    const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setError('');

        let finalTitle = title.trim();

        // Auto-extract title from content if empty
        if (!finalTitle && content.trim()) {
            const firstLine = content.trim().split('\n')[0].trim();
            // Check for H1 header
            if (firstLine.startsWith('# ')) {
                finalTitle = firstLine.replace(/^#\s+/, '');
            } else if (firstLine.length > 0 && firstLine.length < 100) {
                // Fallback: use first line if it's short enough to be a title
                finalTitle = firstLine;
            }
        }

        if (!finalTitle) {
            setError('Please enter a title');
            return;
        }

        const tagsArray = tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        try {
            await onSave({
                title: finalTitle,
                content: content,
                category: category || undefined,
                tags: tagsArray.length > 0 ? tagsArray : undefined,
                order: 0,
            });
        } catch (err) {
            console.error('Error saving note:', err);
            setError('Failed to save note. Please try again.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                    <ArrowLeft size={20} />
                    Back
                </Button>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px]"
                    >
                        {isSaving ? 'Saving...' : 'Save Note'}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <div className="space-y-6 bg-card rounded-xl shadow-sm border border-border p-6 sm:p-8">
                <div>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Untitled Note"
                        className="w-full text-4xl font-bold text-foreground placeholder:text-muted-foreground border-none focus:ring-0 px-0 bg-transparent"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Category
                        </label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            list="categories-list"
                            placeholder="Select or type category..."
                            className="w-full px-3 py-2 bg-background border border-input text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                        <datalist id="categories-list">
                            {categories.map((cat) => (
                                <option key={cat} value={cat} />
                            ))}
                        </datalist>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Tags
                        </label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="e.g., grammar, beginner"
                            className="w-full px-3 py-2 bg-background border border-input text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-border">
                    <MarkdownEditor
                        value={content}
                        onChange={setContent}
                        placeholder="Start writing your note or import a markdown file..."
                        className="min-h-[600px]"
                    />
                </div>
            </div>
        </div>
    );
}
