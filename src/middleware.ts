import { NextRequest, NextResponse } from 'next/server';
import type { Locale } from './lib/translations';

const SUPPORTED_LOCALES: Locale[] = ['sk', 'en', 'cs', 'hu'];
const DEFAULT_LOCALE: Locale = 'sk';

const DOMAIN_LOCALE_MAP: Record<string, Locale> = {
  'vassweb.sk': 'sk',
  'www.vassweb.sk': 'sk',
  'vassweb.com': 'en',
  'www.vassweb.com': 'en',
  'vassweb.cz': 'cs',
  'www.vassweb.cz': 'cs',
  'vassweb.hu': 'hu',
  'www.vassweb.hu': 'hu',
};

function getLocaleFromAcceptLanguage(request: NextRequest): Locale {
  const header = request.headers.get('accept-language');
  if (!header) return 'en';

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

  return 'en';
}

function getLocaleForHost(host: string, request: NextRequest): Locale {
  // Remove port if present (e.g. localhost:3000)
  const hostname = host.split(':')[0];

  // Direct domain mapping
  const mapped = DOMAIN_LOCALE_MAP[hostname];
  if (mapped) return mapped;

  // vassweb.eu — detect from Accept-Language header
  if (hostname === 'vassweb.eu' || hostname === 'www.vassweb.eu') {
    return getLocaleFromAcceptLanguage(request);
  }

  // Localhost / preview deployments — use cookie or default
  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
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
    response.cookies.set('locale', pathLocale, { path: '/', sameSite: 'lax' });
    return response;
  }

  // Determine locale from domain
  const host = request.headers.get('host') || '';
  const locale = getLocaleForHost(host, request);

  // Rewrite (not redirect) to locale-prefixed path to keep clean URLs
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  const response = NextResponse.rewrite(url);
  response.cookies.set('locale', locale, { path: '/', sameSite: 'lax' });
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
