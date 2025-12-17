'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, RotateCcw, Clock } from 'lucide-react';
import AnswerSheet from '@/components/exams/AnswerSheet';
import { Card } from '@/components/ui/card';
import { use } from 'react';

interface Exam {
    id: string;
    title: string;
    level: string;
    duration: number;
    content: string; // HTML
    questionsCount: number;
    answerKey: Record<string, string>;
}

export default function ExamPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [exam, setExam] = useState<Exam | null>(null);
    const [loading, setLoading] = useState(true);
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [showResults, setShowResults] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        fetchExam();
    }, [resolvedParams.id]);

    useEffect(() => {
        if (timeLeft === 0) {
            handleSubmit();
        }
        if (!timeLeft || showResults) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => (prev && prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, showResults]);

    const fetchExam = async () => {
        try {
            const res = await fetch(`/api/exams/${resolvedParams.id}`);
            if (res.ok) {
                const data = await res.json();
                setExam(data);
                // Initialize user answers to preserve order if needed, or leave empty
                setTimeLeft(data.duration * 60);
            }
        } catch (error) {
            console.error('Failed to fetch exam', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (questionId: string, answer: string) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleSubmit = () => {
        if (showResults) return;
        if (confirm('Are you sure you want to finish the exam?')) {
            setShowResults(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleRetry = () => {
        if (confirm('Do you want to retry? All answers will be cleared.')) {
            setShowResults(false);
            setUserAnswers({});
            if (exam) setTimeLeft(exam.duration * 60);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const calculateScore = () => {
        if (!exam) return 0;
        let correct = 0;
        Object.entries(userAnswers).forEach(([qId, ans]) => {
            if (exam.answerKey[qId] === ans) correct++;
        });
        return correct;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!exam) {
        return <div className="p-8 text-center">Exam not found</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 h-16 px-4 flex items-center justify-between shadow-sm border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/exams')}
                        className="hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white hidden sm:block">{exam.title}</h1>
                </div>

                <div className="flex items-center gap-4">
                    {timeLeft !== null && !showResults && (
                        <div className={`flex items-center gap-2 font-mono text-lg font-bold ${timeLeft < 300 ? 'text-destructive' : 'text-primary'}`}>
                            <Clock className="h-5 w-5" />
                            {formatTime(timeLeft)}
                        </div>
                    )}
                    {showResults && (
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            Score: {calculateScore()} / {exam.questionsCount}
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Panel: Exam Content */}
                <div className="lg:col-span-9 flex flex-col">
                    <Card className="flex-1 p-6 lg:p-10 shadow-xl border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                        <div
                            className="prose dark:prose-invert max-w-none text-foreground"
                            dangerouslySetInnerHTML={{ __html: exam.content }}
                        />
                    </Card>
                </div>

                {/* Right Panel: Answer Sheet */}
                <div className="lg:col-span-3">
                    <div className="sticky top-20 flex flex-col gap-4">
                        <AnswerSheet
                            questionsCount={exam.questionsCount}
                            userAnswers={userAnswers}
                            onAnswer={handleAnswer}
                            showResults={showResults}
                            answerKey={exam.answerKey}
                        />

                        <div className="flex gap-2">
                            {!showResults ? (
                                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20" onClick={handleSubmit}>
                                    <CheckCircle className="h-4 w-4 mr-2" /> Submit
                                </Button>
                            ) : (
                                <Button className="flex-1" variant="outline" onClick={handleRetry}>
                                    <RotateCcw className="h-4 w-4 mr-2" /> Retry
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
