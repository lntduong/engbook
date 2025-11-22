'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface NoteEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export default function NoteEditor({ value, onChange, placeholder = 'Start writing your notes...' }: NoteEditorProps) {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'color', 'background',
        'link'
    ];

    return (
        <div className="note-editor-container">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={(content, delta, source, editor) => {
                    console.log('ReactQuill onChange:', content);
                    onChange(content);
                }}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                className="bg-white rounded-lg"
                style={{ height: '300px', marginBottom: '50px' }}
            />
        </div>
    );
}
