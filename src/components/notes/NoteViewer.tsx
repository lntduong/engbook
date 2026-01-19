'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import remarkEmoji from 'remark-emoji';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';

interface NoteViewerProps {
    content: string;
    title?: string;
}

export default function NoteViewer({ content, title }: NoteViewerProps) {
    // Basic check to see if content is BlockNote JSON
    const isBlockNoteJSON = content && content.trim().startsWith('[') && content.includes('"id":') && content.includes('"type":');
    const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

    useEffect(() => {
        if (isBlockNoteJSON) return;

        // Wait for rendering to complete
        const timer = setTimeout(() => {
            const elements = document.querySelectorAll('.prose h1, .prose h2, .prose h3, .prose h4');
            const items = Array.from(elements).map((el) => ({
                id: el.id,
                text: el.textContent || '',
                level: parseInt(el.tagName.charAt(1)),
            })).filter(item => item.id && item.text);
            setHeadings(items);
        }, 500);

        return () => clearTimeout(timer);
    }, [content, title, isBlockNoteJSON]);

    const scrollToHeading = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, '', `#${id}`);
        }
    };

    if (isBlockNoteJSON) {
        return (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="font-semibold mb-2">Legacy Format Detected</p>
                <p>This note is in an older format. Please edit and save it to convert to Markdown.</p>
                <pre className="mt-4 p-4 bg-white dark:bg-black rounded border overflow-auto text-xs opacity-50 max-h-40">
                    {content}
                </pre>
            </div>
        );
    }

    // Smart logic: If a title is provided (meaning it's displayed externally), 
    // we assume that is the main H1. If the content *also* starts with an H1, regularless of exact text match,
    // we strip it to avoid visual duplication/competition.
    // Also strips any immediate horizontal rule following that title.
    let displayContent = content;
    if (title) {
        let trimmedContent = content.trim();

        // Regex to match ANY starting H1: Starts with `#` followed by space, then content, then newline
        const genericH1Regex = /^\s*#\s+[^\n]+(\n|$)/;

        let headerRemoved = false;
        if (genericH1Regex.test(trimmedContent)) {
            // Remove the first H1 line
            trimmedContent = trimmedContent.replace(genericH1Regex, '').trim();
            headerRemoved = true;
        }

        // If we removed the header, check for horizontal rule (---, ***, ___)
        if (headerRemoved) {
            const hrRegex = /^\s*(-{3,}|\*{3,}|_{3,})\s*(\n|$)/;
            if (hrRegex.test(trimmedContent)) {
                trimmedContent = trimmedContent.replace(hrRegex, '').trim();
            }
        }

        displayContent = trimmedContent;
    }

    return (
        <div className="flex flex-col xl:flex-row gap-8 relative items-start">
            {/* Main Content */}
            <div className="flex-1 w-full min-w-0">
                <div className="prose prose-slate dark:prose-invert max-w-none 
                    prose-code:before:content-none prose-code:after:content-none 
                    prose-code:bg-gray-100 dark:prose-code:bg-gray-800 
                    prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 
                    prose-code:font-mono prose-code:text-sm
                    [&_h1_a]:no-underline [&_h2_a]:no-underline [&_h3_a]:no-underline [&_h4_a]:no-underline
                    [&_h1_a]:text-inherit [&_h2_a]:text-inherit [&_h3_a]:text-inherit [&_h4_a]:text-inherit
                    [&_h1_a]:font-inherit [&_h2_a]:font-inherit [&_h3_a]:font-inherit [&_h4_a]:font-inherit
                ">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath, remarkBreaks, remarkEmoji]}
                        rehypePlugins={[
                            rehypeHighlight,
                            rehypeKatex,
                            rehypeSlug,
                            [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                            [rehypeExternalLinks, { target: '_blank', rel: ['nofollow', 'noopener', 'noreferrer'] }]
                        ]}
                    >
                        {displayContent}
                    </ReactMarkdown>
                </div>
            </div>

            {/* Floating TOC (Desktop only) */}
            {headings.length > 0 && (
                <div className="hidden xl:block w-72 shrink-0 sticky top-24">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
                        <h4 className="font-semibold text-sm mb-3 text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            Mục lục
                        </h4>
                        <ul className="space-y-2 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar text-sm">
                            {headings.map((heading) => (
                                <li
                                    key={heading.id}
                                    style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                                >
                                    <a
                                        href={`#${heading.id}`}
                                        onClick={(e) => scrollToHeading(heading.id, e)}
                                        className="block text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors line-clamp-2"
                                    >
                                        {heading.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
