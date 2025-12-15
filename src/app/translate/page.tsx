'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeftRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'zh-CN', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'es', name: 'Spanish' },
];

export default function TranslatePage() {
    const router = useRouter();
    const [sourceText, setSourceText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('auto');
    const [targetLang, setTargetLang] = useState('vi');
    const [loading, setLoading] = useState(false);

    const handleTranslate = async () => {
        if (!sourceText.trim()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: sourceText,
                    from: sourceLang,
                    to: targetLang,
                }),
            });

            const data = await res.json();
            if (data.text) {
                setTranslatedText(data.text);
            }
        } catch (error) {
            console.error('Translation failed', error);
        } finally {
            setLoading(false);
        }
    };

    const swapLanguages = () => {
        if (sourceLang === 'auto') return; // Cannot swap if auto
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setSourceText(translatedText);
        setTranslatedText(sourceText);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-5xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <h1 className="text-2xl font-bold text-slate-800">Translator</h1>
                </div>

                {/* Translation Box */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                    {/* Controls */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <Select value={sourceLang} onValueChange={setSourceLang}>
                                <SelectTrigger className="w-32 bg-white"><SelectValue placeholder="Detect" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="auto">Detect</SelectItem>
                                    {LANGUAGES.map(l => <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>)}
                                </SelectContent>
                            </Select>

                            <Button variant="ghost" size="icon" onClick={swapLanguages} disabled={sourceLang === 'auto'}>
                                <ArrowLeftRight className="h-4 w-4 text-slate-500" />
                            </Button>

                            <Select value={targetLang} onValueChange={setTargetLang}>
                                <SelectTrigger className="w-32 bg-white"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {LANGUAGES.map(l => <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            onClick={handleTranslate}
                            disabled={loading || !sourceText}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {loading ? 'Translating...' : 'Translate'}
                        </Button>
                    </div>

                    {/* Text Areas */}
                    <div className="grid md:grid-cols-2 h-[400px] divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        <Textarea
                            placeholder="Enter text"
                            className="h-full resize-none border-0 p-6 text-lg focus-visible:ring-0 bg-transparent text-slate-800 placeholder:text-slate-300"
                            value={sourceText}
                            onChange={(e) => setSourceText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                    handleTranslate();
                                }
                            }}
                        />

                        <div className="relative h-full bg-slate-50/30">
                            <Textarea
                                readOnly
                                placeholder="Translation"
                                className="h-full resize-none border-0 p-6 text-lg focus-visible:ring-0 bg-transparent text-slate-800 placeholder:text-slate-300"
                                value={translatedText}
                            />
                            {loading && (
                                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                                    <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
