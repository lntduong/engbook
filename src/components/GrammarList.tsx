'use client';

import GrammarItem from './GrammarItem';

interface GrammarItemType {
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

interface GrammarListProps {
    grammarList: GrammarItemType[];
    onDelete?: (id: string) => void;
    isAdmin?: boolean;
}

export default function GrammarList({ grammarList, onDelete, isAdmin }: GrammarListProps) {
    // Group by category
    const groupedByCategory = grammarList.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, GrammarItemType[]>);

    // Sort each category by order
    Object.keys(groupedByCategory).forEach(category => {
        groupedByCategory[category].sort((a, b) => a.order - b.order);
    });

    // Get sorted category names
    const categories = Object.keys(groupedByCategory).sort();

    if (grammarList.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-500 dark:text-slate-400 text-lg">
                    No grammar topics found for this level.
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
                    Try selecting a different level or add grammar topics using the + button.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {categories.map((category) => (
                <div key={category}>
                    {/* Category Header */}
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-b-2 border-blue-600 pb-2 inline-block">
                            {category}
                        </h2>
                    </div>

                    {/* Grammar Items */}
                    <div className="space-y-4">
                        {groupedByCategory[category].map((item, idx) => (
                            <GrammarItem
                                key={item.id}
                                grammar={item}
                                index={idx}
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
