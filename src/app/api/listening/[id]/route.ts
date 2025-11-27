import { NextResponse } from 'next/server';
import { deleteListeningEpisode } from '@/lib/listening';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteListeningEpisode(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('API DELETE error:', error);
        return NextResponse.json({
            error: 'Failed to delete listening episode',
            message: error.message
        }, { status: 500 });
    }
}
