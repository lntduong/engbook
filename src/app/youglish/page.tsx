'use client';

import { useState } from 'react';
import YouGlishWidget from '@/components/YouGlishWidget';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageHeader from "@/components/PageHeader";

export default function YouGlishPage() {
    const router = useRouter();
    const [input, setInput] = useState('');
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            setQuery(input.trim());
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <PageHeader
                title="Pronunciation"
                description="Improve your English pronunciation with real-world video examples."
            />

            <div className="bg-card rounded-xl shadow-lg p-6 mb-8 border border-border">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter a word or phrase (e.g. 'serendipity')"
                            className="pl-10 text-base sm:text-lg py-6 bg-background border-input"
                        />
                    </div>
                    <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                        Search
                    </Button>
                </form>
            </div>

            {query ? (
                <div className="bg-card rounded-xl shadow-lg p-6 border border-border overflow-hidden">
                    <h2 className="text-xl font-semibold mb-4 text-foreground">
                        Pronunciation for: <span className="text-primary">"{query}"</span>
                    </h2>
                    <YouGlishWidget query={query} />
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-12 bg-muted/50 rounded-xl border border-dashed border-border">
                    <p className="text-lg">Enter a word above to see how it's pronounced in real contexts.</p>
                </div>
            )}
        </div>
    );
}
