'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play } from 'lucide-react';

interface ExerciseSetupProps {
    onStart: (config: ExerciseConfig) => void;
}

export interface ExerciseConfig {
    type: 'VOCABULARY' | 'GRAMMAR';
    filterType: 'LESSON' | 'LEVEL';
    filterValue: string;
    questionCount: number;
}

export default function ExerciseSetup({ onStart }: ExerciseSetupProps) {
    const [type, setType] = useState<'VOCABULARY' | 'GRAMMAR'>('VOCABULARY');
    const [filterValue, setFilterValue] = useState<string>('ALL');
    const [questionCount, setQuestionCount] = useState<string>('10');
    const [options, setOptions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOptions();
    }, [type]);

    const fetchOptions = async () => {
        setLoading(true);
        try {
            if (type === 'VOCABULARY') {
                // Fetch lessons for vocabulary
                const res = await fetch('/api/vocab');
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Extract unique lessons
                    const lessons = Array.from(new Set(data.map((item: any) => item.lesson).filter(Boolean))) as string[];
                    setOptions(lessons.sort());
                }
            } else {
                // Fetch Note Categories for Grammar generation
                const res = await fetch('/api/notes/options');
                const data = await res.json();
                if (data && Array.isArray(data.categories)) {
                    setOptions(data.categories);
                }
            }
        } catch (error) {
            console.error('Failed to fetch options:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStart = () => {
        onStart({
            type,
            filterType: type === 'VOCABULARY' ? 'LESSON' : 'LEVEL',
            filterValue,
            questionCount: parseInt(questionCount),
        });
    };

    return (
        <Card className="max-w-md mx-auto p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Mini Quiz</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Test your knowledge</p>
            </div>

            <div className="space-y-6">
                {/* Section Selection */}
                <div className="space-y-2">
                    <Label>Section</Label>
                    <Select
                        value={type}
                        onValueChange={(val: 'VOCABULARY' | 'GRAMMAR') => {
                            setType(val);
                            setFilterValue('ALL');
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="VOCABULARY">Vocabulary</SelectItem>
                            <SelectItem value="GRAMMAR">Grammar</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Filter Selection */}
                <div className="space-y-2">
                    <Label>
                        {type === 'VOCABULARY' ? 'Lesson' : 'Category'}
                    </Label>
                    <Select
                        value={filterValue}
                        onValueChange={setFilterValue}
                        disabled={loading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={loading ? "Loading..." : "Select..."} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All {type === 'VOCABULARY' ? 'Lessons' : 'Categories'}</SelectItem>
                            {options.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                    {opt}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Question Count */}
                <div className="space-y-2">
                    <Label>Number of Questions</Label>
                    <Select value={questionCount} onValueChange={setQuestionCount}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5 Questions</SelectItem>
                            <SelectItem value="10">10 Questions</SelectItem>
                            <SelectItem value="20">20 Questions</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
                    onClick={handleStart}
                    disabled={loading}
                >
                    <Play className="w-5 h-5 mr-2" />
                    Start Quiz
                </Button>
            </div>
        </Card>
    );
}
