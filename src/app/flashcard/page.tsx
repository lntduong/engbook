'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import FlashcardCard from '@/components/FlashcardCard';
import FlashcardControls from '@/components/FlashcardControls';
import FlashcardNav from '@/components/FlashcardNav';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PageHeader from "@/components/PageHeader";

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

export default function FlashcardPage() {
    const router = useRouter();
    const [vocabList, setVocabList] = useState<VocabItem[]>([]);
    const [filteredList, setFilteredList] = useState<VocabItem[]>([]);
    const [lessonFilter, setLessonFilter] = useState('ALL');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [flipMode, setFlipMode] = useState<'on' | 'off'>('on');

    // Fetch vocabulary
    useEffect(() => {
        const fetchVocab = async () => {
            try {
                const res = await fetch('/api/vocab');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setVocabList(data);
                }
            } catch (error) {
                console.error('Failed to fetch vocab:', error);
            }
        };
        fetchVocab();
    }, []);

    // Filter by lesson
    useEffect(() => {
        if (lessonFilter === 'ALL') {
            setFilteredList(vocabList);
        } else {
            setFilteredList(vocabList.filter(item => item.lesson === lessonFilter));
        }
        setCurrentIndex(0);
        setIsFlipped(false);
    }, [lessonFilter, vocabList]);

    // Extract unique lessons
    const lessonOptions = Array.from(
        new Set(vocabList.map(item => item.lesson).filter(Boolean))
    ) as string[];

    // Navigation handlers
    const handlePrev = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setIsFlipped(false);
        }
    }, [currentIndex]);

    const handleNext = useCallback(() => {
        if (currentIndex < filteredList.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
        }
    }, [currentIndex, filteredList.length]);

    const handleFlip = useCallback(() => {
        if (flipMode === 'on') {
            setIsFlipped(prev => !prev);
        }
    }, [flipMode]);

    const handlePlay = useCallback(() => {
        if (filteredList[currentIndex]) {
            const utterance = new SpeechSynthesisUtterance(filteredList[currentIndex].word);
            utterance.lang = 'en-US';
            speechSynthesis.speak(utterance);
        }
    }, [filteredList, currentIndex]);

    const handleRandomize = useCallback(() => {
        const shuffled = [...filteredList].sort(() => Math.random() - 0.5);
        setFilteredList(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
    }, [filteredList]);

    const handleFlipModeChange = useCallback(() => {
        setFlipMode(prev => prev === 'on' ? 'off' : 'on');
        setIsFlipped(false);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return; // Don't intercept if user is typing
            }

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    handlePrev();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    handleNext();
                    break;
                case ' ':
                    e.preventDefault();
                    handleFlip();
                    break;
                case 'p':
                case 'P':
                    e.preventDefault();
                    handlePlay();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePrev, handleNext, handleFlip, handlePlay]);

    const currentVocab = filteredList[currentIndex];

    return (
        <div className="min-h-screen pb-20">

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button & Title */}
                {/* Back Button & Title */}
                <PageHeader
                    title="Flashcard"
                    description="Practice your vocabulary with flashcards."
                />

                {/* Controls */}
                <FlashcardControls
                    lessonFilter={lessonFilter}
                    onLessonFilterChange={setLessonFilter}
                    lessonOptions={lessonOptions}
                    onRandomize={handleRandomize}
                    flipMode={flipMode}
                    onFlipModeChange={handleFlipModeChange}
                    currentIndex={currentIndex}
                    totalCards={filteredList.length}
                />

                {/* Card */}
                {currentVocab ? (
                    <>
                        <FlashcardCard
                            vocab={currentVocab}
                            isFlipped={isFlipped}
                            flipMode={flipMode}
                            onFlip={handleFlip}
                        />

                        {/* Navigation */}
                        <FlashcardNav
                            onPrev={handlePrev}
                            onNext={handleNext}
                            onPlay={handlePlay}
                            canGoPrev={currentIndex > 0}
                            canGoNext={currentIndex < filteredList.length - 1}
                        />
                    </>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg">No vocabulary items found. Please add some words first.</p>
                        <Button
                            onClick={() => router.push('/')}
                            className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            Go to Vocabulary List
                        </Button>
                    </div>
                )}

                {/* Keyboard shortcuts hint */}
                <div className="mt-12 text-center text-sm text-muted-foreground hidden sm:block">
                    <p>Keyboard shortcuts: ← → (navigate) | Space (flip) | P (play audio)</p>
                </div>
            </main>
        </div>
    );
}
