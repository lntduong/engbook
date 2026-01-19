import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const readings = await prisma.reading.findMany({
            skip,
            take: limit,
            orderBy: { dateAdded: 'desc' }
        });

        const total = await prisma.reading.count();

        return NextResponse.json({
            data: readings,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching readings:', error);
        return NextResponse.json({ error: 'Failed to fetch readings' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, topic, level, content, vocab, grammar, questions } = body;

        const newReading = await prisma.reading.create({
            data: {
                title,
                topic,
                level,
                content,
                vocab, // Prisma handles Json type automatically
                grammar,
                questions
            }
        });

        return NextResponse.json(newReading);
    } catch (error) {
        console.error('Error saving reading:', error);
        return NextResponse.json({ error: 'Failed to save reading' }, { status: 500 });
    }
}
