'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function ReadingCard() {
    const router = useRouter();

    return (
        <Card
            className="hover:shadow-xl transition-all duration-300 cursor-pointer border-indigo-100 dark:border-slate-800 group hover:-translate-y-1 bg-white dark:bg-slate-900"
            onClick={() => router.push('/reading')}
        >
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl group-hover:text-indigo-600 transition-colors">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    Reading Practice
                </CardTitle>
                <CardDescription className="text-base pt-2">
                    Generate AI stories based on topics & levels. Improve comprehension with vocab & quizzes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-slate-500 font-medium">
                    Features: AI Generation • Vocabulary • Grammar • Quizzes
                </div>
            </CardContent>
        </Card>
    );
}
