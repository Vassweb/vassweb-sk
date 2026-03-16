export default function DemoLoading() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0908',
      padding: '80px 24px',
    }}>
      {/* Hero skeleton */}
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          width: 100, height: 14, borderRadius: 7, margin: '0 auto 24px',
          background: 'rgba(212,168,67,0.08)',
          animation: 'skeletonPulse 1.5s ease-in-out infinite',
        }} />
        <div style={{
          width: '60%', height: 48, borderRadius: 8, margin: '0 auto 16px',
          background: 'rgba(212,168,67,0.06)',
          animation: 'skeletonPulse 1.5s ease-in-out infinite 0.1s',
        }} />
        <div style={{
          width: '40%', height: 20, borderRadius: 6, margin: '0 auto 48px',
          background: 'rgba(255,255,255,0.03)',
          animation: 'skeletonPulse 1.5s ease-in-out infinite 0.2s',
        }} />
        <div style={{
          width: 160, height: 48, borderRadius: 8, margin: '0 auto',
          background: 'rgba(212,168,67,0.08)',
          animation: 'skeletonPulse 1.5s ease-in-out infinite 0.3s',
        }} />
      </div>

      {/* Content skeleton */}
      <div style={{ maxWidth: 1100, margin: '80px auto 0' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              height: 200, borderRadius: 16,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(212,168,67,0.06)',
              animation: `skeletonPulse 1.5s ease-in-out infinite ${0.1 * i}s`,
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </main>
  );
}
