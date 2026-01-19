'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import GrammarSidebar from '@/components/GrammarSidebar';
import GrammarList from '@/components/GrammarList';
import AddGrammarModal from '@/components/AddGrammarModal';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';

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

export default function GrammarPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';
    const [grammarList, setGrammarList] = useState<GrammarItem[]>([]);
    const [selectedLevel, setSelectedLevel] = useState('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchGrammar();
    }, []);

    const fetchGrammar = async () => {
        try {
            const res = await fetch('/api/grammar');
            const data = await res.json();
            if (Array.isArray(data)) {
                setGrammarList(data);
            }
        } catch (error) {
            console.error('Failed to fetch grammar:', error);
        }
    };

    const handleAddGrammar = async (newGrammar: GrammarItem) => {
        // Optimistic update
        setGrammarList([newGrammar, ...grammarList]);

        // Re-fetch to get the real data from Notion
        await new Promise(resolve => setTimeout(resolve, 1000));
        await fetchGrammar();
    };

    const handleDeleteGrammar = async (id: string) => {
        try {
            const res = await fetch(`/api/grammar/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setGrammarList(grammarList.filter(item => item.id !== id));
            } else {
                console.error('Failed to delete grammar item');
            }
        } catch (error) {
            console.error('Error deleting grammar item:', error);
        }
    };

    // Filter by level
    const filteredList = selectedLevel === 'ALL'
        ? grammarList
        : grammarList.filter(item => item.level === selectedLevel);

    return (
        <div className="min-h-screen">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
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
                        <div className="min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight truncate">Grammar</h1>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 truncate">
                                {selectedLevel === 'ALL'
                                    ? 'All grammar topics'
                                    : `Topics: ${selectedLevel}`}
                            </p>
                        </div>
                    </div>

                    {isAdmin && (
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 w-full sm:w-auto"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Grammar
                        </Button>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Sidebar */}
                    <GrammarSidebar
                        selectedLevel={selectedLevel}
                        onLevelChange={setSelectedLevel}
                    />

                    {/* Grammar List */}
                    <div className="flex-1 min-w-0">
                        <GrammarList
                            grammarList={filteredList}
                            onDelete={handleDeleteGrammar}
                            isAdmin={isAdmin}
                        />
                    </div>
                </div>

                {/* Add Grammar Modal */}
                <AddGrammarModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAdd={handleAddGrammar}
                />
            </main>
        </div>
    );
}
