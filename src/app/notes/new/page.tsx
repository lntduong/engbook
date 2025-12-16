'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NoteEditorForm from '@/components/notes/NoteEditorForm';
import { Note } from '@/lib/notes';

export default function NewNotePage() {
    const router = useRouter();
    const [categories, setCategories] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fetch('/api/notes/options');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.categories || []);
                }
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };

        fetchOptions();
    }, []);

    const handleSave = async (noteData: Omit<Note, 'id' | 'dateCreated' | 'lastEdited'>) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noteData),
            });

            if (!response.ok) throw new Error('Failed to create note');

            // Redirect to the main notes page
            router.push('/notes');
        } catch (error) {
            console.error('Error creating note:', error);
            throw error; // Re-throw to let the form handle the error state
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <NoteEditorForm
                onSave={handleSave}
                categories={categories}
                isSaving={isSaving}
            />
        </div>
    );
}
