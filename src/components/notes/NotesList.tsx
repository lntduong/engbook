'use client';

import React from 'react';
import { Note } from '@/lib/notes';
import NoteCard from './NoteCard';

interface NotesListProps {
    notes: Note[];
    onEdit: (note: Note) => void;
    onDelete: (id: string) => void;
}

export default function NotesList({ notes, onEdit, onDelete }: NotesListProps) {
    if (notes.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-gray-500 text-lg">No notes yet. Create your first lesson note!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
                <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
