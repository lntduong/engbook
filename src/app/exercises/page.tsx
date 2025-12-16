'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ExerciseSetup, { ExerciseConfig } from '@/components/exercises/ExerciseSetup';
import QuizInterface, { Question } from '@/components/exercises/QuizInterface';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function ExercisesPage() {
    const router = useRouter();
    const [gameState, setGameState] = useState<'SETUP' | 'LOADING' | 'PLAYING'>('SETUP');
    const [questions, setQuestions] = useState<Question[]>([]);

    const generateQuestions = async (config: ExerciseConfig) => {
        setGameState('LOADING');
        try {
            let sourceData = [];

            if (config.type === 'VOCABULARY') {
                const res = await fetch('/api/vocab');
                const data = await res.json();
                sourceData = data;

                if (config.filterValue !== 'ALL') {
                    sourceData = sourceData.filter((item: any) => item.lesson === config.filterValue);
                }
            } else {
                const res = await fetch('/api/grammar');
                const data = await res.json();
                sourceData = data;

                if (config.filterValue !== 'ALL') {
                    sourceData = sourceData.filter((item: any) => item.level === config.filterValue);
                }
            }

            // Shuffle data
            const shuffled = [...sourceData].sort(() => 0.5 - Math.random());
            const selectedItems = shuffled.slice(0, Math.min(config.questionCount, shuffled.length));

            // Generate questions
            const newQuestions: Question[] = selectedItems.map((item: any) => {
                // Create distractors
                const otherItems = sourceData.filter((i: any) => i.id !== item.id);
                const distractors = otherItems
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3)
                    .map((i: any) => config.type === 'VOCABULARY' ? i.meaning : i.structure || i.title);

                const correctAnswer = config.type === 'VOCABULARY' ? item.meaning : item.structure || item.title;
                const options = [...distractors, correctAnswer].sort(() => 0.5 - Math.random());

                return {
                    id: item.id,
                    question: config.type === 'VOCABULARY'
                        ? `What is the meaning of "${item.word}"?`
                        : `Which structure corresponds to "${item.title}"?`, // Or explanation
                    options,
                    correctAnswer,
                    explanation: config.type === 'VOCABULARY' ? item.example : item.explanation
                };
            });

            setQuestions(newQuestions);
            setGameState('PLAYING');
        } catch (error) {
            console.error('Error generating questions:', error);
            setGameState('SETUP');
        }
    };

    return (
        <div className="min-h-screen pb-20">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/')}
                            className="hover:bg-slate-100 flex-shrink-0"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                            Back
                        </Button>
                        <div className="min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight truncate">Practice Arena</h1>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 truncate">
                                Challenge yourself with generated quizzes based on your vocabulary and grammar collection.
                            </p>
                        </div>
                    </div>
                </div>

                {gameState === 'SETUP' && (
                    <ExerciseSetup onStart={generateQuestions} />
                )}

                {gameState === 'LOADING' && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                        <p className="text-lg text-slate-600 font-medium">Generating your quiz...</p>
                    </div>
                )}

                {gameState === 'PLAYING' && (
                    <QuizInterface
                        questions={questions}
                        onExit={() => setGameState('SETUP')}
                    />
                )}
            </main>
        </div>
    );
}
