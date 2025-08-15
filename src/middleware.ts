import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    '/',
  ],
};

const isProtectedRoute = createRouteMatcher(['/']);

function isMobileOrTablet(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();

  return /mobi|android|iphone|ipad|ipod|phone|tablet/.test(ua);
}

export default clerkMiddleware(async (auth, request) => {
  const { nextUrl, headers } = request;
  const pathname = nextUrl.pathname;

  if (isProtectedRoute(request)) {
    await auth.protect();
  }

  if (pathname !== '/mobile') {
    const userAgent = headers.get('user-agent');
    const chUaMobile = headers.get('sec-ch-ua-mobile');
    const hintedMobile = chUaMobile?.toLowerCase() === '?1';

    if (hintedMobile || isMobileOrTablet(userAgent)) {
      const url = new URL('/mobile', nextUrl);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});
