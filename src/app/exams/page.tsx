'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Clock, FileQuestion, ArrowRight, Plus, Pencil, Trash2, ArrowLeft, Filter } from 'lucide-react';

interface Exam {
    id: string;
    title: string;
    level: string;
    duration: number;
    questionsCount: number;
    dateAdded: string;
}

const LEVELS = ['IELTS', 'TOEIC', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function ExamsPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterLevel, setFilterLevel] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchExams();
    }, [filterLevel]);

    const fetchExams = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterLevel !== 'All') params.append('level', filterLevel);

            const res = await fetch(`/api/exams?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setExams(data);
            }
        } catch (error) {
            console.error('Failed to fetch exams', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this exam?')) return;

        try {
            const res = await fetch(`/api/exams/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setExams(exams.filter(ex => ex.id !== id));
            } else {
                alert('Failed to delete exam: Unauthorized');
            }
        } catch (error) {
            console.error('Error deleting exam', error);
        }
    };

    const filteredExams = exams.filter(exam =>
        exam.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';

    return (
        <div className="">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/')}
                            className="hover:bg-slate-100 flex-shrink-0"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Exams</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Practice with real exam questions and time limits.</p>
                        </div>
                    </div>
                    {isAdmin && (
                        <Button
                            onClick={() => router.push('/admin/exams/new')}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Create Exam
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <Card className="p-3 sm:p-4 mb-8 shadow-lg border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <div className="relative flex-1 min-w-0">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <Input
                                placeholder="Search exams..."
                                className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="w-full sm:w-auto sm:min-w-[140px]">
                            <Select value={filterLevel} onValueChange={setFilterLevel}>
                                <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 w-full text-slate-900 dark:text-slate-100">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                                        <SelectValue placeholder="Level" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Levels</SelectItem>
                                    {LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </Card>

                {/* Exam Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : filteredExams.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No exams found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredExams.map(exam => (
                            <Card key={exam.id} className="group hover:shadow-lg transition-all duration-300 border-border bg-card overflow-hidden flex flex-col">
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                            {exam.level}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(exam.dateAdded).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                        {exam.title}
                                    </h3>

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {exam.duration} mins
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FileQuestion className="h-4 w-4" />
                                            {exam.questionsCount} questions
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-border bg-muted/20 flex gap-2">
                                    <Button
                                        className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground"
                                        onClick={() => router.push(`/exams/${exam.id}`)}
                                    >
                                        Start Exam <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>

                                    {/* Admin Actions */}
                                    {isAdmin && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:text-primary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/admin/exams/${exam.id}/edit`);
                                                }}
                                                title="Edit Exam"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:text-destructive"
                                                onClick={(e) => handleDelete(exam.id, e)}
                                                title="Delete Exam"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
