import { NextResponse } from 'next/server';
import { updateUserPassword } from '@/lib/auth';
import { sql } from '@/lib/db';
import { z } from 'zod';

const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validated = resetPasswordSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json(
                { error: validated.error.errors[0].message },
                { status: 400 }
            );
        }

        const { token, password } = validated.data;

        // Find valid token
        const result = await sql`
            SELECT user_id, expires 
            FROM password_reset_tokens 
            WHERE token = ${token}
            LIMIT 1
        `;

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        const resetToken = result.rows[0];
        const expiresAt = new Date(resetToken.expires);

        // Check if token is expired
        if (expiresAt < new Date()) {
            // Delete expired token
            await sql`DELETE FROM password_reset_tokens WHERE token = ${token}`;
            return NextResponse.json(
                { error: 'Reset token has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Update password
        const updated = await updateUserPassword(resetToken.user_id, password);

        if (!updated) {
            return NextResponse.json(
                { error: 'Failed to update password' },
                { status: 500 }
            );
        }

        // Delete used token
        await sql`DELETE FROM password_reset_tokens WHERE token = ${token}`;

        return NextResponse.json({
            success: true,
            message: 'Password reset successful! You can now log in with your new password.',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
