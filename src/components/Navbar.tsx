'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { type Locale, getT } from '@/lib/translations';

const locales: Locale[] = ['sk', 'en', 'cs', 'hu'];

function getLocaleFromPath(path: string): Locale {
  const seg = path.split('/')[1];
  if (locales.includes(seg as Locale)) return seg as Locale;
  return 'sk';
}

const body = 'var(--font-inter), Inter, system-ui, sans-serif';
const localeLabel: Record<Locale, string> = { sk: 'SK', en: 'EN', cs: 'CZ', hu: 'HU' };

export default function Navbar() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const tr = getT(locale);
  const navLinks = tr.navbar.links;

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = navLinks.map(l => l.href.replace('#', ''));
      let current = '';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) current = id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [navLinks]);

  // Close lang dropdown on outside click
  useEffect(() => {
    const close = () => setLangOpen(false);
    if (langOpen) document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [langOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const ctaText = locale === 'en' ? 'Free consultation' : locale === 'cs' ? 'Konzultace zdarma' : locale === 'hu' ? 'Ingyenes konzultáció' : 'Konzultácia zdarma';

  return (
    <>
    {/* Skip to content — a11y */}
    <a href="#main-content" style={{
      position: 'fixed', top: -100, left: 16, zIndex: 100,
      padding: '12px 24px', background: '#d4a843', color: '#0a0908',
      borderRadius: 8, fontWeight: 600, fontSize: 14, fontFamily: body,
      textDecoration: 'none', transition: 'top 0.2s',
    }} onFocus={e => { e.currentTarget.style.top = '16px'; }}
       onBlur={e => { e.currentTarget.style.top = '-100px'; }}>
      {locale === 'en' ? 'Skip to content' : locale === 'cs' ? 'Přeskočit na obsah' : locale === 'hu' ? 'Ugrás a tartalomra' : 'Preskočiť na obsah'}
    </a>
    <nav aria-label={locale === 'en' ? 'Main navigation' : locale === 'cs' ? 'Hlavní navigace' : locale === 'hu' ? 'Fő navigáció' : 'Hlavná navigácia'} style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      transition: 'all 0.4s ease',
      backgroundColor: isScrolled ? 'rgba(10,9,8,0.95)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(24px)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(212,168,67,0.08)' : '1px solid transparent',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 80 }}>

          {/* Logo */}
          <a href={locale === 'sk' ? '/' : `/${locale}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Image src="/images/logo-vw.webp" alt="Vassweb" width={800} height={377} priority style={{ height: 44, width: 'auto' }} />
          </a>

          {/* Desktop nav — centered links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 40 }} className="desktop-nav">
            {navLinks.map(l => {
              const isActive = activeSection === l.href.replace('#', '');
              return (
                <a key={l.href} href={l.href} style={{
                  color: isActive ? '#d4a843' : 'rgba(212,168,67,0.45)',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontFamily: body,
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase' as const,
                  transition: 'color 0.3s ease',
                  position: 'relative',
                  paddingBottom: 4,
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#d4a843'}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(212,168,67,0.45)'; }}
                >
                  {l.label}
                  {/* Aktívny indikátor — jemná zlatá čiara */}
                  <span style={{
                    position: 'absolute', bottom: -4, left: '20%', right: '20%',
                    height: 1,
                    background: 'linear-gradient(90deg, transparent, #d4a843, transparent)',
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }} />
                </a>
              );
            })}
          </div>

          {/* Desktop right: lang switcher + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }} className="desktop-nav">
            {/* Language switcher */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={e => { e.stopPropagation(); setLangOpen(!langOpen); }}
                aria-expanded={langOpen}
                aria-haspopup="true"
                aria-label={locale === 'en' ? 'Change language' : locale === 'cs' ? 'Změnit jazyk' : locale === 'hu' ? 'Nyelv váltása' : 'Zmeniť jazyk'}
                style={{
                  background: 'none',
                  border: '1px solid rgba(212,168,67,0.15)',
                  color: 'rgba(212,168,67,0.5)',
                  borderRadius: 8,
                  padding: '6px 14px',
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: body,
                  cursor: 'pointer',
                  letterSpacing: '0.1em',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,168,67,0.4)'; e.currentTarget.style.color = '#d4a843'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,168,67,0.15)'; e.currentTarget.style.color = 'rgba(212,168,67,0.5)'; }}
              >
                {tr.navbar.langLabel}
              </button>
              {langOpen && (
                <div role="menu" style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 8,
                  background: 'rgba(10,9,8,0.97)', backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(212,168,67,0.12)', borderRadius: 10,
                  padding: 6, minWidth: 80,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                }}>
                  {locales.map(loc => (
                    <a key={loc} href={loc === 'sk' ? '/' : `/${loc}`} role="menuitem" aria-current={loc === locale ? 'true' : undefined} style={{
                      display: 'block', padding: '8px 14px', borderRadius: 6,
                      color: loc === locale ? '#d4a843' : 'rgba(212,168,67,0.4)',
                      textDecoration: 'none', fontSize: 12, fontWeight: loc === locale ? 600 : 400,
                      fontFamily: body, letterSpacing: '0.08em',
                      backgroundColor: loc === locale ? 'rgba(212,168,67,0.06)' : 'transparent',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { if (loc !== locale) e.currentTarget.style.backgroundColor = 'rgba(212,168,67,0.04)'; e.currentTarget.style.color = '#d4a843'; }}
                    onMouseLeave={e => { if (loc !== locale) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(212,168,67,0.4)'; } }}
                    >
                      {localeLabel[loc]}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="#kontakt" style={{
              padding: '10px 28px',
              background: 'linear-gradient(135deg, #ffeebb, #d4a843, #8a6a1e)',
              color: '#0a0908',
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 12,
              fontFamily: body,
              textDecoration: 'none',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              transition: 'all 0.3s',
              boxShadow: '0 2px 12px rgba(212,168,67,0.15)',
            }}>{ctaText}</a>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setIsOpen(!isOpen)} className="mobile-only" aria-label={isOpen ? 'Close menu' : 'Open menu'} aria-expanded={isOpen} style={{
            background: 'none', border: 'none', color: '#d4a843',
            fontSize: 26, cursor: 'pointer', padding: 8,
            transition: 'transform 0.3s ease',
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
          }}>{isOpen ? '\u2715' : '\u2630'}</button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="mobile-menu" style={{
            position: 'absolute', top: 80, left: 0, right: 0,
            backgroundColor: 'rgba(10,9,8,0.97)', backdropFilter: 'blur(24px)',
            padding: '24px 32px', borderBottom: '1px solid rgba(212,168,67,0.08)',
            display: 'flex', flexDirection: 'column', gap: 20,
            animation: 'mobileMenuSlideIn 0.3s ease-out',
          }}>
            {navLinks.map(l => {
              const isActive = activeSection === l.href.replace('#', '');
              return (
                <a key={l.href} href={l.href} onClick={() => setIsOpen(false)} style={{
                  color: isActive ? '#d4a843' : 'rgba(212,168,67,0.5)',
                  textDecoration: 'none', fontWeight: 500, fontSize: 14,
                  fontFamily: body, letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                  transition: 'color 0.2s',
                }}>{l.label}</a>
              );
            })}

            {/* Mobile language switcher */}
            <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid rgba(212,168,67,0.06)' }}>
              {locales.map(loc => (
                <a key={loc} href={loc === 'sk' ? '/' : `/${loc}`} onClick={() => setIsOpen(false)} style={{
                  padding: '8px 14px', borderRadius: 8,
                  border: loc === locale ? '1px solid rgba(212,168,67,0.3)' : '1px solid rgba(212,168,67,0.1)',
                  color: loc === locale ? '#d4a843' : 'rgba(212,168,67,0.35)',
                  textDecoration: 'none', fontSize: 12, fontWeight: loc === locale ? 600 : 400,
                  fontFamily: body, letterSpacing: '0.08em',
                  backgroundColor: loc === locale ? 'rgba(212,168,67,0.06)' : 'transparent',
                }}>
                  {localeLabel[loc]}
                </a>
              ))}
            </div>

            <a href="#kontakt" onClick={() => setIsOpen(false)} style={{
              marginTop: 8, padding: '14px 24px',
              background: 'linear-gradient(135deg, #ffeebb, #d4a843, #8a6a1e)',
              color: '#0a0908', borderRadius: 999, fontWeight: 600,
              textDecoration: 'none', textAlign: 'center',
              fontFamily: body, letterSpacing: '0.08em', fontSize: 13,
              textTransform: 'uppercase' as const,
            }}>{ctaText}</a>
          </div>
        )}
      </div>

      <style jsx global>{`
        .mobile-only { display: none !important; }
        .mobile-menu { display: none !important; }
        .desktop-nav { display: flex !important; }
        @keyframes mobileMenuSlideIn {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .mobile-only { display: block !important; }
          .mobile-menu { display: flex !important; flex-direction: column !important; gap: 20px !important; }
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </nav>
    </>
  );
}
