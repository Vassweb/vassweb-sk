import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demo · Ukážka | Vassweb',
  description: 'Živá ukážka webu vytvoreného Vassweb. Všetok obsah, mená, adresy a údaje sú iba demonštračné — nejde o reálne firmy ani osoby.',
  robots: { index: false, follow: false },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Demo layer — watermark, top banner, corner badge. Fixed overlay that persists across all demo pages. */}
      <style>{`
        /* Hide primary Vassweb navigation on demo pages */
        [data-vassweb-nav] { display: none !important; }

        /* Top banner (always visible, pushes content down) */
        body { padding-top: 38px !important; }

        .vassweb-demo-banner {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 2147483647;
          height: 38px;
          background: linear-gradient(135deg, #0a0908 0%, #1a1714 100%);
          border-bottom: 1px solid rgba(212, 168, 67, 0.35);
          box-shadow: 0 2px 16px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          font-size: 12px;
          color: rgba(232, 224, 208, 0.85);
          letter-spacing: 0.04em;
          pointer-events: auto;
        }
        .vassweb-demo-banner strong {
          color: #ffeebb;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-size: 11px;
        }
        .vassweb-demo-banner a {
          color: #d4a843;
          text-decoration: none;
          font-weight: 600;
          border-bottom: 1px solid rgba(212, 168, 67, 0.4);
          padding-bottom: 1px;
          transition: color 0.2s ease;
        }
        .vassweb-demo-banner a:hover { color: #ffeebb; }
        .vassweb-demo-banner .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #d4a843;
          box-shadow: 0 0 8px rgba(212, 168, 67, 0.8);
          animation: demo-pulse 2s ease-in-out infinite;
        }
        @keyframes demo-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        /* Corner badge (bottom right, always visible) */
        .vassweb-demo-badge {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 2147483646;
          padding: 10px 16px;
          background: linear-gradient(135deg, #ffeebb, #d4a843, #8a6a1e);
          color: #0a0908;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 999px;
          box-shadow: 0 8px 32px rgba(212, 168, 67, 0.35), 0 2px 8px rgba(0, 0, 0, 0.3);
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s;
        }
        .vassweb-demo-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(212, 168, 67, 0.5), 0 4px 12px rgba(0, 0, 0, 0.35);
        }
        .vassweb-demo-badge svg { width: 12px; height: 12px; }

        /* Diagonal background watermark — large low-opacity "DEMO · VASSWEB.SK" pattern across whole body */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 2147483645;
          background-image: repeating-linear-gradient(
            -35deg,
            transparent 0,
            transparent 200px,
            rgba(212, 168, 67, 0.035) 200px,
            rgba(212, 168, 67, 0.035) 204px,
            transparent 204px,
            transparent 400px
          );
          mix-blend-mode: normal;
        }

        /* Mobile tweaks */
        @media (max-width: 640px) {
          body { padding-top: 46px !important; }
          .vassweb-demo-banner { height: 46px; font-size: 11px; padding: 0 12px; }
          .vassweb-demo-banner strong { font-size: 10px; }
          .vassweb-demo-badge {
            bottom: 14px;
            right: 14px;
            padding: 8px 12px;
            font-size: 10px;
          }
        }

        /* Print: hide everything */
        @media print {
          .vassweb-demo-banner, .vassweb-demo-badge { display: none !important; }
          body::before { display: none !important; }
          body { padding-top: 0 !important; }
        }
      `}</style>

      <div className="vassweb-demo-banner" role="banner" aria-label="Demo ukážka">
        <span className="dot" aria-hidden="true" />
        <strong>UKÁŽKA · DEMO</strong>
        <span style={{ color: 'rgba(232,224,208,0.55)' }}>·</span>
        <span>Všetky údaje sú ilustračné</span>
        <span style={{ color: 'rgba(232,224,208,0.55)' }}>·</span>
        <a href="https://vassweb.sk" target="_blank" rel="noopener noreferrer">
          Chcem taký web
        </a>
      </div>

      <a
        className="vassweb-demo-badge"
        href="https://vassweb.sk"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Web vyrobený Vassweb"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#0a0908" />
        </svg>
        Demo · Vassweb.sk
      </a>

      {children}
    </>
  );
}
