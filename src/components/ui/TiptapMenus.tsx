import React, { useEffect, useState } from 'react';
import { BubbleMenuPlugin, BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu';
import { FloatingMenuPlugin, FloatingMenuPluginProps } from '@tiptap/extension-floating-menu';
import { Editor } from '@tiptap/react';

type BubbleMenuProps = Omit<BubbleMenuPluginProps, 'pluginKey' | 'editor' | 'element'> & {
    editor: Editor;
    className?: string;
    children: React.ReactNode;
    tippyOptions?: any;
};

export const BubbleMenu = ({ editor, className, children, ...props }: BubbleMenuProps) => {
    const [element, setElement] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!element || !editor) {
            return;
        }

        const plugin = BubbleMenuPlugin({
            pluginKey: 'bubbleMenu',
            editor,
            element,
            ...props,
        });

        editor.registerPlugin(plugin);
        return () => {
            editor.unregisterPlugin('bubbleMenu');
        };
    }, [editor, element, props]);

    return (
        <div ref={setElement} className={className} style={{ display: 'none' }}>
            {children}
        </div>
    );
};

type FloatingMenuProps = Omit<FloatingMenuPluginProps, 'pluginKey' | 'editor' | 'element'> & {
    editor: Editor;
    className?: string;
    children: React.ReactNode;
    tippyOptions?: any;
};

export const FloatingMenu = ({ editor, className, children, ...props }: FloatingMenuProps) => {
    const [element, setElement] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!element || !editor) {
            return;
        }

        const plugin = FloatingMenuPlugin({
            pluginKey: 'floatingMenu',
            editor,
            element,
            ...props,
        });

        editor.registerPlugin(plugin);
        return () => {
            editor.unregisterPlugin('floatingMenu');
        };
    }, [editor, element, props]);

    return (
        <div ref={setElement} className={className} style={{ display: 'none' }}>
            {children}
        </div>
    );
};
