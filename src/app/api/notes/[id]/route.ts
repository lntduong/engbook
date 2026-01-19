import { NextResponse } from 'next/server';
import { getNoteById, updateNote, deleteNote } from '@/lib/notes';
import { auth } from '@/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        console.log('GET /api/notes/[id] - Params:', resolvedParams);
        const { id } = resolvedParams;
        console.log('GET /api/notes/[id] - Fetching ID:', id);

        const note = await getNoteById(id);
        if (!note) {
            console.log('GET /api/notes/[id] - Note not found for ID:', id);
            return NextResponse.json({
                error: 'Note not found'
            }, { status: 404 });
        }
        return NextResponse.json(note);
    } catch (error: any) {
        console.error('GET /api/notes/[id] Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch note',
            message: error.message,
            stack: error.stack,
        }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const { title, content, category, tags, order } = body;

        // Create updates object with only defined fields
        const updates: any = {};
        if (title !== undefined) updates.title = title;
        if (content !== undefined) updates.content = content;
        if (category !== undefined) updates.category = category;
        if (tags !== undefined) updates.tags = tags;
        if (order !== undefined) updates.order = order;

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({
                error: 'No fields to update'
            }, { status: 400 });
        }

        await updateNote(id, updates);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('PATCH /api/notes/[id] error:', error);
        return NextResponse.json({
            error: 'Failed to update note',
            message: error.message,
        }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        await deleteNote(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('DELETE /api/notes/[id] error:', error);
        return NextResponse.json({
            error: 'Failed to delete note',
            message: error.message,
        }, { status: 500 });
    }
}
