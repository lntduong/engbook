'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Note } from '@/lib/notes';
import NoteCard from './NoteCard';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, FileText, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeleteAlert } from './DeleteAlert';

interface NotesListProps {
    notes: Note[];
    onEdit: (note: Note) => void;
    onDelete: (id: string) => void;
}

type SortKey = keyof Note | 'size';

export default function NotesList({ notes, onEdit, onDelete }: NotesListProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';

    // Sorting state
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>(
        { key: 'lastEdited', direction: 'desc' }
    );

    // Delete alert state
    const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

    const handleSort = (key: SortKey) => {
        setSortConfig((current) => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const sortedNotes = [...notes].sort((a, b) => {
        const { key, direction } = sortConfig;
        let aValue: any = a[key as keyof Note];
        let bValue: any = b[key as keyof Note];

        // Specific handling for 'size' mock
        if (key === 'size') {
            aValue = a.content.length;
            bValue = b.content.length;
        }

        // Handle undefined/null
        if (aValue === undefined) aValue = '';
        if (bValue === undefined) bValue = '';

        // String comparison
        if (typeof aValue === 'string') {
            return direction === 'asc'
                ? aValue.localeCompare(bValue as string)
                : (bValue as string).localeCompare(aValue);
        }

        // Number props (date)
        return direction === 'asc' ? (aValue - bValue) : (bValue - aValue);
    });

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        return (bytes / 1024).toFixed(1) + ' KB';
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    if (notes.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-gray-500 text-lg">No notes yet. Create your first lesson note!</p>
            </div>
        );
    }

    return (
        <>
            {/* Mobile View: Grid of Cards */}
            <div className="md:hidden grid grid-cols-1 gap-6">
                {sortedNotes.map((note) => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>

            {/* Desktop View: Table (Windows Explorer style) */}
            <div className="hidden md:block rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[400px] cursor-pointer hover:bg-muted/50" onClick={() => handleSort('title')}>
                                <div className="flex items-center gap-2">
                                    Name
                                    <ArrowUpDown className={cn("h-4 w-4", sortConfig.key === 'title' ? "opacity-100" : "opacity-40")} />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('lastEdited')}>
                                <div className="flex items-center gap-2">
                                    Date modified
                                    <ArrowUpDown className={cn("h-4 w-4", sortConfig.key === 'lastEdited' ? "opacity-100" : "opacity-40")} />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('category')}>
                                <div className="flex items-center gap-2">
                                    Type
                                    <ArrowUpDown className={cn("h-4 w-4", sortConfig.key === 'category' ? "opacity-100" : "opacity-40")} />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('size')}>
                                <div className="flex items-center gap-2">
                                    Size
                                    <ArrowUpDown className={cn("h-4 w-4", sortConfig.key === 'size' ? "opacity-100" : "opacity-40")} />
                                </div>
                            </TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedNotes.map((note) => (
                            <TableRow
                                key={note.id}
                                className="group cursor-pointer hover:bg-accent/50"
                                onClick={() => router.push(`/notes/${note.id}`)}
                            >
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-blue-500" />
                                        <span>{note.title}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {formatDate(note.lastEdited)}
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
                                        {note.category || 'Uncategorized'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-muted-foreground font-mono text-xs">
                                    {formatSize(note.content.length)}
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    {isAdmin && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onEdit(note)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setNoteToDelete(note.id)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <DeleteAlert
                open={!!noteToDelete}
                onOpenChange={(open) => !open && setNoteToDelete(null)}
                onConfirm={() => {
                    if (noteToDelete) {
                        onDelete(noteToDelete);
                        setNoteToDelete(null);
                    }
                }}
            />
        </>
    );
}
