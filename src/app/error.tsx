'use client';

import Image from 'next/image';

const heading = 'var(--font-heading), Playfair Display, Georgia, serif';
const body = 'var(--font-inter), Inter, system-ui, sans-serif';

const texts: Record<string, { code: string; title: string; sub: string; retry: string; home: string }> = {
  sk: { code: '500', title: 'Niečo sa pokazilo', sub: 'Nastala neočakávaná chyba. Skúste to znova alebo sa vráťte na hlavnú stránku.', retry: 'Skúsiť znova', home: 'Hlavná stránka' },
  en: { code: '500', title: 'Something went wrong', sub: 'An unexpected error occurred. Try again or go back to the homepage.', retry: 'Try again', home: 'Homepage' },
  cs: { code: '500', title: 'Něco se pokazilo', sub: 'Nastala neočekávaná chyba. Zkuste to znovu nebo se vraťte na hlavní stránku.', retry: 'Zkusit znovu', home: 'Hlavní stránka' },
  hu: { code: '500', title: 'Valami hiba történt', sub: 'Váratlan hiba történt. Próbálja újra vagy térjen vissza a főoldalra.', retry: 'Újrapróbálás', home: 'Főoldal' },
};

function getLocaleFromCookie(): string {
  if (typeof document === 'undefined') return 'sk';
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/);
  return match?.[1] || 'sk';
}

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = texts[getLocaleFromCookie()] || texts.sk;
  return (
    <main id="main-content" style={{
      minHeight: '100vh',
      background: '#0a0908',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Radial glow */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 600,
        background: 'radial-gradient(circle, rgba(212,168,67,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        <Image
          src="/images/logo-vw.webp"
          alt="Vassweb"
          width={800}
          height={377}
          style={{ height: 40, width: 'auto', margin: '0 auto 32px', display: 'block', opacity: 0.6 }}
        />
        <h1 style={{
          fontFamily: heading,
          fontSize: 'clamp(56px, 10vw, 96px)',
          fontWeight: 400,
          background: 'linear-gradient(135deg, #ffeebb, #d4a843)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 16,
          lineHeight: 1,
        }}>
          500
        </h1>
        <p style={{
          fontFamily: body,
          fontSize: 18,
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 8,
          fontWeight: 300,
        }}>
          {t.title}
        </p>
        <p style={{
          fontFamily: body,
          fontSize: 14,
          color: 'rgba(255,255,255,0.25)',
          marginBottom: 40,
          lineHeight: 1.6,
        }}>
          {t.sub}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{
              padding: '14px 36px',
              background: 'linear-gradient(135deg, #ffeebb, #d4a843, #8a6a1e)',
              color: '#0a0908',
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 13,
              border: 'none',
              cursor: 'pointer',
              fontFamily: body,
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
            }}
          >
            {t.retry}
          </button>
          <a href="/" style={{
            display: 'inline-block',
            padding: '14px 36px',
            border: '1px solid rgba(212,168,67,0.2)',
            color: 'rgba(212,168,67,0.6)',
            borderRadius: 999,
            fontWeight: 500,
            fontSize: 13,
            textDecoration: 'none',
            fontFamily: body,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
          }}>
            {t.home}
          </a>
        </div>
      </div>
    </main>
  );
}
