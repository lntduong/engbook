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

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const exam = await prisma.exam.findUnique({
            where: { id },
        });

        if (!exam) {
            return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
        }

        return NextResponse.json(exam);
    } catch (error) {
        console.error('Error fetching exam:', error);
        return NextResponse.json({ error: 'Failed to fetch exam' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const result = examSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const answerKeyCount = Object.keys(result.data.answerKey).length;
        if (answerKeyCount !== result.data.questionsCount) {
            return NextResponse.json(
                { error: 'Invalid input', details: 'Answer key count does not match questions count' },
                { status: 400 }
            );
        }

        const exam = await prisma.exam.update({
            where: { id },
            data: result.data,
        });

        return NextResponse.json(exam);
    } catch (error) {
        console.error('Error updating exam:', error);
        return NextResponse.json({ error: 'Failed to update exam' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await prisma.exam.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Exam deleted successfully' });
    } catch (error) {
        console.error('Error deleting exam:', error);
        return NextResponse.json({ error: 'Failed to delete exam' }, { status: 500 });
    }
}
