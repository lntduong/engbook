import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    href: string;
    color?: string; // Optional color class (e.g., 'text-blue-600')
}

export function FeatureCard({ icon: Icon, title, description, href, color = "text-blue-600" }: FeatureCardProps) {
    return (
        <Link
            href={href}
            className={cn(
                "group block relative overflow-hidden rounded-2xl border border-white/20 p-6",
                "bg-white/60 backdrop-blur-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
                "flex flex-col h-full"
            )}
        >
            <div className={cn("p-3 rounded-lg w-fit mb-4 bg-slate-50 group-hover:bg-blue-50 transition-colors", color)}>
                <Icon className="w-8 h-8" strokeWidth={1.5} />
            </div>

            <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                {title}
            </h3>

            <p className="text-slate-500 text-sm leading-relaxed">
                {description}
            </p>
        </Link>
    );
}
