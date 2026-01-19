'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ExerciseSetup, { ExerciseConfig } from '@/components/exercises/ExerciseSetup';
import QuizInterface, { Question } from '@/components/exercises/QuizInterface';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import PageHeader from "@/components/PageHeader";

export default function ExercisesPage() {
    const router = useRouter();
    const [gameState, setGameState] = useState<'SETUP' | 'LOADING' | 'PLAYING'>('SETUP');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [error, setError] = useState<string | null>(null);

    const generateQuestions = async (config: ExerciseConfig) => {
        setGameState('LOADING');
        setError(null);
        try {
            if (config.type === 'VOCABULARY') {
                let sourceData = [];
                const res = await fetch('/api/vocab');
                const data = await res.json();
                sourceData = data;

                if (config.filterValue !== 'ALL') {
                    sourceData = sourceData.filter((item: any) => item.lesson === config.filterValue);
                }

                if (!sourceData || sourceData.length === 0) {
                    setError('No items found for the selected criteria. Please add more content or change filters.');
                    setGameState('SETUP');
                    return;
                }

                // Shuffle data
                const shuffled = [...sourceData].sort(() => 0.5 - Math.random());
                const selectedItems = shuffled.slice(0, Math.min(config.questionCount, shuffled.length));

                // Generate questions
                const newQuestions: Question[] = selectedItems.map((item: any) => {
                    // Create distractors
                    const otherItems = sourceData.filter((i: any) => i.id !== item.id);
                    // Ensure we have enough distractors, if not reuse existing or add placeholders
                    const pool = otherItems.length >= 3 ? otherItems : [...otherItems, ...otherItems, ...otherItems];

                    const distractors = pool
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 3)
                        .map((i: any) => i.meaning);

                    const correctAnswer = item.meaning;
                    const options = [...distractors, correctAnswer].sort(() => 0.5 - Math.random());

                    return {
                        id: item.id,
                        question: `What is the meaning of "${item.word}"?`,
                        options,
                        correctAnswer,
                        explanation: item.example
                    };
                });

                if (newQuestions.length === 0) {
                    setError('Could not generate questions. Please ensure you have enough data.');
                    setGameState('SETUP');
                    return;
                }

                setQuestions(newQuestions);
                setGameState('PLAYING');

            } else {
                // GRAMMAR: Use AI Generation based on Note Titles
                const res = await fetch('/api/notes');
                const notes = await res.json();

                let filteredNotes = notes;
                if (config.filterValue !== 'ALL') {
                    filteredNotes = notes.filter((n: any) => n.category === config.filterValue);
                }

                if (!filteredNotes || filteredNotes.length === 0) {
                    setError('No notes found for the selected category. Please create some notes first.');
                    setGameState('SETUP');
                    return;
                }

                // Combine Title and Tags for better context
                const topics = filteredNotes.map((n: any) => {
                    const tags = n.tags && n.tags.length > 0 ? `(Tags: ${n.tags.join(', ')})` : '';
                    return `${n.title} ${tags}`;
                });

                // Call AI Generation Endpoint
                const aiRes = await fetch('/api/exercises/generate-grammar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        topics: topics,
                        count: config.questionCount
                    })
                });

                if (!aiRes.ok) throw new Error('Failed to generate quiz');

                const newQuestions: Question[] = await aiRes.json();

                if (!Array.isArray(newQuestions) || newQuestions.length === 0) {
                    throw new Error('AI returned invalid data');
                }

                setQuestions(newQuestions);
                setGameState('PLAYING');
            }
        } catch (error) {
            console.error('Error generating questions:', error);
            setError('An error occurred while generating the quiz. Please try again.');
            setGameState('SETUP');
        }
    };

    return (
        <div className="min-h-screen pb-20">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <PageHeader
                    title="Practice Arena"
                    description="Challenge yourself with generated quizzes based on your vocabulary and grammar collection."
                />

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                        <span className="mr-2">⚠️</span> {error}
                    </div>
                )}

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
