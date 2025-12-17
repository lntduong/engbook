'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import RichTextEditor from '@/components/ui/RichTextEditor';
import AnswerKeyConfig from '@/components/admin/AnswerKeyConfig';

const LEVELS = ['IELTS', 'TOEIC', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function NewExamPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        level: '',
        duration: 90,
        content: '', // HTML content
        questionsCount: 0,
    });
    const [answerKey, setAnswerKey] = useState<Record<string, string>>({});



    const handleSubmit = async () => {
        if (!formData.title || !formData.level || !formData.content || formData.questionsCount <= 0) {
            alert('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/exams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    answerKey
                }),
            });

            if (res.ok) {
                router.push('/exams');
            } else {
                const data = await res.json();
                alert(`Error: ${data.message || 'Failed to create exam'}`);
            }
        } catch (error) {
            console.error('Create exam error', error);
            alert('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 h-16 px-4 flex items-center justify-between shadow-sm border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white">Create New Exam</h1>
                </div>
            </header>

            <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
                {/* Main Form */}
                <div className="lg:col-span-9 space-y-6">
                    <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl border-slate-200/50 dark:border-slate-800/50">
                        <div className="space-y-4">
                            <div>
                                <Label>Exam Title</Label>
                                <Input
                                    placeholder="e.g. Exam A1 level July 2023"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Level</Label>
                                    <Select
                                        value={formData.level}
                                        onValueChange={v => setFormData({ ...formData, level: v })}
                                    >
                                        <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                            <SelectValue placeholder="Select Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Duration (minutes)</Label>
                                    <Input
                                        type="number"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                                        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl border-slate-200/50 dark:border-slate-800/50">
                        <Label className="mb-2 block">Exam Content</Label>
                        <p className="text-xs text-muted-foreground mb-4">
                            Use the editor below to format your exam content. You can paste directly from Word or website.
                        </p>
                        <div className="min-h-[500px]">
                            <RichTextEditor
                                value={formData.content}
                                onChange={(content: string) => setFormData({ ...formData, content })}
                                outputFormat="html"
                                placeholder="Start typing your exam questions..."
                            />
                        </div>
                    </Card>
                </div>

                {/* Sidebar: Answer Key */}
                <div className="lg:col-span-3 space-y-6">
                    <AnswerKeyConfig
                        questionsCount={formData.questionsCount}
                        onQuestionsCountChange={(count) => setFormData({ ...formData, questionsCount: count })}
                        answerKey={answerKey}
                        onAnswerKeyChange={setAnswerKey}
                        onSave={handleSubmit}
                        loading={loading}
                    />
                </div>
            </main>
        </div>
    );
}
