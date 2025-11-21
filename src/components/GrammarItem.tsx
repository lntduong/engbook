'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface GrammarItem {
    id: string;
    title: string;
    level: string;
    category: string;
    order: number;
    explanation: string;
    structure?: string;
    examples: string;
    notes?: string;
    dateAdded: number;
}

interface GrammarItemProps {
    grammar: GrammarItem;
    index: number;
}

export default function GrammarItem({ grammar, index }: GrammarItemProps) {
    const [showNotes, setShowNotes] = useState(false);

    // Split examples by newline for bullet points
    const exampleList = grammar.examples.split('\n').filter(e => e.trim());

    return (
        <Card className="p-6 mb-4 bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-md transition-shadow">
            {/* Title and Badge */}
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                    {index + 1}. {grammar.title}
                </h3>
                <Badge
                    variant="secondary"
                    className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                    {grammar.level}
                </Badge>
            </div>

            {/* Structure */}
            {grammar.structure && (
                <div className="mb-4">
                    <p className="text-sm font-medium text-slate-600 mb-1">Structure:</p>
                    <p className="text-base font-mono bg-slate-50 px-3 py-2 rounded border border-slate-200 text-slate-800">
                        {grammar.structure}
                    </p>
                </div>
            )}

            {/* Explanation */}
            <div className="mb-4">
                <p className="text-sm font-medium text-slate-600 mb-1">Explanation:</p>
                <p className="text-base text-slate-700 leading-relaxed">
                    {grammar.explanation}
                </p>
            </div>

            {/* Examples */}
            <div className="mb-4">
                <p className="text-sm font-medium text-slate-600 mb-2">Examples:</p>
                <ul className="space-y-1.5 pl-1">
                    {exampleList.map((example, idx) => (
                        <li key={idx} className="flex items-start">
                            <span className="text-blue-600 mr-2 mt-0.5">•</span>
                            <span className="text-base text-slate-700 italic">{example}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Notes (collapsible) */}
            {grammar.notes && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNotes(!showNotes)}
                        className="text-slate-600 hover:text-slate-900 p-0 h-auto font-normal"
                    >
                        {showNotes ? (
                            <>
                                <ChevronUp className="h-4 w-4 mr-1" />
                                Hide Notes
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-4 w-4 mr-1" />
                                Show Notes
                            </>
                        )}
                    </Button>
                    {showNotes && (
                        <div className="mt-3 p-3 bg-amber-50 border-l-4 border-amber-400 rounded">
                            <p className="text-sm text-slate-700">{grammar.notes}</p>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}
