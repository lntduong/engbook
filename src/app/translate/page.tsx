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
        <div className="min-h-screen bg-background">
            <div className="max-w-5xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Translator</h1>
                        <p className="text-muted-foreground mt-1">Instantly translate text between multiple languages.</p>
                    </div>
                </div>

                {/* Translation Box */}
                <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-border bg-muted/30 gap-4">
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                            <Select value={sourceLang} onValueChange={setSourceLang}>
                                <SelectTrigger className="w-[45%] sm:w-32 bg-background border-input text-foreground"><SelectValue placeholder="Detect" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="auto">Detect</SelectItem>
                                    {LANGUAGES.map(l => <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>)}
                                </SelectContent>
                            </Select>

                            <Button variant="ghost" size="icon" onClick={swapLanguages} disabled={sourceLang === 'auto'}>
                                <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                            </Button>

                            <Select value={targetLang} onValueChange={setTargetLang}>
                                <SelectTrigger className="w-[45%] sm:w-32 bg-background border-input text-foreground"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {LANGUAGES.map(l => <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            onClick={handleTranslate}
                            disabled={loading || !sourceText}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                        >
                            {loading ? 'Translating...' : 'Translate'}
                        </Button>
                    </div>

                    {/* Text Areas */}
                    <div className="grid md:grid-cols-2 h-[400px] divide-y md:divide-y-0 md:divide-x divide-border">
                        <Textarea
                            placeholder="Enter text"
                            className="h-full resize-none border-0 p-6 text-lg focus-visible:ring-0 bg-transparent text-foreground placeholder:text-muted-foreground"
                            value={sourceText}
                            onChange={(e) => setSourceText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                    handleTranslate();
                                }
                            }}
                        />

                        <div className="relative h-full bg-muted/10">
                            <Textarea
                                readOnly
                                placeholder="Translation"
                                className="h-full resize-none border-0 p-6 text-lg focus-visible:ring-0 bg-transparent text-foreground placeholder:text-muted-foreground"
                                value={translatedText}
                            />
                            {loading && (
                                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
