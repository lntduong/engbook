import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const distinctLevels = await prisma.vocabulary.findMany({
            distinct: ['level'],
            select: { level: true },
            orderBy: { level: 'asc' },
        });

        const distinctTypes = await prisma.vocabulary.findMany({
            distinct: ['type'],
            select: { type: true },
            orderBy: { type: 'asc' },
        });

        const levels = distinctLevels.map(i => i.level).filter(Boolean);
        const types = distinctTypes.map(i => i.type).filter(Boolean);

        const standardLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        const finalLevels = Array.from(new Set([...standardLevels, ...levels])).sort();

        return NextResponse.json({
            levels: finalLevels,
            types: types,
        });
    } catch (error) {
        console.error('Error fetching options:', error);
        return NextResponse.json({ error: 'Failed to fetch options' }, { status: 500 });
    }
}
