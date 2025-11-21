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

interface AddGrammarModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (grammar: any) => void;
}

export default function AddGrammarModal({ isOpen, onClose, onAdd }: AddGrammarModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        level: 'A1',
        category: '',
        order: 1,
        explanation: '',
        structure: '',
        examples: '',
        notes: '',
    });

    const [levelOptions, setLevelOptions] = useState<string[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

    useEffect(() => {
        // Fetch options from API
        fetch('/api/grammar/options')
            .then(res => res.json())
            .then(data => {
                if (data.levels) setLevelOptions(data.levels);
                if (data.categories) setCategoryOptions(data.categories);
            })
            .catch(err => console.error('Failed to fetch options:', err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/grammar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                onAdd({ ...formData, id: 'temp-id', dateAdded: Date.now() });
                setFormData({
                    title: '',
                    level: 'A1',
                    category: '',
                    order: 1,
                    explanation: '',
                    structure: '',
                    examples: '',
                    notes: '',
                });
                onClose();
            } else {
                console.error('Failed to add grammar');
            }
        } catch (error) {
            console.error('Error adding grammar:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900">
                        Add Grammar Topic
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Present Simple Tense"
                            required
                        />
                    </div>

                    {/* Level and Category Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="level">Level *</Label>
                            <Select value={formData.level} onValueChange={(val) => setFormData({ ...formData, level: val })}>
                                <SelectTrigger>
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
                            <Label htmlFor="category">Category *</Label>
                            <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryOptions.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Order */}
                    <div>
                        <Label htmlFor="order">Order</Label>
                        <Input
                            id="order"
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                            min="1"
                        />
                    </div>

                    {/* Structure */}
                    <div>
                        <Label htmlFor="structure">Structure (optional)</Label>
                        <Input
                            id="structure"
                            value={formData.structure}
                            onChange={(e) => setFormData({ ...formData, structure: e.target.value })}
                            placeholder="e.g., S + V(s/es)"
                        />
                    </div>

                    {/* Explanation */}
                    <div>
                        <Label htmlFor="explanation">Explanation *</Label>
                        <Textarea
                            id="explanation"
                            value={formData.explanation}
                            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                            placeholder="Explain the grammar rule..."
                            rows={4}
                            required
                        />
                    </div>

                    {/* Examples */}
                    <div>
                        <Label htmlFor="examples">Examples (one per line) *</Label>
                        <Textarea
                            id="examples"
                            value={formData.examples}
                            onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
                            placeholder="I eat breakfast every day.&#10;She works in a hospital."
                            rows={4}
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
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            Add Grammar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
