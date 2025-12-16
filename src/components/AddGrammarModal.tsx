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
        customCategory: '',
        order: 1,
        explanation: '',
        notes: '',
    });

    const [items, setItems] = useState<{ structure: string; example: string }[]>([
        { structure: '', example: '' }
    ]);

    const [levelOptions, setLevelOptions] = useState<string[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
    const [isCustomCategory, setIsCustomCategory] = useState(false);

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

    const handleAddItem = () => {
        setItems([...items, { structure: '', example: '' }]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems.length ? newItems : [{ structure: '', example: '' }]);
    };

    const handleItemChange = (index: number, field: 'structure' | 'example', value: string) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const finalCategory = isCustomCategory ? formData.customCategory : formData.category;
        const structure = items.map(item => item.structure).join('\n');
        const examples = items.map(item => item.example).join('\n');

        try {
            const res = await fetch('/api/grammar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    category: finalCategory,
                    structure,
                    examples,
                }),
            });

            if (res.ok) {
                onAdd({
                    ...formData,
                    category: finalCategory,
                    structure,
                    examples,
                    id: 'temp-id',
                    dateAdded: Date.now()
                });
                setFormData({
                    title: '',
                    level: 'A1',
                    category: '',
                    customCategory: '',
                    order: 1,
                    explanation: '',
                    notes: '',
                });
                setItems([{ structure: '', example: '' }]);
                setIsCustomCategory(false);
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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                        Add Grammar Topic
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <Label htmlFor="title" className="text-slate-700 dark:text-slate-200">Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Like/Dislike"
                            className="mt-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            required
                        />
                    </div>

                    {/* Level and Category Row */}
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
                            <Label htmlFor="category" className="text-slate-700 dark:text-slate-200">Category *</Label>
                            <div className="space-y-2 mt-2">
                                <Select
                                    value={isCustomCategory ? 'other' : formData.category}
                                    onValueChange={(val) => {
                                        if (val === 'other') {
                                            setIsCustomCategory(true);
                                            setFormData({ ...formData, category: '' });
                                        } else {
                                            setIsCustomCategory(false);
                                            setFormData({ ...formData, category: val });
                                        }
                                    }}
                                >
                                    <SelectTrigger className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoryOptions.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                        <SelectItem value="other">Other...</SelectItem>
                                    </SelectContent>
                                </Select>
                                {isCustomCategory && (
                                    <Input
                                        placeholder="Enter new category name"
                                        value={formData.customCategory}
                                        onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                                        className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        required
                                    />
                                )}
                            </div>
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

                    {/* Explanation */}
                    <div>
                        <Label htmlFor="explanation" className="text-slate-700 dark:text-slate-200">Explanation *</Label>
                        <Textarea
                            id="explanation"
                            value={formData.explanation}
                            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                            placeholder="Explain the grammar rule..."
                            rows={3}
                            className="mt-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            required
                        />
                    </div>

                    {/* Structures and Examples */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-slate-700 dark:text-slate-200">Structures & Examples</Label>
                            <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                                + Add Structure
                            </Button>
                        </div>

                        {items.map((item, index) => (
                            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 relative group">
                                {items.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                                        onClick={() => handleRemoveItem(index)}
                                    >
                                        ×
                                    </Button>
                                )}
                                <div className="space-y-3">
                                    <div>
                                        <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Structure {index + 1}</Label>
                                        <Input
                                            value={item.structure}
                                            onChange={(e) => handleItemChange(index, 'structure', e.target.value)}
                                            placeholder="e.g., I like/love + V-ing"
                                            className="mt-2 font-mono text-sm border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Example {index + 1}</Label>
                                        <Input
                                            value={item.example}
                                            onChange={(e) => handleItemChange(index, 'example', e.target.value)}
                                            placeholder="e.g., I love going to the cinema."
                                            className="mt-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Notes */}
                    <div>
                        <Label htmlFor="notes" className="text-slate-700 dark:text-slate-200">Notes (optional)</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Additional notes or tips..."
                            rows={3}
                            className="mt-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
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
