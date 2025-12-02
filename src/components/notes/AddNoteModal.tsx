'use client';

import React, { useState, useEffect } from 'react';
import { Note } from '@/lib/notes';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor'), {
    ssr: false,
    loading: () => <div className="h-64 w-full border border-gray-300 rounded-lg bg-gray-50 animate-pulse" />
});

interface AddNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (note: Omit<Note, 'id' | 'dateCreated' | 'lastEdited'>) => void;
    categories?: string[];
    editingNote?: Note | null;
}

export default function AddNoteModal({ isOpen, onClose, onSave, categories = [], editingNote }: AddNoteModalProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingNote) {
            setTitle(editingNote.title);
            setContent(editingNote.content);
            setCategory(editingNote.category || '');
            setTags(editingNote.tags?.join(', ') || '');
        } else {
            // Reset form when opening for new note
            setTitle('');
            setContent('');
            setCategory('');
            setTags('');
        }
        setError('');
    }, [editingNote, isOpen]);

    const handleSubmit = () => {
        setError('');

        console.log('Submitting note:', { title, content, category, tags });

        if (!title.trim() || !content.trim()) {
            setError('Please fill in both title and content');
            return;
        }

        const tagsArray = tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        onSave({
            title: title.trim(),
            content: content,
            category: category || undefined,
            tags: tagsArray.length > 0 ? tagsArray : undefined,
            order: 0,
        });

        // Reset form
        setTitle('');
        setContent('');
        setCategory('');
        setTags('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {editingNote ? 'Edit Note' : '📝 Add New Lesson Note'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Lesson 1: Present Simple"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            list="categories-list"
                            placeholder="Select or type category..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <datalist id="categories-list">
                            {categories.map((cat) => (
                                <option key={cat} value={cat} />
                            ))}
                        </datalist>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tags (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="e.g., grammar, beginner, verb-tenses"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Content *
                        </label>
                        {/* <NoteEditor 
                            value={content} 
                            onChange={setContent}
                            placeholder="Start writing your lesson notes..."
                        /> */}
                        <RichTextEditor
                            value={content}
                            onChange={setContent}
                            placeholder="Start writing your lesson notes..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                            {editingNote ? 'Update Note' : 'Save Note'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
