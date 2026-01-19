import { NextResponse } from 'next/server';
import { deleteListeningEpisode } from '@/lib/listening';

import { auth } from '@/auth';

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
