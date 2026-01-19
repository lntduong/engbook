import { NextResponse } from 'next/server';
import { getListeningEpisodes, addListeningEpisode, updateListeningEpisode } from '@/lib/listening';
import { auth } from '@/auth';

export async function GET() {
    try {
        const data = await getListeningEpisodes();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('GET /api/listening Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch listening episodes',
            message: error.message,
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const { title, level, topic, order, audioUrl, duration, transcript, notes } = body;

        if (!title || !level || !topic || !audioUrl || !transcript) {
            return NextResponse.json({
                error: 'Missing required fields: title, level, topic, audioUrl, transcript'
            }, { status: 400 });
        }

        await addListeningEpisode({ title, level, topic, order, audioUrl, duration, transcript, notes });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('API POST /api/listening error:', error);
        return NextResponse.json({
            error: 'Failed to add listening episode',
            message: error.message,
        }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {

        const body = await request.json();
        const { episodeId, myWriting } = body;

        if (!episodeId) {
            return NextResponse.json({
                error: 'Missing episode ID'
            }, { status: 400 });
        }

        await updateListeningEpisode(episodeId, myWriting || '');
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('API PATCH /api/listening error:', error);
        return NextResponse.json({
            error: 'Failed to update listening episode',
            message: error.message,
        }, { status: 500 });
    }
}
