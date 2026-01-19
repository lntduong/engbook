'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
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
import 'katex/dist/katex.min.css'; // Import KaTeX styles
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Eye, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder, className }: MarkdownEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [activeTab, setActiveTab] = useState('write');
    const [wordWrap, setWordWrap] = useState(true);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    // Adjust height on value change and init
    React.useEffect(() => {
        if (activeTab === 'write') {
            adjustHeight();
        }
    }, [value, activeTab, wordWrap]);

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            onChange(content);
        };
        reader.readAsText(file);

        // Reset input so same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={cn("flex flex-col border rounded-lg overflow-hidden bg-background", className)}>
            <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b sticky top-0 z-10 backdrop-blur-md">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="write" className="flex items-center gap-2">
                            <Code className="w-4 h-4" /> Write
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="flex items-center gap-2">
                            <Eye className="w-4 h-4" /> Preview
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-2">
                    {activeTab === 'write' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setWordWrap(!wordWrap)}
                            className={cn("text-muted-foreground hover:text-foreground", !wordWrap && "text-primary font-medium")}
                            title="Toggle Word Wrap"
                        >
                            <span className="text-xs">{wordWrap ? "Wrap: On" : "Wrap: Off"}</span>
                        </Button>
                    )}
                    <div className="h-4 w-[1px] bg-border mx-1" />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".md,.txt"
                        className="hidden"
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={triggerFileUpload}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Import Markdown
                    </Button>
                </div>
            </div>

            <div className="relative min-h-[500px]">
                {activeTab === 'write' ? (
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => {
                            onChange(e.target.value);
                            adjustHeight();
                        }}
                        placeholder={placeholder || "Write markdown code here..."}
                        className={cn(
                            "w-full min-h-[500px] p-6 bg-background text-foreground font-mono text-sm focus:outline-none overflow-hidden block",
                            wordWrap ? "whitespace-pre-wrap" : "whitespace-pre overflow-x-auto"
                        )}
                        spellCheck={false}
                    />
                ) : (
                    <div className="w-full min-h-[500px] p-6 overflow-auto bg-background">
                        <div className="prose prose-slate dark:prose-invert max-w-none prose-code:before:content-none prose-code:after:content-none prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm">
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
                                {value || '*Nothing to preview*'}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>

            <div className="px-4 py-2 bg-muted/30 border-t text-xs text-muted-foreground flex justify-between">
                <span>Markdown Supported</span>
                <span>{value.length} chars</span>
            </div>
        </div >
    );
}
