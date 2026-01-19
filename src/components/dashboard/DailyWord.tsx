'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DailyWordData {
    word: string;
    meaning: string;
    example: string;
    type: string;
    ipa: string;
    date: string;
}

export function DailyWord() {
    const [data, setData] = useState<DailyWordData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWord = async (force: boolean = false) => {
        setLoading(true);
        setError(null);
        try {
            const today = new Date().toLocaleDateString();
            const stored = localStorage.getItem('daily_vocab_v2');

            if (!force && stored) {
                const parsed = JSON.parse(stored);
                if (parsed.date === today) {
                    setData(parsed);
                    setLoading(false);
                    return;
                }
            }

            const res = await fetch('/api/vocab/daily-word', { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch daily word');

            const newData = await res.json();
            const dataWithDate = { ...newData, date: today };

            localStorage.setItem('daily_vocab_v2', JSON.stringify(dataWithDate));
            setData(dataWithDate);
        } catch (err) {
            console.error(err);
            setError('Could not load vocabulary of the day.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWord();
    }, []);

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    if (error) {
        return (
            <div className="mb-12 text-center">
                <p className="text-red-500 text-sm">{error}</p>
                <Button variant="ghost" size="sm" onClick={() => fetchWord(true)} className="mt-2">
                    Try Again
                </Button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="mb-12 flex justify-center">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm w-full max-w-2xl text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Finding a word for you...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="mb-16">
            <Card className="max-w-3xl mx-auto bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950 border-indigo-100 dark:border-slate-800 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <span className="text-9xl font-serif font-black text-indigo-600">Aa</span>
                </div>

                <CardHeader className="text-center pb-2 relative z-10">
                    <div className="inline-flex items-center justify-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-white/80 dark:bg-slate-800 backdrop-blur text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900">
                            Vocabulary of the Day
                        </Badge>
                    </div>
                    <CardTitle className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 tracking-tight !mt-1">
                        {data.word}
                    </CardTitle>
                    <CardDescription className="flex items-center justify-center gap-3 text-lg mt-2 font-medium">
                        <span className="text-slate-500">{data.type}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="font-mono text-slate-600 dark:text-slate-400">/{data.ipa.replace(/^\/+|\/+$/g, '')}/</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800"
                            onClick={() => speak(data.word)}
                        >
                            <Volume2 className="h-4 w-4" />
                        </Button>
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center pb-8 relative z-10 space-y-4">
                    <p className="text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-200">
                        {data.meaning}
                    </p>
                    <div className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 rounded-lg p-4 max-w-xl mx-auto mt-4 inline-block text-left w-full">
                        <p className="text-slate-600 dark:text-slate-400 italic text-center">
                            "{data.example}"
                        </p>
                    </div>
                </CardContent>
                <div className="absolute top-4 right-4 z-20">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                        onClick={() => fetchWord(true)}
                        title="Refresh word (testing only)"
                    >
                        <RefreshCw className="h-3 w-3" />
                    </Button>
                </div>
            </Card>
        </div>
    );
}
