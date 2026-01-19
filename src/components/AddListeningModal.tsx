'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface AddListeningModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (episode: any) => void;
}

export default function AddListeningModal({ isOpen, onClose, onAdd }: AddListeningModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        level: 'A1',
        topic: '',
        order: 1,
        audioUrl: '',
        duration: '',
        transcript: '',
        notes: '',
    });

    const [levelOptions, setLevelOptions] = useState<string[]>([]);
    const [topicOptions, setTopicOptions] = useState<string[]>([]);

    useEffect(() => {
        // Fetch options from API
        fetch('/api/listening/options')
            .then(res => res.json())
            .then(data => {
                if (data.levels) setLevelOptions(data.levels);
                if (data.topics) setTopicOptions(data.topics);
            })
            .catch(err => console.error('Failed to fetch options:', err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/listening', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                onAdd({ ...formData, id: 'temp-id', dateAdded: Date.now() });
                setFormData({
                    title: '',
                    level: 'A1',
                    topic: '',
                    order: 1,
                    audioUrl: '',
                    duration: '',
                    transcript: '',
                    notes: '',
                });
                onClose();
            } else {
                console.error('Failed to add episode');
            }
        } catch (error) {
            console.error('Error adding episode:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                        Add Listening Episode
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <Label htmlFor="title" className="text-slate-700 dark:text-slate-200">Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Daily Conversation - Greeting"
                            className="mt-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            required
                        />
                    </div>

                    {/* Level and Topic Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="level" className="text-slate-700 dark:text-slate-200">Level *</Label>
                            <Select value={formData.level} onValueChange={(val) => setFormData({ ...formData, level: val })}>
                                <SelectTrigger className="mt-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {levelOptions.map(level => (
                                        <SelectItem key={level} value={level}>{level}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="topic" className="text-slate-700 dark:text-slate-200">Topic *</Label>
                            <Select value={formData.topic} onValueChange={(val) => setFormData({ ...formData, topic: val })}>
                                <SelectTrigger className="mt-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                                    <SelectValue placeholder="Select topic" />
                                </SelectTrigger>
                                <SelectContent>
                                    {topicOptions.map(topic => (
                                        <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Order */}
                    <div>
                        <Label htmlFor="order" className="text-slate-700 dark:text-slate-200">Order</Label>
                        <Input
                            id="order"
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                            min="1"
                            className="mt-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                    </div>

                    {/* Audio URL */}
                    <div>
                        <Label htmlFor="audioUrl" className="text-slate-700 dark:text-slate-200">Audio URL *</Label>
                        <Input
                            id="audioUrl"
                            type="url"
                            value={formData.audioUrl}
                            onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                            placeholder="https://example.com/audio.mp3"
                            className="mt-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            required
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <Label htmlFor="duration" className="text-slate-700 dark:text-slate-200">Duration (optional)</Label>
                        <Input
                            id="duration"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            placeholder="e.g., 2:15"
                            className="mt-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                    </div>

                    {/* Transcript */}
                    <div>
                        <Label htmlFor="transcript">Transcript (with speaker labels) *</Label>
                        <Textarea
                            id="transcript"
                            value={formData.transcript}
                            onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
                            placeholder="A: Hello!&#10;B: Hi there!&#10;A: How are you?"
                            rows={6}
                            className="mt-2"
                            required
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <Label htmlFor="notes">Notes (optional)</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Additional notes or tips..."
                            rows={3}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            Add Episode
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
