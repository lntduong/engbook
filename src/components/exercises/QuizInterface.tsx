'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
}

interface QuizInterfaceProps {
    questions: Question[];
    onExit: () => void;
}

export default function QuizInterface({ questions, onExit }: QuizInterfaceProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const currentQuestion = questions[currentIndex];

    const handleAnswer = (answer: string) => {
        if (isAnswered) return;
        setSelectedAnswer(answer);
        setIsAnswered(true);
        if (answer === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
        }
    };

    if (showResult) {
        return (
            <Card className="max-w-md mx-auto p-8 text-center bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
                <div className="mb-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Quiz Complete!</h2>
                    <p className="text-slate-500 mt-2">Here is your result</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-6 mb-8">
                    <div className="text-4xl font-bold text-blue-600 mb-1">
                        {score} / {questions.length}
                    </div>
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Correct Answers</p>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={onExit}
                    >
                        Back to Menu
                    </Button>
                    <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => window.location.reload()}
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <Card className="max-w-2xl mx-auto p-6 sm:p-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl min-h-[400px] flex flex-col">
            {/* Progress */}
            <div className="flex justify-between items-center mb-8 text-sm font-medium text-slate-500">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>Score: {score}</span>
            </div>

            {/* Question */}
            <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-8 text-center leading-relaxed">
                    {currentQuestion.question}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, idx) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrect = option === currentQuestion.correctAnswer;

                        let variantClass = "hover:bg-slate-50 border-slate-200";

                        if (isAnswered) {
                            if (isCorrect) {
                                variantClass = "bg-green-50 border-green-500 text-green-700";
                            } else if (isSelected && !isCorrect) {
                                variantClass = "bg-red-50 border-red-500 text-red-700";
                            } else {
                                variantClass = "opacity-50";
                            }
                        } else if (isSelected) {
                            variantClass = "border-blue-500 bg-blue-50 text-blue-700";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(option)}
                                disabled={isAnswered}
                                className={cn(
                                    "p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-3 group",
                                    variantClass
                                )}
                            >
                                <div className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                                    isAnswered && isCorrect ? "border-green-500 bg-green-500 text-white" :
                                        isAnswered && isSelected && !isCorrect ? "border-red-500 bg-red-500 text-white" :
                                            "border-slate-300 group-hover:border-slate-400"
                                )}>
                                    {isAnswered && isCorrect ? <CheckCircle className="w-4 h-4" /> :
                                        isAnswered && isSelected && !isCorrect ? <XCircle className="w-4 h-4" /> :
                                            null}
                                </div>
                                <span className="font-medium">{option}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            {isAnswered && (
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end animate-in fade-in slide-in-from-bottom-4">
                    <Button
                        onClick={handleNext}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                    >
                        {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            )}
        </Card>
    );
}
