'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Note } from '@/lib/notes';
import { useRouter } from 'next/navigation';
import NotesList from '@/components/notes/NotesList';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Filter, ArrowLeft } from 'lucide-react';
import PageHeader from "@/components/PageHeader";

export default function NotesPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');

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
        router.push(`/notes/${note.id}/edit`);
    };

    const handleAddNewClick = () => {
        router.push('/notes/new');
    };

    // Filter logic
    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = selectedCategory === 'ALL' ? true : note.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header Section */}
                {/* Header Section */}
                <PageHeader
                    title="Notes"
                    description="Capture your knowledge and review your lessons"
                    rightAction={isAdmin && (
                        <Button
                            onClick={handleAddNewClick}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Add New Note
                        </Button>
                    )}
                />

                {/* Filters Section */}
                <div className="bg-card/80 backdrop-blur-md rounded-xl p-4 shadow-sm border border-border mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                type="text"
                                placeholder="Search notes, tags, content..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                            />
                        </div>
                        <div className="flex items-center gap-2 min-w-[200px]">
                            <Filter size={18} className="text-muted-foreground" />
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="flex-1 bg-background border-input text-foreground">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Categories</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
            </main>
        </div>
    );
}
