'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { type Locale, getT } from '@/lib/translations';

const GA_ID = 'G-CE8YW796Z0';

const locales: Locale[] = ['sk', 'en', 'cs', 'hu'];
function getLocaleFromPath(path: string): Locale {
  const seg = path.split('/')[1];
  if (locales.includes(seg as Locale)) return seg as Locale;
  return 'sk';
}

export default function CookieConsent() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const tr = getT(locale);
  const [consent, setConsent] = useState<'granted' | 'denied' | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cookie-consent');
    if (stored === 'granted' || stored === 'denied') {
      setConsent(stored);
    } else {
      // Zobraz banner po krátkom oneskorení (aby sa stránka najprv načítala)
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'granted');
    setConsent('granted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'denied');
    setConsent('denied');
    setVisible(false);
  };

  return (
    <>
      {/* Google Analytics — načíta sa LEN ak používateľ súhlasil */}
      {consent === 'granted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}

      {/* Cookie consent banner */}
      {visible && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: 'linear-gradient(135deg, #141210 0%, #1a1714 100%)',
            borderTop: '1px solid rgba(212, 168, 67, 0.3)',
            padding: '20px 24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            animation: 'cookieSlideUp 0.5s ease-out',
            boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          <style>{`
            @keyframes cookieSlideUp {
              from { transform: translateY(100%); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>

          <div style={{ flex: '1 1 400px', maxWidth: '700px' }}>
            <p
              style={{
                color: '#e8e0d0',
                fontSize: '14px',
                lineHeight: '1.6',
                margin: 0,
              }}
            >
              {tr.cookieBanner.text}{' '}
              <a
                href="/ochrana-udajov"
                style={{
                  color: '#d4a843',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
              >
                {locale === 'en' ? 'More info' : locale === 'cs' ? 'Více informací' : locale === 'hu' ? 'Több információ' : 'Viac informácií'}
              </a>
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexShrink: 0,
            }}
          >
            <button
              onClick={handleDecline}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: '1px solid rgba(232, 224, 208, 0.2)',
                background: 'transparent',
                color: '#e8e0d0',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(232, 224, 208, 0.5)';
                e.currentTarget.style.background = 'rgba(232, 224, 208, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(232, 224, 208, 0.2)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {tr.cookieBanner.decline}
            </button>
            <button
              onClick={handleAccept}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #d4a843, #b8922e)',
                color: '#0a0908',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #ffeebb, #d4a843)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #d4a843, #b8922e)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {tr.cookieBanner.accept}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
