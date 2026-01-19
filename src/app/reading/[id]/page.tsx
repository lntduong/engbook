'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, BookOpen, GraduationCap, FileQuestion, CheckCircle2, XCircle, Trash2, Loader2, Volume2, Pause, Square } from 'lucide-react';

export default function ReadingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [reading, setReading] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);

    // TTS State
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        // Cleanup speech on unmount
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const handleSpeak = () => {
        if (!reading?.content) return;

        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            setIsSpeaking(true);
        } else if (isSpeaking) {
            window.speechSynthesis.pause();
            setIsPaused(true);
            setIsSpeaking(false);
        } else {
            const newUtterance = new SpeechSynthesisUtterance(reading.content);
            newUtterance.lang = 'en-US';
            newUtterance.rate = 0.9; // Slightly slower for learning

            newUtterance.onend = () => {
                setIsSpeaking(false);
                setIsPaused(false);
            };

            setUtterance(newUtterance);
            window.speechSynthesis.speak(newUtterance);
            setIsSpeaking(true);
            setIsPaused(false);
        }
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    };

    // params.id is Promise<string> or string? usually string in client component but checking updates.
    // In Next.js 15+ async is preferred but for client components usually works. 
    // Handled safely by useParams hook.

    useEffect(() => {
        if (params.id) {
            fetchReading(params.id as string);
        }
    }, [params.id]);

    const fetchReading = async (id: string) => {
        try {
            const res = await fetch(`/api/reading/${id}`);
            if (res.ok) {
                const data = await res.json();
                setReading(data);
            } else {
                router.push('/reading');
            }
        } catch (error) {
            console.error('Failed to load reading:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this reading?')) return;

        try {
            const res = await fetch(`/api/reading/${reading.id}`, { method: 'DELETE' });
            if (res.ok) {
                router.push('/reading');
            }
        } catch (error) {
            console.error('Failed to delete reading:', error);
        }
    };

    const handleAnswer = (questionIdx: number, optionIdx: number) => {
        if (showResults) return;
        setAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }));
    };

    const calculateScore = () => {
        if (!reading) return 0;
        let correct = 0;
        reading.questions.forEach((q: any, i: number) => {
            if (answers[i] === q.correctAnswer) correct++;
        });
        return correct;
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>;
    }

    if (!reading) return null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Navigation & Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <Button variant="ghost" onClick={() => router.push('/reading')} className="w-fit hover:bg-slate-200 dark:hover:bg-slate-800">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} className="w-fit bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                </div>

                <div className="mb-8">
                    <div className="flex gap-2 mb-2">
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900">{reading.topic}</Badge>
                        <Badge variant="secondary" className="font-mono">{reading.level}</Badge>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">{reading.title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" /> Added on {new Date(reading.dateAdded).toLocaleDateString()}
                    </p>
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="read" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 h-12 bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                        <TabsTrigger value="read" className="data-[state=active]:bg-indigo-100 dark:data-[state=active]:bg-indigo-900/30 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-300 rounded-lg transition-all text-base">
                            <BookOpen className="w-4 h-4 mr-2" /> Read
                        </TabsTrigger>
                        <TabsTrigger value="study" className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 rounded-lg transition-all text-base">
                            <GraduationCap className="w-4 h-4 mr-2" /> Study
                        </TabsTrigger>
                        <TabsTrigger value="practice" className="data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-300 rounded-lg transition-all text-base">
                            <FileQuestion className="w-4 h-4 mr-2" /> Practice
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="read" className="animate-in fade-in zoom-in-95 duration-300">
                        <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800 relative">
                            <div className="absolute top-4 right-4 flex gap-2 z-10">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleSpeak}
                                    className={`rounded-full shadow-sm hover:scale-105 transition-all ${isSpeaking ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : ''}`}
                                    title={isSpeaking ? "Pause" : (isPaused ? "Resume" : "Read Aloud")}
                                >
                                    {isSpeaking ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                </Button>
                                {(isSpeaking || isPaused) && (
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleStop}
                                        className="rounded-full shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                        title="Stop"
                                    >
                                        <Square className="w-4 h-4 fill-current" />
                                    </Button>
                                )}
                            </div>
                            <CardContent className="p-8 pt-12 sm:pt-8">
                                <article className="prose prose-lg dark:prose-invert max-w-none font-serif leading-loose text-slate-800 dark:text-slate-200">
                                    <div className="whitespace-pre-line">{reading.content}</div>
                                </article>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="study" className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-white dark:bg-slate-900 border-l-4 border-l-blue-500 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-xl text-blue-700 dark:text-blue-400 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5" /> Vocabulary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {reading.vocab?.map((v: any, i: number) => (
                                        <div key={i} className="pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className="font-bold text-lg text-slate-900 dark:text-white">{v.word}</span>
                                                <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">{v.type}</span>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-300 mb-1">{v.meaning}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 italic">"{v.example}"</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-slate-900 border-l-4 border-l-purple-500 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-xl text-purple-700 dark:text-purple-400 flex items-center gap-2">
                                        <GraduationCap className="w-5 h-5" /> Grammar
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {reading.grammar?.map((g: any, i: number) => (
                                        <div key={i} className="pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">{g.point}</h4>
                                            <p className="text-slate-600 dark:text-slate-300 mb-2 text-sm">{g.explanation}</p>
                                            <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded text-sm text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                                                <span className="font-semibold text-purple-600 dark:text-purple-400 mr-1">Ex:</span>
                                                {g.example}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="practice" className="animate-in fade-in zoom-in-95 duration-300">
                        <Card className="bg-white dark:bg-slate-900 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Comprehension Check</span>
                                    {showResults && (
                                        <Badge variant="outline" className="text-lg py-1 px-3 border-emerald-200 bg-emerald-50 text-emerald-700">
                                            Score: {calculateScore()} / {reading.questions.length}
                                        </Badge>
                                    )}
                                </CardTitle>
                                <CardDescription>Test your understanding of the passage.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {reading.questions?.map((q: any, qIdx: number) => (
                                    <div key={qIdx} className="space-y-3">
                                        <h3 className="font-medium text-lg text-slate-900 dark:text-white flex gap-2">
                                            <span className="text-slate-400">{qIdx + 1}.</span> {q.question}
                                        </h3>
                                        <div className="grid gap-2 pl-6">
                                            {q.options.map((opt: string, optIdx: number) => {
                                                const isSelected = answers[qIdx] === optIdx;
                                                const isCorrect = q.correctAnswer === optIdx;
                                                let variant = "outline";
                                                let className = "justify-start text-left h-auto py-3 px-4 hover:border-indigo-300 hover:bg-slate-50 whitespace-normal break-words";

                                                if (showResults) {
                                                    if (isCorrect) {
                                                        className += " border-emerald-500 bg-emerald-50 text-emerald-800 font-medium";
                                                    } else if (isSelected && !isCorrect) {
                                                        className += " border-red-500 bg-red-50 text-red-800";
                                                    } else {
                                                        className += " opacity-50";
                                                    }
                                                } else if (isSelected) {
                                                    className += " border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500";
                                                }

                                                return (
                                                    <Button
                                                        key={optIdx}
                                                        variant="outline"
                                                        className={className}
                                                        onClick={() => handleAnswer(qIdx, optIdx)}
                                                        disabled={showResults}
                                                    >
                                                        <span className="w-6 h-6 rounded-full border border-current mr-3 flex items-center justify-center text-xs font-mono shrink-0">
                                                            {String.fromCharCode(65 + optIdx)}
                                                        </span>
                                                        {opt}
                                                        {showResults && isCorrect && <CheckCircle2 className="w-5 h-5 ml-auto text-emerald-600" />}
                                                        {showResults && isSelected && !isCorrect && <XCircle className="w-5 h-5 ml-auto text-red-600" />}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                {!showResults ? (
                                    <Button onClick={() => setShowResults(true)} className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white" disabled={Object.keys(answers).length < reading.questions.length}>
                                        Submit Answers
                                    </Button>
                                ) : (
                                    <Button variant="outline" onClick={() => { setShowResults(false); setAnswers({}); }} className="w-full mt-6">
                                        Retry Quiz
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function Clock(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
