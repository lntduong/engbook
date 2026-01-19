import { auth } from './auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const protectedPaths = ['/admin'];

// Paths that are only for guests (redirect to home if authenticated)
const guestOnlyPaths = ['/login', '/register'];

export default async function middleware(request: NextRequest) {
    const session = await auth();
    const { pathname } = request.nextUrl;

    // Check if path is protected
    const isProtected = protectedPaths.some(path => pathname.startsWith(path));
    const isGuestOnly = guestOnlyPaths.some(path => pathname.startsWith(path));

    // Redirect to login if accessing protected path without session
    if (isProtected && !session) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect to home if authenticated user tries to access guest-only pages
    if (isGuestOnly && session) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Check if accessing admin routes without ADMIN role
    if (pathname.startsWith('/admin') && session?.user?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
