import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const distinctLevels = await prisma.listening.findMany({
            distinct: ['level'],
            select: { level: true },
            orderBy: { level: 'asc' },
        });

        const distinctTopics = await prisma.listening.findMany({
            distinct: ['topic'],
            select: { topic: true },
            orderBy: { topic: 'asc' },
        });

        const levels = distinctLevels.map(i => i.level).filter(Boolean);
        const topics = distinctTopics.map(i => i.topic).filter(Boolean);

        const standardLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        const finalLevels = Array.from(new Set([...standardLevels, ...levels])).sort();

        return NextResponse.json({ levels: finalLevels, topics });
    } catch (error: any) {
        console.error('GET /api/listening/options Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch listening options',
            message: error.message,
        }, { status: 500 });
    }
}
