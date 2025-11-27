import { NextResponse } from 'next/server';
import { deleteGrammarItem } from '@/lib/grammar';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteGrammarItem(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('API DELETE error:', error);
        return NextResponse.json({
            error: 'Failed to delete grammar item',
            message: error.message
        }, { status: 500 });
    }
}
