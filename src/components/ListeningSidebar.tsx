'use client';

import { Button } from '@/components/ui/button';

interface ListeningSidebarProps {
    selectedTopic: string;
    onTopicChange: (topic: string) => void;
}

const TOPICS = [
    { id: 'Daily Conversation', name: 'Daily Conversation' },
    { id: 'Work & Business', name: 'Work & Business' },
    { id: 'Travel', name: 'Travel' },
    { id: 'Education', name: 'Education' },
    { id: 'Shopping', name: 'Shopping' },
    { id: 'Health', name: 'Health' },
    { id: 'Entertainment', name: 'Entertainment' },
    { id: 'ALL', name: 'All Topics' },
];

export default function ListeningSidebar({ selectedTopic, onTopicChange }: ListeningSidebarProps) {
    return (
        <>
            {/* Mobile: Horizontal Scrollable Filter */}
            <div className="md:hidden mb-6 -mx-4 px-4">
                <h2 className="text-sm font-semibold text-slate-600 mb-3">Topics</h2>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {TOPICS.map((topic) => (
                        <Button
                            key={topic.id}
                            onClick={() => onTopicChange(topic.id)}
                            size="sm"
                            variant={selectedTopic === topic.id ? 'default' : 'outline'}
                            className={`flex-shrink-0 whitespace-nowrap ${selectedTopic === topic.id
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-white hover:bg-blue-50 text-slate-700 border-slate-200'
                                }`}
                        >
                            {topic.name}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Desktop: Vertical Sidebar */}
            <aside className="hidden md:block w-48 flex-shrink-0">
                <div className="sticky top-24">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Topics</h2>
                    <div className="space-y-2">
                        {TOPICS.map((topic) => (
                            <Button
                                key={topic.id}
                                onClick={() => onTopicChange(topic.id)}
                                variant={selectedTopic === topic.id ? 'default' : 'outline'}
                                className={`w-full justify-start text-left ${selectedTopic === topic.id
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-white hover:bg-blue-50 text-slate-700 border-slate-200'
                                    }`}
                            >
                                {topic.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </aside>
        </>
    );
}

