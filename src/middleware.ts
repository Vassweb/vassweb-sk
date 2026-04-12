import { NextRequest, NextResponse } from 'next/server';
import type { Locale } from './lib/translations';

const SUPPORTED_LOCALES: Locale[] = ['sk', 'en', 'cs', 'hu'];
const DEFAULT_LOCALE: Locale = 'sk';

function getLocaleFromAcceptLanguage(request: NextRequest): Locale {
  const header = request.headers.get('accept-language');
  if (!header) return DEFAULT_LOCALE;

  const preferred = header
    .split(',')
    .map((part) => {
      const [lang, q] = part.trim().split(';q=');
      return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of preferred) {
    const short = lang.split('-')[0] as Locale;
    if (SUPPORTED_LOCALES.includes(short)) return short;
  }

  return DEFAULT_LOCALE;
}

function getLocaleForRequest(request: NextRequest): Locale {
  // 1. Cookie (user manually switched language) — highest priority
  const cookieLocale = request.cookies.get('locale')?.value as Locale | undefined;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) return cookieLocale;

  // 2. Accept-Language header (browser/country setting)
  return getLocaleFromAcceptLanguage(request);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // app.vassweb.sk → rewrite to /app (business app, not landing page)
  if (hostname === 'app.vassweb.sk') {
    // Skip static files and API routes
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
      return NextResponse.next();
    }

    // Auth check — require sb-access-token cookie for /app routes
    const authToken = request.cookies.get('sb-access-token')?.value;
    if (!authToken && pathname !== '/login') {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      return NextResponse.redirect(loginUrl);
    }

    // Root of app.vassweb.sk → show /app
    if (pathname === '/' || pathname === '') {
      const url = request.nextUrl.clone();
      url.pathname = '/app';
      return NextResponse.rewrite(url);
    }
    // Everything else on app.vassweb.sk passes through
    return NextResponse.next();
  }

  // Skip static files, API routes, app routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/app') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') // static files (images, css, js, etc.)
  ) {
    return NextResponse.next();
  }

  // Check if path already has a locale prefix
  const pathLocale = SUPPORTED_LOCALES.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (pathLocale) {
    // Path already has locale — set cookie and continue
    const response = NextResponse.next();
    response.cookies.set('locale', pathLocale, { path: '/', sameSite: 'lax', maxAge: 365 * 24 * 60 * 60 });
    return response;
  }

  // Determine locale from cookie or Accept-Language
  const locale = getLocaleForRequest(request);

  // SK routes live at root — no rewrite needed for default locale
  if (locale === DEFAULT_LOCALE) {
    const response = NextResponse.next();
    response.cookies.set('locale', locale, { path: '/', sameSite: 'lax', maxAge: 365 * 24 * 60 * 60 });
    return response;
  }

  // Rewrite (not redirect) to locale-prefixed path to keep clean URLs
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  const response = NextResponse.rewrite(url);
  response.cookies.set('locale', locale, { path: '/', sameSite: 'lax', maxAge: 365 * 24 * 60 * 60 });
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
