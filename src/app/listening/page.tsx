'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ListeningSidebar from '@/components/ListeningSidebar';
import ListeningList from '@/components/ListeningList';
import AddListeningModal from '@/components/AddListeningModal';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

interface ListeningEpisode {
    id: string;
    title: string;
    level: string;
    topic: string;
    order: number;
    audioUrl: string;
    duration: string;
    transcript: string;
    notes?: string;
    dateAdded: number;
}

export default function ListeningPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';
    const [episodes, setEpisodes] = useState<ListeningEpisode[]>([]);
    const [selectedTopic, setSelectedTopic] = useState('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

    useEffect(() => {
        fetchEpisodes();
    }, []);

    const fetchEpisodes = async () => {
        try {
            const res = await fetch('/api/listening');
            const data = await res.json();
            if (Array.isArray(data)) {
                setEpisodes(data);
            }
        } catch (error) {
            console.error('Failed to fetch episodes:', error);
        }
    };

    const handleAddEpisode = async (newEpisode: ListeningEpisode) => {
        // Optimistic update
        setEpisodes([newEpisode, ...episodes]);

        // Re-fetch to get the real data from Notion
        await new Promise(resolve => setTimeout(resolve, 1000));
        await fetchEpisodes();
    };

    const handleDeleteEpisode = async (id: string) => {
        try {
            const res = await fetch(`/api/listening/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setEpisodes(episodes.filter(ep => ep.id !== id));
            } else {
                console.error('Failed to delete episode');
            }
        } catch (error) {
            console.error('Error deleting episode:', error);
        }
    };

    const handleEpisodePlay = (episodeId: string) => {
        // Set this episode as currently playing (pauses others)
        setCurrentlyPlaying(episodeId);
    };

    // Filter by topic
    const filteredEpisodes = selectedTopic === 'ALL'
        ? episodes
        : episodes.filter(ep => ep.topic === selectedTopic);

    return (
        <div className="min-h-screen">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header Section */}
                {/* Header Section */}
                <PageHeader
                    title="Listening"
                    description={selectedTopic === 'ALL'
                        ? 'All listening episodes'
                        : `Episodes: ${selectedTopic}`}
                    rightAction={isAdmin && (
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 w-full sm:w-auto"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Episode
                        </Button>
                    )}
                />

                {/* Main Content */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Sidebar */}
                    <ListeningSidebar
                        selectedTopic={selectedTopic}
                        onTopicChange={setSelectedTopic}
                    />

                    {/* Episodes List */}
                    <div className="flex-1 min-w-0">
                        <ListeningList
                            episodes={filteredEpisodes}
                            currentlyPlaying={currentlyPlaying}
                            onEpisodePlay={handleEpisodePlay}
                            onDelete={handleDeleteEpisode}
                            isAdmin={isAdmin}
                        />
                    </div>
                </div>

                {/* Add Episode Modal */}
                <AddListeningModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAdd={handleAddEpisode}
                />
            </main >
        </div >
    );
}
