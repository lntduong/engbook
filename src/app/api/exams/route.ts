import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { auth } from '@/auth';

const examSchema = z.object({
    title: z.string().min(1),
    level: z.string(),
    duration: z.number().int().positive(),
    content: z.string(),
    answerKey: z.record(z.string()),
    questionsCount: z.number().int().positive(),
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const level = searchParams.get('level');

        const exams = await prisma.exam.findMany({
            where: level && level !== 'All' ? { level } : undefined,
            orderBy: { dateAdded: 'desc' },
            select: {
                id: true,
                title: true,
                level: true,
                duration: true,
                questionsCount: true,
                dateAdded: true,
            }
        });

        return NextResponse.json(exams);
    } catch (error) {
        console.error('Error fetching exams:', error);
        return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const result = examSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: result.error.flatten() },
                { status: 400 }
            );
        } // Validate that answerKey matches questionsCount
        const answerKeyCount = Object.keys(result.data.answerKey).length;
        if (answerKeyCount !== result.data.questionsCount) {
            return NextResponse.json(
                { error: 'Invalid input', details: 'Answer key count does not match questions count' },
                { status: 400 }
            );
        }


        const exam = await prisma.exam.create({
            data: result.data,
        });

        return NextResponse.json(exam, { status: 201 });
    } catch (error) {
        console.error('Error creating exam:', error);
        return NextResponse.json({ error: 'Failed to create exam' }, { status: 500 });
    }
}
