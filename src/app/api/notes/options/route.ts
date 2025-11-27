import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const distinctCategories = await prisma.note.findMany({
            distinct: ['category'],
            select: { category: true },
            orderBy: { category: 'asc' },
        });

        // For tags, we need to fetch all and flatten since they are arrays
        const allNotes = await prisma.note.findMany({
            select: { tags: true },
        });

        const categories = distinctCategories.map(i => i.category).filter(Boolean);

        const allTags = allNotes.flatMap(note => note.tags);
        const uniqueTags = Array.from(new Set(allTags)).sort();

        return NextResponse.json({ categories, tags: uniqueTags });
    } catch (error: any) {
        console.error('GET /api/notes/options Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch notes options',
            message: error.message,
        }, { status: 500 });
    }
}
