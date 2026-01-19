import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getAllUsers, updateUserRole, deleteUser } from '@/lib/auth';
import { z } from 'zod';

// GET all users (admin only)
export async function GET() {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const users = await getAllUsers();

        // Remove password hashes from response
        const sanitizedUsers = users.map(({ passwordHash, ...user }) => user);

        return NextResponse.json(sanitizedUsers);
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH update user role (admin only)
const updateRoleSchema = z.object({
    userId: z.string(),
    role: z.enum(['ADMIN', 'USER']),
});

export async function PATCH(request: Request) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const validated = updateRoleSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json(
                { error: validated.error.issues[0].message },
                { status: 400 }
            );
        }

        const { userId, role } = validated.data;

        // Prevent admin from demoting themselves
        if (userId.toString() === session.user.id && role === 'USER') {
            return NextResponse.json(
                { error: 'You cannot demote yourself' },
                { status: 400 }
            );
        }

        const updated = await updateUserRole(userId, role);

        if (!updated) {
            return NextResponse.json(
                { error: 'Failed to update user role' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update role error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE user (admin only)
const deleteUserSchema = z.object({
    userId: z.string(),
});

export async function DELETE(request: Request) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const userIdParam = searchParams.get('userId');

        if (!userIdParam) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const userId = userIdParam;
        const validated = deleteUserSchema.safeParse({ userId });

        if (!validated.success) {
            return NextResponse.json(
                { error: validated.error.issues[0].message },
                { status: 400 }
            );
        }

        // Prevent admin from deleting themselves
        if (userId.toString() === session.user.id) {
            return NextResponse.json(
                { error: 'You cannot delete yourself' },
                { status: 400 }
            );
        }

        const deleted = await deleteUser(userId);

        if (!deleted) {
            return NextResponse.json(
                { error: 'Failed to delete user' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
