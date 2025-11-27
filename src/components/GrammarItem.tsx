'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GrammarItem {
    id: string;
    title: string;
    level: string;
    category: string;
    order: number;
    explanation: string;
    structure?: string;
    examples: string;
    notes?: string;
    dateAdded: number;
}

interface GrammarItemProps {
    grammar: GrammarItem;
    index: number;
    onDelete?: (id: string) => void;
    isAdmin?: boolean;
}

export default function GrammarItem({ grammar, index, onDelete, isAdmin = false }: GrammarItemProps) {
    const [showNotes, setShowNotes] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Split examples by newline for bullet points
    const exampleList = grammar.examples.split('\n').filter(e => e.trim());

    const handleDelete = async () => {
        if (onDelete) {
            setIsDeleting(true);
            await onDelete(grammar.id);
            setIsDeleting(false);
        }
    };

    return (
        <Card className="p-6 mb-4 bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-md transition-shadow relative group">
            {/* Delete Button for Admin */}
            {isAdmin && onDelete && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                                disabled={isDeleting}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Grammar Topic?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the grammar topic
                                    <span className="font-bold text-slate-900"> "{grammar.title}" </span>
                                    and all its content.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}

            {/* Title and Badge */}
            <div className="flex items-start justify-between mb-4 pr-10">
                <h3 className="text-lg font-semibold text-slate-900">
                    {index + 1}. {grammar.title}
                </h3>
                <Badge
                    variant="secondary"
                    className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-200 flex-shrink-0"
                >
                    {grammar.level}
                </Badge>
            </div>

            {/* Explanation */}
            <div className="mb-4">
                <p className="text-sm font-medium text-slate-600 mb-1">Explanation:</p>
                <p className="text-base text-slate-700 leading-relaxed">
                    {grammar.explanation}
                </p>
            </div>

            {/* Structures and Examples */}
            <div className="mb-4">
                <p className="text-sm font-medium text-slate-600 mb-2">Structures & Examples:</p>
                <div className="space-y-4">
                    {(() => {
                        const structures = (grammar.structure || '').split('\n');
                        const examples = grammar.examples.split('\n');
                        const count = Math.max(structures.length, examples.length);

                        return Array.from({ length: count }).map((_, idx) => (
                            <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                {structures[idx] && (
                                    <div className="mb-2">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Structure</span>
                                        <p className="font-mono text-sm text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 inline-block">
                                            {structures[idx]}
                                        </p>
                                    </div>
                                )}
                                {examples[idx] && (
                                    <div>
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Example</span>
                                        <p className="text-slate-700 italic text-sm">
                                            "{examples[idx]}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        ));
                    })()}
                </div>
            </div>

            {/* Notes (collapsible) */}
            {grammar.notes && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNotes(!showNotes)}
                        className="text-slate-600 hover:text-slate-900 p-0 h-auto font-normal"
                    >
                        {showNotes ? (
                            <>
                                <ChevronUp className="h-4 w-4 mr-1" />
                                Hide Notes
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-4 w-4 mr-1" />
                                Show Notes
                            </>
                        )}
                    </Button>
                    {showNotes && (
                        <div className="mt-3 p-3 bg-amber-50 border-l-4 border-amber-400 rounded">
                            <p className="text-sm text-slate-700">{grammar.notes}</p>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}
