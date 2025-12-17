'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AnswerSheetProps {
    questionsCount: number;
    userAnswers: Record<string, string>;
    onAnswer: (questionId: string, answer: string) => void;
    showResults?: boolean;
    answerKey?: Record<string, string>;
}

export default function AnswerSheet({
    questionsCount,
    userAnswers,
    onAnswer,
    showResults = false,
    answerKey = {}
}: AnswerSheetProps) {
    const OPTIONS = ['A', 'B', 'C', 'D'];
    const questions = Array.from({ length: questionsCount }, (_, i) => i + 1);

    return (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl overflow-hidden flex flex-col h-full max-h-[calc(100vh-220px)]">
            <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="font-semibold text-foreground text-center">Answer Sheet</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col gap-3">
                    {questions.map((q) => {
                        const qId = q.toString();
                        const userAnswer = userAnswers[qId];
                        const correctAnswer = answerKey[qId];
                        const isCorrect = showResults && userAnswer && userAnswer === correctAnswer;
                        const isWrong = showResults && userAnswer && userAnswer !== correctAnswer;

                        return (
                            <div key={q} className="flex items-center gap-4">
                                <span className={cn(
                                    "text-sm font-rubik font-medium w-6 text-right",
                                    isCorrect ? "text-green-600 dark:text-green-400" :
                                        isWrong ? "text-destructive" : "text-muted-foreground"
                                )}>
                                    {q}.
                                </span>
                                <div className="flex gap-3">
                                    {OPTIONS.map((opt) => {
                                        let btnClass = "h-8 w-8 rounded-full text-xs p-0 border-input hover:bg-muted transition-all";

                                        // Selection state
                                        if (userAnswer === opt) {
                                            btnClass = "h-8 w-8 rounded-full text-xs p-0 bg-primary text-primary-foreground hover:bg-primary/90 border-primary shadow-md";
                                        }

                                        // Result state overrides
                                        if (showResults) {
                                            if (correctAnswer === opt) {
                                                btnClass = "h-8 w-8 rounded-full text-xs p-0 bg-green-500 text-white border-green-500 shadow-sm";
                                            } else if (userAnswer === opt && userAnswer !== correctAnswer) {
                                                btnClass = "h-8 w-8 rounded-full text-xs p-0 bg-destructive text-destructive-foreground border-destructive shadow-sm";
                                            } else {
                                                btnClass = "h-8 w-8 rounded-full text-xs p-0 opacity-40";
                                            }
                                        }

                                        return (
                                            <Button
                                                key={opt}
                                                variant="outline"
                                                size="icon"
                                                className={btnClass}
                                                onClick={() => !showResults && onAnswer(qId, opt)}
                                                disabled={showResults}
                                            >
                                                {opt}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
