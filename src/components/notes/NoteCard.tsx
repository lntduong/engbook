'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Note } from '@/lib/notes';
import { DeleteAlert } from './DeleteAlert';

interface NoteCardProps {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (id: string) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);


    const dateStr = new Date(note.lastEdited).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <>
            <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-card-foreground flex-1">
                        📝 {note.title}
                    </h3>
                    {isAdmin && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => onEdit(note)}
                                className="text-primary hover:text-primary/80 text-sm font-medium px-3 py-1 rounded-lg hover:bg-muted transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => setShowDeleteAlert(true)}
                                className="text-destructive hover:text-destructive/80 text-sm font-medium px-3 py-1 rounded-lg hover:bg-destructive/10 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {note.category && (
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3">
                        {note.category}
                    </span>
                )}

                {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {note.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-md">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}



                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">Last edited: {dateStr}</span>
                    <a
                        href={`/notes/${note.id}`}
                        className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 hover:underline"
                    >
                        View Details →
                    </a>
                </div>
            </div>

            <DeleteAlert
                open={showDeleteAlert}
                onOpenChange={setShowDeleteAlert}
                onConfirm={() => onDelete(note.id)}
            />
        </>
    );
}
