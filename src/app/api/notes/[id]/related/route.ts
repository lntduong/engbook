import { NextResponse } from 'next/server';
import { getRelatedNotes, getNoteById } from '@/lib/notes';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const noteId = id;
        const note = await getNoteById(noteId);

        if (!note) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        const relatedNotes = await getRelatedNotes(noteId, note.tags || []);
        return NextResponse.json(relatedNotes);
    } catch (error) {
        console.error('Error fetching related notes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch related notes' },
            { status: 500 }
        );
    }
}
