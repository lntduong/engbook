import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';
import { sql } from '@/lib/db';
import { z } from 'zod';
import crypto from 'crypto';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validated = forgotPasswordSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json(
                { error: validated.error.errors[0].message },
                { status: 400 }
            );
        }

        const { email } = validated.data;

        // Check if user exists
        const user = await getUserByEmail(email);
        if (!user) {
            // Don't reveal if email exists or not (security)
            return NextResponse.json({
                success: true,
                message: 'If an account with that email exists, we sent a password reset link.',
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

        // Store token in database
        await sql`
            INSERT INTO password_reset_tokens (user_id, token, expires)
            VALUES (${user.id}, ${resetToken}, ${expiresAt.toISOString()})
        `;

        // Send email
        const emailSent = await sendPasswordResetEmail(email, resetToken);

        if (!emailSent) {
            return NextResponse.json(
                { error: 'Failed to send email. Please try again later.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'If an account with that email exists, we sent a password reset link.',
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
