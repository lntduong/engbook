import AudioButton from './AudioButton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from 'react';
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

interface VocabItem {
    id: string;
    word: string;
    ipa: string;
    meaning: string;
    level: string;
    type?: string;
    lesson?: string;
    example?: string;
    dateAdded: number;
}

interface VocabTableProps {
    data: VocabItem[];
    startIndex: number;
    onDelete: (id: string) => void;
    isAdmin?: boolean;
}


export default function VocabTable({ data, startIndex, onDelete, isAdmin = false }: VocabTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        await onDelete(id);
        setDeletingId(null);
    };

    if (data.length === 0) {
        return (
            <Card className="p-8 flex flex-col items-center justify-center text-center text-slate-500 bg-white/50 dark:bg-slate-900/50 backdrop-blur border-dashed border-2 border-slate-200 dark:border-slate-800">
                <p className="text-lg font-medium mb-1">No vocabulary found</p>
                <p className="text-sm">Try adjusting your filters or add a new word.</p>
            </Card>
        );
    }

    return (
        <>
            {/* Desktop View Table */}
            <Card className="hidden md:block overflow-hidden border-slate-100 dark:border-slate-800 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm ring-1 ring-slate-900/5">
                <Table>
                    <TableHeader className="bg-slate-50/80 dark:bg-slate-800/80">
                        <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                            <TableHead className="w-12 text-slate-400 dark:text-slate-500 font-medium text-xs uppercase tracking-wider">#</TableHead>
                            <TableHead className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">Word</TableHead>
                            <TableHead className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">IPA</TableHead>
                            <TableHead className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">Meaning</TableHead>
                            <TableHead className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">Level</TableHead>
                            <TableHead className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">Lesson</TableHead>
                            {isAdmin && <TableHead className="w-16 text-right text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">Action</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors border-slate-100 dark:border-slate-800 group">
                                <TableCell className="font-mono text-xs text-slate-400 dark:text-slate-600">
                                    {startIndex + index + 1}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-default">{item.word}</span>
                                        {item.type && <span className="text-xs text-slate-400 dark:text-slate-500 italic font-medium">({item.type})</span>}
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-slate-500 dark:text-slate-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">{item.ipa}</span>
                                        <AudioButton text={item.word} />
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-700 dark:text-slate-300 font-medium">
                                    <div className="flex flex-col gap-1 max-w-[300px] break-words">
                                        <span className="text-sm leading-snug">{item.meaning}</span>
                                        {item.example && (
                                            <span className="text-xs text-slate-500 dark:text-slate-400 border-l-2 border-slate-200 dark:border-slate-700 pl-2">
                                                {item.example}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={`
                      font-bold shadow-sm border-0 bg-opacity-10 dark:bg-opacity-20
                      ${item.level === 'A1' || item.level === 'A2' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' :
                                                item.level === 'B1' || item.level === 'B2' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' :
                                                    'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300'}
                    `}
                                    >
                                        {item.level}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-600 dark:text-slate-300 text-sm">
                                    {item.lesson ? (
                                        <Badge variant="outline" className="font-normal text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700">
                                            {item.lesson}
                                        </Badge>
                                    ) : <span className="text-slate-300 dark:text-slate-600">—</span>}
                                </TableCell>
                                {isAdmin && (
                                    <TableCell className="text-right">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400 dark:text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-full transition-all"
                                                    disabled={deletingId === item.id}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Vocabulary?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-white">"{item.word}"</span>?
                                                        This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(item.id)}
                                                        className="bg-red-600 hover:bg-red-700 text-white"
                                                    >
                                                        Delete Word
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Mobile View Cards */}
            <div className="md:hidden flex flex-col gap-3 pb-8">
                {data.map((item) => (
                    <Card key={item.id} className="p-4 border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950 active:scale-[0.99] transition-transform duration-100">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex flex-col">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-slate-900 dark:text-white">{item.word}</span>
                                    {item.type && <span className="text-xs text-slate-400 dark:text-slate-500 italic">({item.type})</span>}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                                        {item.ipa}
                                    </span>
                                    <AudioButton text={item.word} />
                                </div>
                            </div>
                            <Badge
                                variant="secondary"
                                className={`
                  text-xs font-bold px-2 py-0.5 h-6
                  ${item.level === 'A1' || item.level === 'A2' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                        item.level === 'B1' || item.level === 'B2' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                            'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}
                `}
                            >
                                {item.level}
                            </Badge>
                        </div>

                        <div className="mt-2 text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                            {item.meaning}
                        </div>

                        {item.example && (
                            <div className="mt-2 pl-3 border-l-2 border-slate-200 dark:border-slate-700">
                                <p className="text-sm text-slate-500 dark:text-slate-400 italic">"{item.example}"</p>
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 dark:border-slate-900">
                            {item.lesson ? (
                                <Badge variant="outline" className="text-xs font-normal text-slate-500 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                    {item.lesson}
                                </Badge>
                            ) : <div></div>}

                            {isAdmin && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-slate-400 hover:text-red-600 hover:bg-red-50 -mr-2"
                                            disabled={deletingId === item.id}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1.5" />
                                            <span className="text-xs font-medium">Delete</span>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="w-[90%] rounded-xl">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete word?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete <span className="font-bold">"{item.word}"</span>?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="flex-row gap-2 justify-end">
                                            <AlertDialogCancel className="mt-0 flex-1 sm:flex-none">Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDelete(item.id)}
                                                className="bg-red-600 hover:bg-red-700 flex-1 sm:flex-none"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </>
    );
}
