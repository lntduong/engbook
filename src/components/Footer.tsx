'use client';

import Link from 'next/link';
import { Mail, Facebook, Instagram, BookOpen } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const sections = [
        {
            title: "Learn",
            links: [
                { name: "Vocabulary", href: "/vocab" },
                { name: "Grammar", href: "/grammar" },
                { name: "Listening", href: "/listening" },
                { name: "Pronunciation", href: "/youglish" },
            ]
        },
        {
            title: "Practice",
            links: [
                { name: "Flashcards", href: "/flashcard" },
                { name: "Exercises", href: "/exercises" },
                { name: "Exams", href: "/exams" },
            ]
        },
        {
            title: "Tools",
            links: [
                { name: "Notes", href: "/notes" },
                { name: "Translator", href: "/translate" },
            ]
        }
    ];

    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
                    {/* Brand Section - Takes up 2 columns on large screens */}
                    <div className="lg:col-span-3 space-y-4">
                        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                            <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
                                <BookOpen className="h-5 w-5 text-white" />
                            </div>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300">
                                Engbook
                            </span>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
                            Learn English effectively with our comprehensive suite of tools. From vocabulary building to grammar mastery, we accompany you on your language journey.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <a
                                href="mailto:lntduong.dev@gmail.com"
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                                aria-label="Email"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                            <a
                                href="https://www.facebook.com/lntd.179/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="https://www.instagram.com/im.duong179/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-slate-400 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-full transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    {sections.map((section) => (
                        <div key={section.title} className="lg:col-span-1">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 dark:text-slate-500 text-sm">
                        © {currentYear} Thai Duong. All rights reserved.
                    </p>
                    <p className="text-slate-500 dark:text-slate-500 text-sm flex items-center gap-1">
                        Built with <span className="text-red-500">♥</span> by Thai Duong
                    </p>
                </div>
            </div>
        </footer>
    );
}
