'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Clock, BarChart, ArrowLeft, MoreVertical, Trash2, Search, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ReadingItem {
    id: string;
    title: string;
    topic: string;
    level: string;
    dateAdded: string;
}

export default function ReadingListPage() {
    const router = useRouter();
    const [readings, setReadings] = useState<ReadingItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchReadings();
    }, []);

    const fetchReadings = async () => {
        try {
            const res = await fetch('/api/reading');
            const data = await res.json();
            if (data.data) {
                setReadings(data.data);
            }
        } catch (error) {
            console.error('Failed to load readings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Delete this reading?')) return;

        try {
            const res = await fetch(`/api/reading/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setReadings(prev => prev.filter(r => r.id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredReadings = readings.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-black py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                {/* Header */}
                <PageHeader
                    title="Reading Library"
                    description="Your personal collection of AI-generated stories and lessons."
                    rightAction={
                        <Button
                            onClick={() => router.push('/reading/new')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow-md"
                        >
                            <Plus className="w-4 h-4 mr-2" /> New Reading
                        </Button>
                    }
                />

                {/* Search & Filter Bar */}
                <div className="mb-10 relative max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Search by title or topic..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-slate-200 dark:border-slate-800 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 text-lg"
                    />
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredReadings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
                            <BookOpen className="h-10 w-10 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Library is empty</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm text-center">
                            {searchQuery ? "No readings match your search." : "Start your journey by generating your first AI reading lesson."}
                        </p>
                        {!searchQuery && (
                            <Button onClick={() => router.push('/reading/new')} variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                                Generate Now
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredReadings.map((reading) => (
                            <Card
                                key={reading.id}
                                className="group relative cursor-pointer border-0 shadow-sm hover:shadow-md bg-white dark:bg-slate-900 transition-all duration-300 rounded-3xl overflow-hidden ring-1 ring-slate-100 dark:ring-slate-800"
                                onClick={() => router.push(`/reading/${reading.id}`)}
                            >
                                <div className="absolute top-0 left-0 right-0 h-3 bg-[#A78BFA]" />
                                <CardHeader className="pt-8 pb-4 px-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300 hover:bg-indigo-100 rounded-full px-4 py-1 font-normal text-sm capitalize">
                                            {reading.topic}
                                        </Badge>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 rounded-full px-3 py-1 font-normal text-sm">
                                                {reading.level}
                                            </Badge>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-slate-600 -mr-2">
                                                        <MoreVertical className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={(e) => handleDelete(e, reading.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white leading-tight min-h-[4rem] line-clamp-2">
                                        {reading.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardFooter className="px-6 pb-6 pt-0">
                                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-full text-sm font-medium">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <span>{new Date(reading.dateAdded).toLocaleDateString()}</span>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
