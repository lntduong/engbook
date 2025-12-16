'use client';

import Link from 'next/link';
import { Mail, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Navigation Links */}
                <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-6">
                    <Link
                        href="/"
                        className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base font-medium"
                    >
                        Home
                    </Link>
                    <Link
                        href="/vocabulary"
                        className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base font-medium"
                    >
                        Vocabulary
                    </Link>
                    <Link
                        href="/grammar"
                        className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base font-medium"
                    >
                        Grammar
                    </Link>
                    <Link
                        href="/listening"
                        className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base font-medium"
                    >
                        Listening
                    </Link>
                </nav>

                {/* Creator */}
                <p className="text-center text-slate-500 dark:text-slate-500 text-xs sm:text-sm mb-4">
                    Built by Thai Duong
                </p>

                {/* Tagline */}
                <p className="text-center text-slate-500 dark:text-slate-500 text-xs sm:text-sm mb-6 px-4">
                    Learn English effectively with interactive flashcards, grammar lessons, and listening exercises
                </p>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-4 mb-6">
                    <a
                        href="mailto:your-email@example.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                        aria-label="Email"
                    >
                        <Mail className="h-5 w-5" />
                    </a>
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                        aria-label="Facebook"
                    >
                        <Facebook className="h-5 w-5" />
                    </a>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                        aria-label="Instagram"
                    >
                        <Instagram className="h-5 w-5" />
                    </a>
                </div>

                {/* Copyright */}
                <p className="text-center text-slate-400 text-xs sm:text-sm">
                    © {currentYear} Thai Duong. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
