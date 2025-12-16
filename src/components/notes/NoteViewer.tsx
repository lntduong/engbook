'use client';

import { useState, useEffect } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import '@blocknote/shadcn/style.css';

import { useTheme } from 'next-themes';

interface NoteViewerProps {
    content: string;
}

export default function NoteViewer({ content }: NoteViewerProps) {
    const editor = useCreateBlockNote();
    const [initialContentLoaded, setInitialContentLoaded] = useState(false);
    const { theme, systemTheme } = useTheme();

    useEffect(() => {
        if (!editor || initialContentLoaded) return;

        const loadContent = async () => {
            if (content) {
                try {
                    // Check if content is JSON (starts with '[')
                    if (content.trim().startsWith('[')) {
                        const blocks = JSON.parse(content);
                        editor.replaceBlocks(editor.document, blocks);
                    } else {
                        // Fallback for HTML content
                        const blocks = await editor.tryParseHTMLToBlocks(content);
                        editor.replaceBlocks(editor.document, blocks);
                    }
                } catch (e) {
                    console.error("Error loading content:", e);
                }
            }
            setInitialContentLoaded(true);
        };

        loadContent();
    }, [editor, content, initialContentLoaded]);

    if (!editor || !initialContentLoaded) {
        return <div className="animate-pulse h-20 bg-muted rounded-lg"></div>;
    }

    const currentTheme = theme === 'system' ? systemTheme : theme;

    return <BlockNoteView editor={editor} editable={false} theme={currentTheme === 'dark' ? 'dark' : 'light'} />;
}
