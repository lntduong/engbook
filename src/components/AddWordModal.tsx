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
import { Plus, Type, Volume2, BookOpen, GraduationCap } from 'lucide-react';

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
    const [typeOptions, setTypeOptions] = useState<string[]>([]);
    const [isCustomType, setIsCustomType] = useState(false);
    const [customType, setCustomType] = useState('');

    useEffect(() => {
        // Fetch options from API
        fetch('/api/vocab/options')
            .then(res => res.json())
            .then(data => {
                if (data.levels) setLevelOptions(data.levels);
                if (data.types) setTypeOptions(data.types);
            })
            .catch(err => console.error('Failed to fetch options:', err));
    }, []);

    // Auto-generate IPA
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (formData.word && !formData.ipa) {
                try {
                    const fetchIPA = async (text: string) => {
                        try {
                            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`);
                            if (res.ok) {
                                const data = await res.json();
                                const phonetics = data[0]?.phonetics;
                                return phonetics?.find((p: any) => p.text)?.text;
                            }
                        } catch (e) {
                            // Ignore errors for individual words
                        }
                        return null;
                    };

                    let ipa = await fetchIPA(formData.word);

                    // Fallback for phrases
                    if (!ipa && formData.word.trim().includes(' ')) {
                        const words = formData.word.trim().split(/\s+/);
                        if (words.length > 1) {
                            const ipas = await Promise.all(words.map(w => fetchIPA(w)));
                            // If we found at least one IPA, combine them
                            if (ipas.some(i => i)) {
                                // Strip slashes from individual IPAs and combine
                                const cleanIpas = ipas.map((p, i) => {
                                    const text = p || words[i];
                                    return text.replace(/^\/|\/$/g, '');
                                });
                                ipa = `/${cleanIpas.join(' ')}/`;
                            }
                        }
                    }

                    if (ipa) {
                        setFormData(prev => ({ ...prev, ipa }));
                    }
                } catch (error) {
                    console.error('Failed to fetch IPA:', error);
                }
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [formData.word, formData.ipa]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const finalType = isCustomType ? customType : formData.type;

        try {
            const res = await fetch('/api/vocab', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    type: finalType
                }),
            });

            if (res.ok) {
                onAdd({
                    ...formData,
                    type: finalType,
                    id: 'temp-id', // Will be replaced by re-fetch
                    dateAdded: Date.now()
                });
                setFormData({ word: '', ipa: '', meaning: '', type: 'noun', level: 'A1', lesson: '', example: '' }); // Reset
                setIsCustomType(false);
                setCustomType('');
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
            <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border-slate-100 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Plus className="w-5 h-5" />
                        </div>
                        Add New Vocabulary
                    </DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Expand your vocabulary by adding a new word to your collection.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="word" className="text-slate-700 font-semibold">Word</Label>
                        <div className="relative">
                            <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <Input
                                id="word"
                                value={formData.word}
                                onChange={(e) => {
                                    const newWord = e.target.value;
                                    setFormData(prev => ({
                                        ...prev,
                                        word: newWord,
                                        ipa: newWord.trim() ? prev.ipa : ''
                                    }));
                                }}
                                placeholder="e.g. Serendipity"
                                className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="ipa" className="text-slate-700 font-semibold">IPA</Label>
                            <div className="relative">
                                <Volume2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                <Input
                                    id="ipa"
                                    value={formData.ipa}
                                    onChange={(e) => setFormData({ ...formData, ipa: e.target.value })}
                                    placeholder="/ˌser.ənˈdɪp.ə.ti/"
                                    className="pl-10 border-slate-200"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type" className="text-slate-700 font-semibold">Type</Label>
                            <div className="space-y-2">
                                <Select
                                    value={isCustomType ? 'other' : formData.type}
                                    onValueChange={(val) => {
                                        if (val === 'other') {
                                            setIsCustomType(true);
                                            setFormData({ ...formData, type: '' });
                                        } else {
                                            setIsCustomType(false);
                                            setFormData({ ...formData, type: val });
                                        }
                                    }}
                                >
                                    <SelectTrigger className="border-slate-200">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {typeOptions.map(type => (
                                            <SelectItem key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="other">Other...</SelectItem>
                                    </SelectContent>
                                </Select>
                                {isCustomType && (
                                    <Input
                                        placeholder="Enter new type"
                                        value={customType}
                                        onChange={(e) => setCustomType(e.target.value)}
                                        className="border-slate-200"
                                        required
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="meaning" className="text-slate-700 font-semibold">Meaning</Label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <Input
                                id="meaning"
                                value={formData.meaning}
                                onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                                placeholder="e.g. Sự tình cờ may mắn"
                                className="pl-10 border-slate-200"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="level" className="text-slate-700 font-semibold">Level</Label>
                        <div className="relative">
                            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 z-10" />
                            <Select
                                value={formData.level}
                                onValueChange={(val) => setFormData({ ...formData, level: val })}
                            >
                                <SelectTrigger className="pl-10 border-slate-200">
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
                        <Label htmlFor="lesson" className="text-slate-700 font-semibold">Lesson <span className="text-slate-400 font-normal text-xs">(Optional)</span></Label>
                        <Input
                            id="lesson"
                            value={formData.lesson}
                            onChange={(e) => setFormData({ ...formData, lesson: e.target.value })}
                            placeholder="e.g. Lesson 5, Unit 3"
                            className="border-slate-200"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="example" className="text-slate-700 font-semibold">Example <span className="text-slate-400 font-normal text-xs">(Optional)</span></Label>
                        <Input
                            id="example"
                            value={formData.example}
                            onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                            placeholder="e.g. It was a serendipitous encounter."
                            className="border-slate-200"
                        />
                    </div>

                    <DialogFooter className="mt-4">
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/20">
                            Add Word
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
