import Image from 'next/image';

const heading = 'var(--font-heading), Playfair Display, Georgia, serif';
const body = 'var(--font-inter), Inter, system-ui, sans-serif';

export default function NotFound() {
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
          404
        </h1>
        <p style={{
          fontFamily: body,
          fontSize: 16,
          color: 'rgba(255,255,255,0.4)',
          marginBottom: 8,
          fontWeight: 300,
        }}>
          Táto stránka neexistuje
        </p>
        <p style={{
          fontFamily: body,
          fontSize: 13,
          color: 'rgba(255,255,255,0.2)',
          marginBottom: 40,
        }}>
          Stránka, ktorú hľadáte, bola presunutá alebo nikdy neexistovala.
        </p>
        <a href="/" style={{
          display: 'inline-block',
          padding: '12px 32px',
          background: 'linear-gradient(135deg, #ffeebb, #d4a843, #8a6a1e)',
          color: '#0a0908',
          borderRadius: 999,
          fontWeight: 600,
          fontSize: 13,
          textDecoration: 'none',
          fontFamily: body,
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}>
          Späť na hlavnú stránku
        </a>
      </div>
    </main>
  );
}
