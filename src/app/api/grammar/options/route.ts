import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Fetch distinct levels and categories from existing data
        const distinctLevels = await prisma.grammar.findMany({
            distinct: ['level'],
            select: { level: true },
            orderBy: { level: 'asc' },
        });

        const distinctCategories = await prisma.grammar.findMany({
            distinct: ['category'],
            select: { category: true },
            orderBy: { category: 'asc' },
        });

        const levels = distinctLevels.map(i => i.level).filter(Boolean);
        const categories = distinctCategories.map(i => i.category).filter(Boolean);

        // Ensure standard levels exist if data is empty
        const standardLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        const finalLevels = Array.from(new Set([...standardLevels, ...levels])).sort();

        return NextResponse.json({ levels: finalLevels, categories });
    } catch (error: any) {
        console.error('GET /api/grammar/options Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch grammar options',
            message: error.message,
        }, { status: 500 });
    }
}
