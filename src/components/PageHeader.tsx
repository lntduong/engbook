'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    description?: string;
    backHref?: string;
    rightAction?: ReactNode;
}

export default function PageHeader({
    title,
    description,
    backHref = '/',
    rightAction
}: PageHeaderProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(backHref)}
                    className="hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
                >
                    <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                    Back
                </Button>
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 truncate">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {rightAction && (
                <div className="flex-shrink-0 w-full sm:w-auto">
                    {rightAction}
                </div>
            )}
        </div>
    );
}
