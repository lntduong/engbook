import { Metadata } from 'next';
import { getNoteById, getRelatedNotes } from '@/lib/notes';
import NoteDetailClient from '@/components/notes/NoteDetailClient';
import { redirect } from 'next/navigation';

interface Props {
    params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const note = await getNoteById(params.id);

    if (!note) {
        return {
            title: 'Note Not Found',
        };
    }

    return {
        title: note.title,
        description: note.content.slice(0, 160).replace(/[#*`]/g, ''), // Strip md chars for description
        openGraph: {
            title: note.title,
            description: note.content.slice(0, 200).replace(/[#*`]/g, ''),
            type: 'article',
            publishedTime: new Date(note.dateCreated).toISOString(),
            modifiedTime: new Date(note.lastEdited).toISOString(),
            tags: note.tags,
            authors: ['Engbook User'],
        },
        authors: [{ name: 'Engbook User' }],
    };
}

export default async function NotePage({ params }: Props) {
    const note = await getNoteById(params.id);

    if (!note) {
        redirect('/notes');
    }

    const relatedNotes = await getRelatedNotes(note.id, note.tags || []);

    return <NoteDetailClient note={note} relatedNotes={relatedNotes} />;
}
