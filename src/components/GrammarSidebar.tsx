'use client';

import { Button } from '@/components/ui/button';

interface GrammarSidebarProps {
    selectedLevel: string;
    onLevelChange: (level: string) => void;
}

const LEVELS = [
    { id: 'A1', name: 'A1', description: 'Beginner' },
    { id: 'A2', name: 'A2', description: 'Elementary' },
    { id: 'B1', name: 'B1', description: 'Intermediate' },
    { id: 'B2', name: 'B2', description: 'Upper Intermediate' },
    { id: 'C1', name: 'C1', description: 'Advanced' },
    { id: 'C2', name: 'C2', description: 'Proficient' },
    { id: 'ALL', name: 'All', description: 'All Levels' },
];

export default function GrammarSidebar({ selectedLevel, onLevelChange }: GrammarSidebarProps) {
    return (
        <>
            {/* Mobile: Horizontal Scrollable Filter */}
            <div className="md:hidden mb-6 -mx-4 px-4">
                <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Levels</h2>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {LEVELS.map((level) => (
                        <Button
                            key={level.id}
                            onClick={() => onLevelChange(level.id)}
                            size="sm"
                            variant={selectedLevel === level.id ? 'default' : 'outline'}
                            className={`flex-shrink-0 ${selectedLevel === level.id
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-transparent dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            {level.name}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Desktop: Vertical Sidebar */}
            <aside className="hidden md:block w-48 flex-shrink-0">
                <div className="sticky top-24">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Levels</h2>
                    <div className="space-y-2">
                        {LEVELS.map((level) => (
                            <Button
                                key={level.id}
                                onClick={() => onLevelChange(level.id)}
                                variant={selectedLevel === level.id ? 'default' : 'outline'}
                                className={`w-full justify-start ${selectedLevel === level.id
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                                    : 'bg-transparent dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                {level.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </aside>
        </>
    );
}

