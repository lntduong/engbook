'use client';

import { useState } from 'react';
import YouGlishWidget from '@/components/YouGlishWidget';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
            <div className="flex items-center gap-4 mb-8">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/')}
                    className="hover:bg-slate-100"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-3xl font-bold text-slate-800">
                    YouGlish Pronunciation Search
                </h1>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-100">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter a word or phrase (e.g. 'serendipity')"
                            className="pl-10 text-lg py-6"
                        />
                    </div>
                    <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700">
                        Search
                    </Button>
                </form>
            </div>

            {query ? (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100 overflow-hidden">
                    <h2 className="text-xl font-semibold mb-4 text-slate-700">
                        Pronunciation for: <span className="text-blue-600">"{query}"</span>
                    </h2>
                    <YouGlishWidget query={query} />
                </div>
            ) : (
                <div className="text-center text-slate-500 py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-lg">Enter a word above to see how it's pronounced in real contexts.</p>
                </div>
            )}
        </div>
    );
}
