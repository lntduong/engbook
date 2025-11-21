'use client';

import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FlashcardNavProps {
    onPrev: () => void;
    onNext: () => void;
    onPlay: () => void;
    canGoPrev: boolean;
    canGoNext: boolean;
}

export default function FlashcardNav({
    onPrev,
    onNext,
    onPlay,
    canGoPrev,
    canGoNext,
}: FlashcardNavProps) {
    return (
        <div className="flex items-center justify-center gap-3 mt-8">
            <Button
                variant="outline"
                size="lg"
                onClick={onPrev}
                disabled={!canGoPrev}
                className="px-6 hover:bg-slate-100 disabled:opacity-50"
            >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Prev
            </Button>

            <Button
                variant="default"
                size="lg"
                onClick={onPlay}
                className="px-6 bg-blue-600 hover:bg-blue-700"
            >
                <Play className="h-5 w-5 mr-2" />
                Play
            </Button>

            <Button
                variant="outline"
                size="lg"
                onClick={onNext}
                disabled={!canGoNext}
                className="px-6 hover:bg-slate-100 disabled:opacity-50"
            >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
        </div>
    );
}
