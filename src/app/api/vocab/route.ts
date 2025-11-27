import { NextResponse } from 'next/server';
import { getVocab, addVocabItem } from '@/lib/vocabulary';

export async function GET() {
    try {
        const data = await getVocab();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('GET Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch data',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await addVocabItem(body);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('API POST error:', error);
        return NextResponse.json({
            error: 'Failed to add word',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
