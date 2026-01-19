'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import NoteEditorForm from '@/components/notes/NoteEditorForm';
import { Note } from '@/lib/notes';
import { Button } from '@/components/ui/button';

export default function EditNotePage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [note, setNote] = useState<Note | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch note data
                const noteRes = await fetch(`/api/notes/${id}`);
                if (!noteRes.ok) {
                    const text = await noteRes.text();
                    throw new Error(`Failed to fetch note: ${noteRes.status} ${noteRes.statusText} - ${text.substring(0, 100)}`);
                }
                const noteData = await noteRes.json();
                setNote(noteData);

                // Fetch categories
                const optionsRes = await fetch('/api/notes/options');
                if (optionsRes.ok) {
                    const optionsData = await optionsRes.json();
                    setCategories(optionsData.categories || []);
                }
            } catch (error: any) {
                console.error('Error fetching data:', error);
                setError(error.message || 'Failed to load note');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, router]);

    const handleSave = async (noteData: Omit<Note, 'id' | 'dateCreated' | 'lastEdited'>) => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noteData),
            });

            if (!response.ok) throw new Error('Failed to update note');

            // Redirect to the main notes page
            router.push('/notes');
        } catch (error) {
            console.error('Error updating note:', error);
            throw error;
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
                <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-lg w-full">
                    <h3 className="text-lg font-bold mb-2">Error Loading Note (ID: {id})</h3>
                    <p>{error}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                    >
                        Retry
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/notes')}
                        className="mt-4 ml-2"
                    >
                        Back to Notes
                    </Button>
                </div>
            </div>
        );
    }

    if (!note) return null;

    return (
        <div className="min-h-screen bg-background">
            <NoteEditorForm
                initialData={note}
                onSave={handleSave}
                categories={categories}
                isSaving={isSaving}
            />
        </div>
    );
}
