import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { BlockNoteView } from '@blocknote/shadcn';
import { useCreateBlockNote } from '@blocknote/react';
import '@blocknote/shadcn/style.css';
import ErrorBoundary from './ErrorBoundary';
import { useTheme } from 'next-themes';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    outputFormat?: 'json' | 'html';
}

function Editor({ value, onChange, placeholder, outputFormat = 'json' }: RichTextEditorProps) {
    const { theme, systemTheme } = useTheme();
    const editor = useCreateBlockNote({
        uploadFile: async (file: File) => {
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                const data = await response.json();
                return data.url;
            } catch (error) {
                console.error('Error uploading file:', error);
                // Fallback to Base64 Data URL for persistence if upload fails
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
            }
        },
    });

    // Expose editor to window for debugging
    useEffect(() => {
        if (editor) {
            // @ts-ignore
            window.editor = editor;
        }
    }, [editor]);
    const [initialContentLoaded, setInitialContentLoaded] = useState(false);

    useEffect(() => {
        if (!editor || initialContentLoaded) return;

        const loadContent = async () => {
            if (value) {
                try {
                    if (value.trim().startsWith('[')) {
                        const blocks = JSON.parse(value);
                        editor.replaceBlocks(editor.document, blocks);
                    } else {
                        const blocks = await editor.tryParseHTMLToBlocks(value);
                        editor.replaceBlocks(editor.document, blocks);
                    }
                } catch (e) {
                    console.error("Error parsing content:", e);
                    // Fallback to HTML parsing if JSON fails
                    const blocks = await editor.tryParseHTMLToBlocks(value);
                    editor.replaceBlocks(editor.document, blocks);
                }
            }
            setInitialContentLoaded(true);
        };

        loadContent();
    }, [editor, value, initialContentLoaded]);

    const handleChange = async () => {
        if (editor) {
            if (outputFormat === 'html') {
                const html = await editor.blocksToHTMLLossy(editor.document);
                onChange(html);
            } else {
                // Save as JSON blocks for better fidelity
                const json = JSON.stringify(editor.document);
                onChange(json);
            }
        }
    };

    if (!editor) {
        return <div>Loading editor...</div>;
    }

    const currentTheme = theme === 'system' ? systemTheme : theme;

    return (
        <div className="border border-input rounded-lg overflow-hidden bg-background relative flex flex-col h-full min-h-[300px]">
            <ErrorBoundary fallback={<div className="p-4 text-destructive">Error loading editor content. Please try refreshing.</div>}>
                <BlockNoteView editor={editor} onChange={handleChange} theme={currentTheme === 'dark' ? 'dark' : 'light'} />
            </ErrorBoundary>
        </div>
    );
}

export default dynamic(() => Promise.resolve(Editor), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full animate-pulse bg-muted rounded-lg" />
});
