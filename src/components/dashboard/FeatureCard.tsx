import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    href: string;
    color?: string; // Optional color class (e.g., 'text-blue-600')
    gradient?: string; // Optional gradient string
}

export function FeatureCard({ icon: Icon, title, description, href, color = "text-blue-600", gradient }: FeatureCardProps) {
    return (
        <Link
            href={href}
            style={gradient ? { '--card-gradient': gradient } as React.CSSProperties : undefined}
            className={cn(
                "group block relative overflow-hidden rounded-2xl border-white/20 dark:border-slate-800 p-6",
                "bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
                gradient && "bg-[image:var(--card-gradient)] dark:bg-none",
                "flex flex-col h-full"
            )}
        >
            <div className={cn("p-3 rounded-lg w-fit mb-4 dark:bg-slate-800/50 transition-colors", color)}>
                <Icon className="w-8 h-8" strokeWidth={1.5} />
            </div>

            <h3 className="text-xl font-semibold mb-2 transition-colors text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400">
                {title}
            </h3>

            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-400">
                {description}
            </p>
        </Link>
    );
}
