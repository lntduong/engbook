'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
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

interface ListeningEpisode {
    id: string;
    title: string;
    level: string;
    topic: string;
    order: number;
    audioUrl: string;
    duration: string;
    transcript: string;
    notes?: string;
    myWriting?: string;
    dateAdded: number;
}

interface ListeningEpisodeProps {
    episode: ListeningEpisode;
    onPlay: () => void;
    shouldPause: boolean;
    onDelete?: (id: string) => void;
    isAdmin?: boolean;
}

export default function ListeningEpisode({ episode, onPlay, shouldPause, onDelete, isAdmin = false }: ListeningEpisodeProps) {
    const [showTranscript, setShowTranscript] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Split transcript by lines for better formatting
    const transcriptLines = episode.transcript.split('\n').filter(line => line.trim());

    const handleDelete = async () => {
        if (onDelete) {
            setIsDeleting(true);
            await onDelete(episode.id);
            setIsDeleting(false);
        }
    };

    return (
        <Card className="p-6 mb-4 bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-md transition-shadow relative group">
            {/* Delete Button for Admin */}
            {isAdmin && onDelete && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
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
                                <AlertDialogTitle>Delete Listening Episode?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the episode
                                    <span className="font-bold text-slate-900"> "{episode.title}" </span>
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
            <div className="flex items-start justify-between mb-3 pr-10">
                <h3 className="text-lg font-semibold text-slate-900">
                    {episode.title}
                </h3>
                <Badge
                    variant="secondary"
                    className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-200 flex-shrink-0"
                >
                    {episode.level}
                </Badge>
            </div>

            {/* Audio Player */}
            <AudioPlayer
                audioUrl={episode.audioUrl}
                episodeId={episode.id}
                onPlay={onPlay}
                shouldPause={shouldPause}
            />

            {/* Transcript Section */}
            <div className="mt-4 pt-4 border-t border-slate-200">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="text-slate-600 hover:text-slate-900 p-0 h-auto font-normal"
                >
                    {showTranscript ? (
                        <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Hide Transcript
                        </>
                    ) : (
                        <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Show Transcript
                        </>
                    )}
                </Button>

                {showTranscript && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-md border border-slate-200">
                        <div className="space-y-2">
                            {transcriptLines.map((line, idx) => {
                                // Check if line starts with speaker label (e.g., "A:", "B:")
                                const speakerMatch = line.match(/^([A-Z]:|Speaker [0-9]+:)/);

                                if (speakerMatch) {
                                    const speaker = speakerMatch[0];
                                    const text = line.substring(speaker.length).trim();

                                    return (
                                        <div key={idx} className="flex gap-2">
                                            <span className="font-semibold text-blue-700 min-w-[30px]">
                                                {speaker}
                                            </span>
                                            <span className="text-slate-700">{text}</span>
                                        </div>
                                    );
                                }

                                return (
                                    <p key={idx} className="text-slate-700">
                                        {line}
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Notes Section (if exists) */}
            {episode.notes && (
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
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{episode.notes}</p>
                        </div>
                    )}
                </div>
            )}

            {/* My Writing Section */}
            <MyWritingSection episodeId={episode.id} initialWriting={episode.myWriting || ''} />
        </Card>
    );
}

// Separate component for My Writing to manage its own state
function MyWritingSection({ episodeId, initialWriting }: { episodeId: string; initialWriting: string }) {
    const [myWriting, setMyWriting] = useState(initialWriting);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage('');

        try {
            const res = await fetch('/api/listening', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ episodeId, myWriting }),
            });

            if (res.ok) {
                setSaveMessage('✓ Saved!');
                setTimeout(() => setSaveMessage(''), 2000);
            } else {
                setSaveMessage('✗ Failed to save');
            }
        } catch (error) {
            console.error('Error saving writing:', error);
            setSaveMessage('✗ Error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">
                    My Writing Practice
                </label>
                <div className="flex items-center gap-2">
                    {saveMessage && (
                        <span className={`text-xs ${saveMessage.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
                            {saveMessage}
                        </span>
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </div>
            <textarea
                value={myWriting}
                onChange={(e) => setMyWriting(e.target.value)}
                placeholder="Write what you hear... (practice dictation)"
                rows={4}
                className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono text-sm"
            />
        </div>
    );
}
