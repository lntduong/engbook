import { NextResponse } from 'next/server';
import { deleteVocabItem } from '@/lib/vocabulary';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteVocabItem(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('API DELETE error:', error);
        return NextResponse.json({
            error: 'Failed to delete word',
            message: error.message
        }, { status: 500 });
    }
}
