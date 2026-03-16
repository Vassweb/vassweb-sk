import Image from 'next/image';

const heading = 'var(--font-heading), Playfair Display, Georgia, serif';
const body = 'var(--font-inter), Inter, system-ui, sans-serif';

export default function NotFound() {
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
          fontSize: 'clamp(72px, 12vw, 120px)',
          fontWeight: 400,
          background: 'linear-gradient(135deg, #ffeebb, #d4a843)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 16,
          lineHeight: 1,
        }}>
          404
        </h1>
        <p style={{
          fontFamily: body,
          fontSize: 18,
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 8,
          fontWeight: 300,
        }}>
          Stránka nenájdená
        </p>
        <p style={{
          fontFamily: body,
          fontSize: 14,
          color: 'rgba(255,255,255,0.25)',
          marginBottom: 40,
          lineHeight: 1.6,
        }}>
          Stránka, ktorú hľadáte, bola presunutá alebo nikdy neexistovala.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/" style={{
            display: 'inline-block',
            padding: '14px 36px',
            background: 'linear-gradient(135deg, #ffeebb, #d4a843, #8a6a1e)',
            color: '#0a0908',
            borderRadius: 999,
            fontWeight: 600,
            fontSize: 13,
            textDecoration: 'none',
            fontFamily: body,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
          }}>
            Hlavná stránka
          </a>
          <a href="#kontakt" style={{
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
            Kontakt
          </a>
        </div>
      </div>
    </main>
  );
}
