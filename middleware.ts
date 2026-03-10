import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin routes (except /admin/login)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Security headers
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
}

export const config = {
    matcher: ['/admin/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
