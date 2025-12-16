'use client';

import ListeningEpisode from './ListeningEpisode';

interface ListeningEpisodeType {
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

interface ListeningListProps {
    episodes: ListeningEpisodeType[];
    currentlyPlaying: string | null;
    onEpisodePlay: (episodeId: string) => void;
    onDelete?: (id: string) => void;
    isAdmin?: boolean;
}

export default function ListeningList({ episodes, currentlyPlaying, onEpisodePlay, onDelete, isAdmin }: ListeningListProps) {
    // Group by topic
    const groupedByTopic = episodes.reduce((acc, episode) => {
        if (!acc[episode.topic]) {
            acc[episode.topic] = [];
        }
        acc[episode.topic].push(episode);
        return acc;
    }, {} as Record<string, ListeningEpisodeType[]>);

    // Sort each topic by order
    Object.keys(groupedByTopic).forEach(topic => {
        groupedByTopic[topic].sort((a, b) => a.order - b.order);
    });

    // Get sorted topic names
    const topics = Object.keys(groupedByTopic).sort();

    if (episodes.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-500 dark:text-slate-400 text-lg">
                    No listening episodes found for this topic.
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
                    Try selecting a different topic or add episodes using the + button.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {topics.map((topic) => (
                <div key={topic}>
                    {/* Topic Header */}
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-b-2 border-blue-600 pb-2 inline-block">
                            {topic}
                        </h2>
                    </div>

                    {/* Episodes */}
                    <div className="space-y-4">
                        {groupedByTopic[topic].map((episode) => (
                            <ListeningEpisode
                                key={episode.id}
                                episode={episode}
                                onPlay={() => onEpisodePlay(episode.id)}
                                shouldPause={currentlyPlaying !== null && currentlyPlaying !== episode.id}
                                onDelete={onDelete}
                                isAdmin={isAdmin}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
