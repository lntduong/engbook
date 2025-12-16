'use client';

import { Shuffle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface FlashcardControlsProps {
    lessonFilter: string;
    onLessonFilterChange: (value: string) => void;
    lessonOptions: string[];
    onRandomize: () => void;
    flipMode: 'on' | 'off';
    onFlipModeChange: () => void;
    currentIndex: number;
    totalCards: number;
}

export default function FlashcardControls({
    lessonFilter,
    onLessonFilterChange,
    lessonOptions,
    onRandomize,
    flipMode,
    onFlipModeChange,
    currentIndex,
    totalCards,
}: FlashcardControlsProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
                {/* Lesson Filter */}
                <Select value={lessonFilter} onValueChange={onLessonFilterChange}>
                    <SelectTrigger className="w-40 bg-background border-input text-foreground">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Lesson" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Lessons</SelectItem>
                        {lessonOptions.map(lesson => (
                            <SelectItem key={lesson} value={lesson}>
                                {lesson}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Random Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRandomize}
                    className="hover:bg-muted text-foreground bg-background border-input"
                >
                    <Shuffle className="h-4 w-4 mr-2" />
                    Random
                </Button>

                {/* Flip Mode Toggle */}
                <Button
                    variant={flipMode === 'on' ? 'default' : 'outline'}
                    size="sm"
                    onClick={onFlipModeChange}
                    className={flipMode === 'on' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'hover:bg-muted text-foreground bg-background border-input'}
                >
                    📱 Flip {flipMode === 'on' ? 'On' : 'Off'}
                </Button>
            </div>

            {/* Counter */}
            <div className="text-lg font-medium text-muted-foreground">
                {totalCards > 0 ? `${currentIndex + 1}/${totalCards}` : '0/0'}
            </div>
        </div>
    );
}
