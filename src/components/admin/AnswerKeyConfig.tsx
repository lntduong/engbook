'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Save, FileJson, List } from 'lucide-react';

interface AnswerKeyConfigProps {
    questionsCount: number;
    onQuestionsCountChange: (count: number) => void;
    answerKey: Record<string, string>;
    onAnswerKeyChange: (key: Record<string, string>) => void;
    onSave: () => void;
    loading: boolean;
    saveLabel?: string;
}

export default function AnswerKeyConfig({
    questionsCount,
    onQuestionsCountChange,
    answerKey,
    onAnswerKeyChange,
    onSave,
    loading,
    saveLabel = 'Save Exam'
}: AnswerKeyConfigProps) {
    const [mode, setMode] = useState<'manual' | 'json'>('manual');
    const [jsonInput, setJsonInput] = useState('');
    const [jsonError, setJsonError] = useState<string | null>(null);

    // Sync JSON input when switching to JSON mode or when answerKey changes (only if in manual mode to avoid overwriting user typing)
    useEffect(() => {
        if (mode === 'manual') {
            setJsonInput(JSON.stringify(answerKey, null, 2));
        }
    }, [answerKey, mode]);

    const handleGenerateKeys = () => {
        const newKeys: Record<string, string> = {};
        for (let i = 1; i <= questionsCount; i++) {
            newKeys[i.toString()] = answerKey[i.toString()] || 'A';
        }
        onAnswerKeyChange(newKeys);
    };

    const handleKeyChange = (qId: string, value: string) => {
        onAnswerKeyChange({ ...answerKey, [qId]: value });
    };

    const handleJsonChange = (value: string) => {
        setJsonInput(value);
        try {
            const parsed = JSON.parse(value);
            if (typeof parsed !== 'object' || parsed === null) {
                throw new Error('Invalid JSON object');
            }
            // Basic validation: keys should be numbers, values should be strings
            // We won't strict validate too much to allow flexibility, but we expect Record<string, string>
            setJsonError(null);
            onAnswerKeyChange(parsed as Record<string, string>);
        } catch (e) {
            setJsonError((e as Error).message);
        }
    };

    return (
        <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl border-slate-200/50 dark:border-slate-800/50 h-full max-h-[calc(100vh-100px)] flex flex-col sticky top-20">
            <h3 className="font-semibold mb-4">Answer Key Configuration</h3>

            {/* Questions Count Input */}
            <div className="flex items-end gap-2 mb-6">
                <div className="flex-1">
                    <Label>Total Questions</Label>
                    <Input
                        type="number"
                        value={questionsCount}
                        onChange={e => onQuestionsCountChange(parseInt(e.target.value) || 0)}
                        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    />
                </div>
                <Button onClick={handleGenerateKeys} variant="secondary">Set</Button>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center gap-2 mb-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <Button
                    variant={mode === 'manual' ? 'secondary' : 'ghost'}
                    className={`flex-1 ${mode === 'manual' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                    onClick={() => setMode('manual')}
                    size="sm"
                >
                    <List className="h-4 w-4 mr-2" /> Manual
                </Button>
                <Button
                    variant={mode === 'json' ? 'secondary' : 'ghost'}
                    className={`flex-1 ${mode === 'json' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                    onClick={() => setMode('json')}
                    size="sm"
                >
                    <FileJson className="h-4 w-4 mr-2" /> JSON
                </Button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 min-h-0">
                {mode === 'manual' ? (
                    Object.keys(answerKey).length > 0 ? (
                        Object.keys(answerKey).map((qId) => (
                            <div key={qId} className="flex items-center gap-2">
                                <span className="w-8 text-sm font-medium text-muted-foreground">{qId}.</span>
                                <Select
                                    value={answerKey[qId]}
                                    onValueChange={(val) => handleKeyChange(qId, val)}
                                >
                                    <SelectTrigger className="h-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['A', 'B', 'C', 'D'].map(opt => (
                                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground py-8 text-sm">
                            Set total questions to generate keys
                        </div>
                    )
                ) : (
                    <div className="h-full flex flex-col">
                        <Textarea
                            value={jsonInput}
                            onChange={(e) => handleJsonChange(e.target.value)}
                            className="flex-1 font-mono text-xs resize-none bg-slate-50 dark:bg-slate-950"
                            placeholder='{"1": "A", "2": "B" ...}'
                        />
                        {jsonError && (
                            <p className="text-xs text-red-500 mt-2">{jsonError}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Footer Action */}
            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20" onClick={onSave} disabled={loading}>
                    {loading ? 'Saving...' : (
                        <>
                            <Save className="h-4 w-4 mr-2" /> {saveLabel}
                        </>
                    )}
                </Button>
            </div>
        </Card>
    );
}
