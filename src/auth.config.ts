import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getUserByEmail, verifyPassword } from './lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export default {
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                console.log('[AUTH] Authorize called with:', { email: credentials?.email });

                const validated = loginSchema.safeParse(credentials);

                if (!validated.success) {
                    console.log('[AUTH] Validation failed:', validated.error);
                    return null;
                }

                const { email, password } = validated.data;
                console.log('[AUTH] Validated credentials, looking up user...');

                const user = await getUserByEmail(email);
                console.log('[AUTH] User lookup result:', user ? 'Found' : 'Not found');

                if (!user) {
                    console.log('[AUTH] User not found in database');
                    return null;
                }

                console.log('[AUTH] Verifying password...');
                const isValid = await verifyPassword(password, user.passwordHash);
                console.log('[AUTH] Password verification result:', isValid);

                if (!isValid) {
                    console.log('[AUTH] Password invalid');
                    return null;
                }

                console.log('[AUTH] Login successful for:', email);
                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as 'SUPER_ADMIN' | 'ADMIN' | 'USER';
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
} satisfies NextAuthConfig;
