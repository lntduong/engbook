'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import FilterBar from '@/components/FilterBar';
import VocabTable from '@/components/VocabTable';
import AddWordModal from '@/components/AddWordModal';
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

export default function VocabPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';

    const [vocabList, setVocabList] = useState<VocabItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState('ALL');
    const [lessonFilter, setLessonFilter] = useState('ALL');
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchVocab();
    }, []);

    const fetchVocab = async () => {
        try {
            const res = await fetch('/api/vocab');
            const data = await res.json();
            if (Array.isArray(data)) {
                setVocabList(data);
            }
        } catch (error) {
            console.error('[page.tsx] Failed to fetch vocab:', error);
        }
    };

    const handleAddWord = async (newWord: VocabItem) => {
        // Optimistic update
        setVocabList([newWord, ...vocabList]);

        // Wait a bit for Notion to finish saving, then re-fetch to get the real data
        await new Promise(resolve => setTimeout(resolve, 1000));
        await fetchVocab();
    };

    const handleDeleteWord = async (id: string) => {
        try {
            const res = await fetch(`/api/vocab/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setVocabList(vocabList.filter(item => item.id !== id));
            } else {
                console.error('Failed to delete word');
            }
        } catch (error) {
            console.error('Error deleting word:', error);
        }
    };

    // Extract unique lessons
    const lessonOptions = Array.from(new Set(vocabList.map(item => item.lesson).filter(Boolean))) as string[];

    const filteredList = vocabList.filter(item => {
        const matchesSearch = item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.ipa.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = levelFilter === 'ALL' || item.level === levelFilter;
        const matchesLesson = lessonFilter === 'ALL' || item.lesson === lessonFilter;
        return matchesSearch && matchesLevel && matchesLesson;
    });

    const totalPages = Math.ceil(filteredList.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const currentData = filteredList.slice(startIndex, startIndex + pageSize);

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Vocabulary</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track your English vocabulary journey.</p>
                        </div>
                    </div>
                    {isAdmin && (
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Word
                        </Button>
                    )}
                </div>

                <FilterBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    levelFilter={levelFilter}
                    onLevelFilterChange={setLevelFilter}
                    lessonFilter={lessonFilter}
                    onLessonFilterChange={setLessonFilter}
                    lessonOptions={lessonOptions}
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />

                <VocabTable
                    data={currentData}
                    startIndex={startIndex}
                    onDelete={handleDeleteWord}
                    isAdmin={isAdmin}
                />

                <AddWordModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAdd={handleAddWord}
                />
            </div>
        </div>
    );
}
