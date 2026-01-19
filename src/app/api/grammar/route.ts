import { NextResponse } from 'next/server';
import { getGrammar, addGrammar } from '@/lib/grammar';

export async function GET() {
    try {
        const data = await getGrammar();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('GET /api/grammar Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch grammar data',
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
        const { title, level, category, order, explanation, structure, examples, notes } = body;

        if (!title || !level || !category || !explanation || !examples) {
            return NextResponse.json({
                error: 'Missing required fields: title, level, category, explanation, examples'
            }, { status: 400 });
        }

        await addGrammar({ title, level, category, order, explanation, structure, examples, notes });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('API POST /api/grammar error:', error);
        return NextResponse.json({
            error: 'Failed to add grammar',
            message: error.message,
        }, { status: 500 });
    }
}
