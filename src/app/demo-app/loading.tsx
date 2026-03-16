export default function DemoAppLoading() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0908',
      padding: '40px 24px',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header skeleton */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{
              width: 180, height: 28, borderRadius: 6,
              background: 'rgba(212,168,67,0.08)',
              animation: 'skeletonPulse 1.5s ease-in-out infinite',
            }} />
            <div style={{
              width: 120, height: 14, borderRadius: 4, marginTop: 8,
              background: 'rgba(255,255,255,0.03)',
              animation: 'skeletonPulse 1.5s ease-in-out infinite 0.1s',
            }} />
          </div>
          <div style={{
            width: 120, height: 40, borderRadius: 10,
            background: 'rgba(212,168,67,0.06)',
            animation: 'skeletonPulse 1.5s ease-in-out infinite 0.2s',
          }} />
        </div>

        {/* Stats skeleton */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16, marginBottom: 32,
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              height: 88, borderRadius: 16,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(212,168,67,0.06)',
              animation: `skeletonPulse 1.5s ease-in-out infinite ${0.1 * i}s`,
            }} />
          ))}
        </div>

        {/* Content skeleton */}
        <div style={{
          height: 400, borderRadius: 16,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(212,168,67,0.06)',
          animation: 'skeletonPulse 1.5s ease-in-out infinite 0.3s',
        }} />
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
