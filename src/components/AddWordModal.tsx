import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Type, Volume2, BookOpen, GraduationCap, Sparkles, Loader2 } from 'lucide-react';

interface AddWordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (word: any) => void;
}

export default function AddWordModal({ isOpen, onClose, onAdd }: AddWordModalProps) {
    const [formData, setFormData] = useState({
        word: '',
        ipa: '',
        meaning: '',
        type: 'noun',
        level: 'A1',
        lesson: '',
        example: ''
    });
    const [levelOptions, setLevelOptions] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        // Fetch options from API
        fetch('/api/vocab/options')
            .then(res => res.json())
            .then(data => {
                if (data.levels) setLevelOptions(data.levels);
            })
            .catch(err => console.error('Failed to fetch options:', err));
    }, []);

    const handleAutoFill = async () => {
        if (!formData.word) return;
        setIsGenerating(true);

        try {
            const fetchWordData = async (text: string) => {
                try {
                    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`);
                    if (res.ok) {
                        const data = await res.json();
                        const entry = data[0];
                        if (!entry) return null;

                        // IPA - try to find one with text
                        const ipa = entry.phonetics?.find((p: any) => p.text && p.text.trim() !== '')?.text || entry.phonetics?.[0]?.text;

                        // Parsing meaning/example
                        let example = '';
                        let type = '';

                        if (entry.meanings && Array.isArray(entry.meanings)) {
                            // Default type from first meaning if available
                            if (entry.meanings.length > 0) {
                                type = entry.meanings[0].partOfSpeech || '';
                            }

                            // Find first definition with an example
                            for (const m of entry.meanings) {
                                if (m.definitions && Array.isArray(m.definitions)) {
                                    for (const d of m.definitions) {
                                        if (d.example) {
                                            example = d.example;
                                            break;
                                        }
                                    }
                                }
                                if (example) break;
                            }
                        }

                        return { ipa, example, type };
                    }
                } catch (e) {
                    console.error(`Error fetching data for ${text}:`, e);
                }
                return null;
            };

            // 1. Try fetching for the whole word/phrase
            const data = await fetchWordData(formData.word);
            let newIpa = data?.ipa;
            let newExample = data?.example;
            let newType = data?.type;
            let newMeaning = '';

            // 2. Fallback/Enhancement with Gemini AI
            const shouldFetchAI = true;

            if (shouldFetchAI) {
                try {
                    const aiRes = await fetch('/api/vocab/ai-generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ word: formData.word })
                    });

                    if (aiRes.ok) {
                        const aiData = await aiRes.json();
                        if (aiData) {
                            if (!newIpa) newIpa = aiData.ipa;
                            if (!newExample) newExample = aiData.example;
                            if (!newType || newType === 'noun') newType = aiData.type;
                            newMeaning = aiData.meaning;
                        }
                    }
                } catch (err) {
                    console.error("AI Generation failed", err);
                }
            }

            // 3. Fallback IPA generation for phrases
            if (!newIpa && formData.word.trim().includes(' ')) {
                const words = formData.word.trim().split(/\s+/);
                if (words.length > 1) {
                    const ipas = await Promise.all(words.map(async w => {
                        const d = await fetchWordData(w);
                        return d?.ipa;
                    }));

                    if (ipas.some(i => i)) {
                        const cleanIpas = ipas.map((p, i) => {
                            const text = p || words[i];
                            return text.replace(/^\/|\/$/g, '');
                        });
                        newIpa = `/${cleanIpas.join(' ')}/`;
                    }
                }
            }

            // Cleanup IPA formatting (ensure slashes)
            if (newIpa && !newIpa.startsWith('/')) newIpa = `/${newIpa}`;
            if (newIpa && !newIpa.endsWith('/')) newIpa = `${newIpa}/`;

            // 4. Update state
            setFormData(prev => {
                const updates: any = {};
                if (!prev.ipa && newIpa) updates.ipa = newIpa;
                if (!prev.example && newExample) updates.example = newExample;
                if (!prev.meaning && newMeaning) updates.meaning = newMeaning;
                // Always update type if we have a better one from AI/API
                if (newType && newType !== 'noun' && newType !== prev.type) updates.type = newType.toLowerCase();

                return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
            });

        } catch (error) {
            console.error('Failed to auto-generate word data:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/vocab', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                onAdd({
                    ...formData,
                    id: 'temp-id', // Will be replaced by re-fetch
                    dateAdded: Date.now()
                });
                setFormData({ word: '', ipa: '', meaning: '', type: 'noun', level: 'A1', lesson: '', example: '' }); // Reset
                onClose();
            } else {
                console.error('Failed to add word');
            }
        } catch (error) {
            console.error('Error adding word:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-100 dark:border-slate-800 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <Plus className="w-5 h-5" />
                        </div>
                        Add New Vocabulary
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Expand your vocabulary by adding a new word to your collection.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="word" className="text-slate-700 dark:text-slate-200 font-semibold">Word</Label>
                        <div className="relative">
                            <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
                            <Input
                                id="word"
                                value={formData.word}
                                onChange={(e) => {
                                    const newWord = e.target.value;
                                    setFormData(prev => ({
                                        ...prev,
                                        word: newWord,
                                        // Don't auto-clear fields, let user decide or manual fetch overwrite
                                    }));
                                }}
                                placeholder="e.g. Serendipity"
                                className="pl-10 pr-12 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                onClick={handleAutoFill}
                                disabled={isGenerating || !formData.word}
                                title="Auto-generate details with AI"
                            >
                                {isGenerating ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                ) : (
                                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="ipa" className="text-slate-700 dark:text-slate-200 font-semibold">IPA</Label>
                            <div className="relative">
                                <Volume2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
                                <Input
                                    id="ipa"
                                    value={formData.ipa}
                                    onChange={(e) => setFormData({ ...formData, ipa: e.target.value })}
                                    placeholder="/ˌser.ənˈdɪp.ə.ti/"
                                    className="pl-10 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type" className="text-slate-700 dark:text-slate-200 font-semibold">Type</Label>
                            <div className="space-y-2">
                                <Input
                                    id="type"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    placeholder="e.g. noun, phrase"
                                    className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="meaning" className="text-slate-700 dark:text-slate-200 font-semibold">Meaning</Label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
                            <Input
                                id="meaning"
                                value={formData.meaning}
                                onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                                placeholder="e.g. Sự tình cờ may mắn"
                                className="pl-10 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="level" className="text-slate-700 dark:text-slate-200 font-semibold">Level</Label>
                        <div className="relative">
                            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4 z-10" />
                            <Select
                                value={formData.level}
                                onValueChange={(val) => setFormData({ ...formData, level: val })}
                            >
                                <SelectTrigger className="pl-10 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                                    <SelectValue placeholder="Select Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {levelOptions.map(level => (
                                        <SelectItem key={level} value={level}>
                                            {level}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="lesson" className="text-slate-700 dark:text-slate-200 font-semibold">Lesson <span className="text-slate-400 font-normal text-xs">(Optional)</span></Label>
                        <Input
                            id="lesson"
                            value={formData.lesson}
                            onChange={(e) => setFormData({ ...formData, lesson: e.target.value })}
                            placeholder="e.g. Lesson 5, Unit 3"
                            className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="example" className="text-slate-700 dark:text-slate-200 font-semibold">Example <span className="text-slate-400 font-normal text-xs">(Optional)</span></Label>
                        <Input
                            id="example"
                            value={formData.example}
                            onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                            placeholder="e.g. It was a serendipitous encounter."
                            className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                    </div>

                    <DialogFooter className="mt-4">
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/20">
                            Add Word
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
}
