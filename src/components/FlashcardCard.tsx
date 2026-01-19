'use client';

import { useState } from 'react';
import AudioButton from './AudioButton';
import { Card } from '@/components/ui/card';

interface VocabItem {
    id: string;
    word: string;
    ipa: string;
    meaning: string;
    level: string;
    type?: string;
    lesson?: string;
    example?: string;
    dateAdded: number;
}

interface FlashcardCardProps {
    vocab: VocabItem;
    isFlipped: boolean;
    flipMode: 'on' | 'off';
    onFlip: () => void;
}

export default function FlashcardCard({ vocab, isFlipped, flipMode, onFlip }: FlashcardCardProps) {
    return (
        <div className="w-full max-w-3xl mx-auto perspective-1000">
            <Card
                className={`relative h-96 cursor-pointer transition-transform duration-700 transform-style-3d ${isFlipped && flipMode === 'on' ? 'rotate-y-180' : ''
                    }`}
                onClick={flipMode === 'on' ? onFlip : undefined}
            >
                {/* Front Side - Word Only */}
                <div className={`absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 ${flipMode === 'off' ? 'hidden' : ''
                    }`}>
                    <div className="absolute top-4 right-4">
                        <AudioButton text={vocab.word} />
                    </div>
                    <h1 className="text-6xl font-bold text-slate-900 dark:text-white text-center">
                        {vocab.word}
                    </h1>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-4">Click to flip</p>
                </div>

                {/* Back Side - Details */}
                <div className={`absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 ${flipMode === 'off' ? 'hidden' : ''
                    }`}>
                    <div className="text-center space-y-4">
                        <p className="text-2xl text-blue-600 dark:text-blue-400 font-medium">
                            {vocab.ipa}
                        </p>
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                            {vocab.meaning}
                        </h2>
                        {vocab.example && (
                            <p className="text-lg text-slate-600 dark:text-slate-300 italic mt-6 max-w-xl">
                                "{vocab.example}"
                            </p>
                        )}
                    </div>
                </div>

                {/* Flip Off Mode - Show All */}
                {flipMode === 'off' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="absolute top-4 right-4">
                            <AudioButton text={vocab.word} />
                        </div>
                        <div className="text-center space-y-3">
                            <h1 className="text-5xl font-bold text-slate-900 dark:text-white">
                                {vocab.word}
                            </h1>
                            <p className="text-xl text-blue-600 dark:text-blue-400 font-medium">
                                {vocab.ipa}
                            </p>
                            <h2 className="text-3xl font-semibold text-slate-700 dark:text-slate-200 mt-4">
                                {vocab.meaning}
                            </h2>
                            {vocab.example && (
                                <p className="text-base text-slate-600 dark:text-slate-300 italic mt-4 max-w-xl">
                                    "{vocab.example}"
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
