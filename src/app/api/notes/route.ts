import { NextResponse } from 'next/server';
import { getNotes, addNote } from '@/lib/notes';

export async function GET() {
    try {
        const data = await getNotes();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('GET /api/notes Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch notes',
            message: error.message,
        }, { status: 500 });
    }
}

import { auth } from '@/auth';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const { title, content, category, tags, order } = body;

        if (!title || !content) {
            return NextResponse.json({
                error: 'Missing required fields: title, content'
            }, { status: 400 });
        }

        await addNote({ title, content, category, tags, order });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('API POST /api/notes error:', error);
        return NextResponse.json({
            error: 'Failed to add note',
            message: error.message,
        }, { status: 500 });
    }
}
