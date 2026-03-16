'use client';

const heading = 'var(--font-heading), Playfair Display, Georgia, serif';
const body = 'var(--font-inter), Inter, system-ui, sans-serif';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0908',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '2px solid rgba(212,168,67,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
          color: 'rgba(212,168,67,0.4)',
          fontSize: 20,
          fontFamily: body,
        }}>
          !
        </div>
        <h1 style={{
          fontFamily: heading,
          fontSize: 'clamp(28px, 5vw, 40px)',
          fontWeight: 400,
          color: '#fff',
          marginBottom: 16,
        }}>
          Niečo sa pokazilo
        </h1>
        <p style={{
          fontFamily: body,
          fontSize: 14,
          color: 'rgba(255,255,255,0.35)',
          marginBottom: 40,
          lineHeight: 1.7,
        }}>
          Nastala neočakávaná chyba. Skúste to znova alebo sa vráťte na hlavnú stránku.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{
              padding: '12px 32px',
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
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            Skúsiť znova
          </button>
          <a href="/" style={{
            display: 'inline-block',
            padding: '12px 32px',
            border: '1px solid rgba(212,168,67,0.2)',
            color: 'rgba(212,168,67,0.6)',
            borderRadius: 999,
            fontWeight: 500,
            fontSize: 13,
            textDecoration: 'none',
            fontFamily: body,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            transition: 'all 0.2s',
          }}>
            Hlavná stránka
          </a>
        </div>
      </div>
    </main>
  );
}
