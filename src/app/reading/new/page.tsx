'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Save, ArrowLeft, RefreshCw, BookOpen, GraduationCap, FileQuestion, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function NewReadingPage() {
    const router = useRouter();

    const [topic, setTopic] = useState('');
    const [level, setLevel] = useState('B1');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [generatedData, setGeneratedData] = useState<any>(null);

    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'IELTS', 'TOEIC'];
    const suggestedTopics = [
        { name: 'Technology', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200' },
        { name: 'Environment', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200' },
        { name: 'Business', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200' },
        { name: 'Health', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 hover:bg-rose-200' },
        { name: 'Culture', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200' },
        { name: 'History', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200' },
    ];

    const handleGenerate = async () => {
        if (!topic) return;
        setIsGenerating(true);
        setGeneratedData(null);

        try {
            const res = await fetch('/api/reading/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, level })
            });
            const data = await res.json();

            if (res.ok) {
                setGeneratedData(data);
            } else {
                console.error(data.error);
                alert('Generation failed: ' + data.error);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to connect to generation service.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!generatedData) return;
        setIsSaving(true);

        try {
            const finalData = {
                ...generatedData,
                topic,
                level
            };

            const res = await fetch('/api/reading', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData)
            });

            if (res.ok) {
                const saved = await res.json();
                router.push(`/reading/${saved.id}`);
            } else {
                alert('Failed to save reading.');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving reading.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 pl-0 hover:bg-transparent mb-2"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            Magic Reading
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Generate personalized English reading lessons instantly with AI.
                        </p>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1fr,1.5fr] items-start">
                    {/* Left Column: Input Panel */}
                    <div className="space-y-6 lg:sticky lg:top-8">

                        <Card className="border-0 shadow-2xl shadow-indigo-500/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 pointer-events-none" />
                            <CardContent className="pt-8 relative space-y-8">
                                <div className="space-y-4">
                                    <Label className="text-base font-semibold text-slate-700 dark:text-slate-200">
                                        What do you want to read about?
                                    </Label>
                                    <Input
                                        placeholder="e.g. Space Travel, Coffee Culture, AI..."
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="h-14 text-lg bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm rounded-xl px-4"
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        {suggestedTopics.map((t) => (
                                            <button
                                                key={t.name}
                                                onClick={() => setTopic(t.name)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border border-transparent hover:scale-105 active:scale-95",
                                                    t.color
                                                )}
                                            >
                                                {t.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-base font-semibold text-slate-700 dark:text-slate-200">
                                        Choose your difficulty
                                    </Label>
                                    <Select value={level} onValueChange={setLevel}>
                                        <SelectTrigger className="h-14 w-full bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 text-base shadow-sm focus:ring-2 focus:ring-indigo-500/20 transition-all">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[300px]">
                                            {levels.map(l => (
                                                <SelectItem key={l} value={l} className="py-3 cursor-pointer focus:bg-indigo-50 dark:focus:bg-indigo-900/20">
                                                    <span className="font-medium text-slate-700 dark:text-slate-200">{l}</span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    size="lg"
                                    onClick={handleGenerate}
                                    disabled={!topic || isGenerating}
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 rounded-xl text-base font-semibold transition-all hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                            Crafting your story...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 mr-3 fill-current" />
                                            Generate Magic Lesson
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Preview Panel */}
                    <div className={cn(
                        "transition-all duration-700 ease-out",
                        generatedData ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 hidden lg:block"
                    )}>
                        {generatedData ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">Ready to Learn!</p>
                                            <p className="text-xs text-slate-500">Generated successfully</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={handleGenerate} disabled={isSaving} className="hover:bg-white/50 dark:hover:bg-slate-800">
                                            <RefreshCw className="w-4 h-4 mr-2" /> Try Another
                                        </Button>
                                        <Button size="sm" onClick={handleSave} disabled={isSaving} className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900">
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                            Save Library
                                        </Button>
                                    </div>
                                </div>

                                <Card className="border-0 shadow-2xl shadow-indigo-500/10 bg-white dark:bg-slate-900 overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
                                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-8">
                                        <div className="flex gap-2 mb-4">
                                            <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-0 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1">
                                                {topic}
                                            </Badge>
                                            <Badge variant="outline" className="font-mono text-slate-500 border-slate-200 dark:border-slate-700">
                                                {level}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                                            {generatedData.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-8">
                                        <div className="prose prose-slate dark:prose-invert max-w-none font-serif text-lg leading-relaxed text-slate-700 dark:text-slate-300 first-letter:text-5xl first-letter:font-bold first-letter:text-indigo-600 first-letter:float-left first-letter:mr-3">
                                            {generatedData.content}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-100 dark:border-slate-800">
                                            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl space-y-2">
                                                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-semibold">
                                                    <BookOpen className="w-4 h-4" /> Vocabulary
                                                </div>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{generatedData.vocab?.length || 0}</p>
                                                <p className="text-sm text-slate-500">Words extracted</p>
                                            </div>
                                            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl space-y-2">
                                                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-semibold">
                                                    <FileQuestion className="w-4 h-4" /> Questions
                                                </div>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{generatedData.questions?.length || 0}</p>
                                                <p className="text-sm text-slate-500">Comprehension checks</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center space-y-6 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4">
                                    <Sparkles className="w-10 h-10 text-indigo-200 dark:text-indigo-800" />
                                </div>
                                <div className="max-w-xs mx-auto">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Ready to Create?</h3>
                                    <p>Select a topic and level on the left to start your magical learning journey.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
