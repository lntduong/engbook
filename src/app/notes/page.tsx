'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Note } from '@/lib/notes';
import { useRouter } from 'next/navigation';
import NotesList from '@/components/notes/NotesList';
import AddNoteModal from '@/components/notes/AddNoteModal';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, ArrowLeft } from 'lucide-react';

export default function NotesPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'ADMIN';
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Fetch notes and options on mount
    useEffect(() => {
        fetchNotes();
        fetchOptions();
    }, []);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/notes');
            if (response.ok) {
                const data = await response.json();
                setNotes(data);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleSaveNote = async (noteData: Omit<Note, 'id' | 'dateCreated' | 'lastEdited'>) => {
        try {
            if (editingNote) {
                // Update existing note
                const response = await fetch(`/api/notes/${editingNote.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: noteData.title,
                        content: noteData.content,
                        category: noteData.category,
                        tags: noteData.tags
                    }),
                });

                if (!response.ok) throw new Error('Failed to update note');
            } else {
                // Create new note
                const response = await fetch('/api/notes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(noteData),
                });

                if (!response.ok) throw new Error('Failed to create note');
            }

            // Refresh list
            await fetchNotes();
            setIsModalOpen(false);
            setEditingNote(null);
        } catch (error) {
            console.error('Error saving note:', error);
            alert('Failed to save note. Please try again.');
        }
    };

    const handleDeleteNote = async (id: string) => {
        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete note');

            // Remove from local state immediately
            setNotes(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Failed to delete note. Please try again.');
        }
    };

    const handleEditClick = (note: Note) => {
        setEditingNote(note);
        setIsModalOpen(true);
    };

    const handleAddNewClick = () => {
        setEditingNote(null);
        setIsModalOpen(true);
    };

    // Filter logic
    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = selectedCategory ? note.category === selectedCategory : true;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/')}
                            className="hover:bg-slate-100 flex-shrink-0"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                            Back
                        </Button>
                        <div className="min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight truncate">Notes</h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1 truncate">
                                Capture your knowledge and review your lessons
                            </p>
                        </div>
                    </div>

                    {isAdmin && (
                        <Button
                            onClick={handleAddNewClick}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Add New Note
                        </Button>
                    )}
                </div>

                {/* Filters Section */}
                <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-sm border border-white/50 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search notes, tags, content..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center gap-2 min-w-[200px]">
                            <Filter size={18} className="text-gray-500" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <NotesList
                        notes={filteredNotes}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteNote}
                    />
                )}

                <AddNoteModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveNote}
                    categories={categories}
                    editingNote={editingNote}
                />
            </main>
        </div>
    );
}
