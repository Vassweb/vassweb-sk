export default function Loading() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0908',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 24,
    }}>
      {/* Pulsing VW logo placeholder */}
      <div style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(255,238,187,0.15), rgba(212,168,67,0.15))',
        animation: 'loadingPulse 1.5s ease-in-out infinite',
      }} />
      <div style={{
        width: 120,
        height: 2,
        borderRadius: 1,
        background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.3), transparent)',
        animation: 'loadingShimmer 1.5s ease-in-out infinite',
      }} />
      <style>{`
        @keyframes loadingPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes loadingShimmer {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </main>
  );
}
