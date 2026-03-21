import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const htmlPath = join(process.cwd(), 'public', 'euphoria-v1.html');
    const html = readFileSync(htmlPath, 'utf-8');

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' data: https://fonts.gstatic.com",
          "img-src 'self' data: blob: https://images.unsplash.com https://api.qrserver.com",
          "connect-src 'self'",
          "frame-src https://www.google.com",
          "frame-ancestors 'self'",
        ].join('; '),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }
}
