import { useState } from 'react';
import { Note } from '@/lib/notes';
import { DeleteAlert } from './DeleteAlert';

interface NoteCardProps {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (id: string) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    // Strip HTML tags for preview
    const stripHtml = (html: string) => {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    const preview = stripHtml(note.content).substring(0, 150) + (note.content.length > 150 ? '...' : '');
    const dateStr = new Date(note.lastEdited).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-800 flex-1">
                        📝 {note.title}
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(note)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setShowDeleteAlert(true)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                {note.category && (
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full mb-3">
                        {note.category}
                    </span>
                )}

                {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {note.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-md">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{preview}</p>

                <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Last edited: {dateStr}</span>
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
