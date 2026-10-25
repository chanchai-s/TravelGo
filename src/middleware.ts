import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'th'] as const;
const defaultLocale = 'th' as const;

function getLocale(request: NextRequest): string {
  const pathname = request.nextUrl.pathname;
  
  // ตรวจสอบว่ามี locale ใน path หรือไม่
  const pathnameSegments = pathname.split('/');
  const locale = pathnameSegments[1];
  
  if (locales.includes(locale as any)) {
    return locale as typeof defaultLocale;
  }

  // Redirect ถ้าไม่มี locale ใน path
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // ข้ามไฟล์ static และ API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const pathnameSegments = pathname.split('/');
  const locale = pathnameSegments[1];

  // ถ้าไม่มี locale ใน path ให้ redirect ไปยัง default locale
  if (!locales.includes(locale as any)) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};