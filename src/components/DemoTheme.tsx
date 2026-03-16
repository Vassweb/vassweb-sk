'use client';

import { useState, createContext, useContext, useCallback } from 'react';

export interface Theme {
  key: string;
  name: string;
  bg: string;
  bgCard: string;
  accent: string;
  accentLight: string;
  text: string;
  textMuted: string;
  border: string;
  isLight: boolean;
}

export const themes: Theme[] = [
  { key: 'elegance', name: 'Elegance', bg: '#0a0908', bgCard: '#111110', accent: '#d4a843', accentLight: '#ffeebb', text: '#ffffff', textMuted: 'rgba(255,255,255,0.5)', border: 'rgba(212,168,67,0.12)', isLight: false },
  { key: 'ocean', name: 'Ocean', bg: '#0f172a', bgCard: '#1e293b', accent: '#06b6d4', accentLight: '#67e8f9', text: '#f8fafc', textMuted: 'rgba(248,250,252,0.5)', border: 'rgba(6,182,212,0.15)', isLight: false },
  { key: 'forest', name: 'Forest', bg: '#0a1f0a', bgCard: '#132613', accent: '#10b981', accentLight: '#6ee7b7', text: '#f0fdf4', textMuted: 'rgba(240,253,244,0.5)', border: 'rgba(16,185,129,0.15)', isLight: false },
  { key: 'minimal', name: 'Minimal', bg: '#ffffff', bgCard: '#f8f8f8', accent: '#111111', accentLight: '#444444', text: '#111111', textMuted: 'rgba(0,0,0,0.45)', border: 'rgba(0,0,0,0.08)', isLight: true },
  { key: 'royal', name: 'Royal', bg: '#1a0a2e', bgCard: '#251245', accent: '#a855f7', accentLight: '#d8b4fe', text: '#faf5ff', textMuted: 'rgba(250,245,255,0.5)', border: 'rgba(168,85,247,0.15)', isLight: false },
];

const ThemeCtx = createContext<{ t: Theme; setTheme: (k: string) => void }>({ t: themes[0], setTheme: () => {} });

export function useTheme() { return useContext(ThemeCtx); }

export function DemoProvider({ children, defaultTheme = 'elegance' }: { children: React.ReactNode; defaultTheme?: string }) {
  const [current, setCurrent] = useState(defaultTheme);
  const t = themes.find(th => th.key === current) || themes[0];
  const setTheme = useCallback((k: string) => setCurrent(k), []);
  return <ThemeCtx.Provider value={{ t, setTheme }}>{children}</ThemeCtx.Provider>;
}

export function ThemeSwitcher() {
  const { t, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999 }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Theme switcher"
        style={{
          width: 40, height: 40, borderRadius: '50%', cursor: 'pointer',
          background: `conic-gradient(${themes.map((th, i) => `${th.accent} ${i * 72}deg ${(i + 1) * 72}deg`).join(', ')})`,
          border: `2px solid ${t.isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)'}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'transform 0.3s',
          transform: open ? 'rotate(180deg)' : 'rotate(0)',
        }}
      />
      {open && (
        <div style={{
          position: 'absolute', top: 50, right: 0, padding: 8,
          background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14,
          boxShadow: '0 12px 40px rgba(0,0,0,0.4)', minWidth: 160,
          animation: 'demoFadeIn 0.2s ease',
        }}>
          {themes.map(th => (
            <button key={th.key} onClick={() => { setTheme(th.key); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px',
                background: t.key === th.key ? `${th.accent}15` : 'transparent',
                border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s',
                color: t.text, fontSize: 13, fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              <span style={{ width: 20, height: 20, borderRadius: '50%', background: th.accent, border: `2px solid ${th.accentLight}`, flexShrink: 0 }} />
              <span style={{ fontWeight: t.key === th.key ? 600 : 400 }}>{th.name}</span>
              {t.key === th.key && <span style={{ marginLeft: 'auto', color: th.accent, fontSize: 14 }}>✓</span>}
            </button>
          ))}
        </div>
      )}
      <style>{`@keyframes demoFadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

export function BackToVassweb() {
  const { t } = useTheme();
  return (
    <a href="/"
      style={{
        position: 'fixed', top: 20, left: 20, zIndex: 999,
        display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none',
        padding: '8px 16px', borderRadius: 10,
        background: t.isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${t.border}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'all 0.3s',
        fontSize: 12, fontWeight: 600, color: t.textMuted,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <span style={{ fontSize: 14 }}>←</span>
      <span>vassweb.sk</span>
    </a>
  );
}

export function PoweredByVassweb() {
  const { t } = useTheme();
  return (
    <div style={{
      textAlign: 'center', padding: '32px 24px', borderTop: `1px solid ${t.border}`,
      background: t.bg,
    }}>
      <a href="https://vassweb.sk" target="_blank" rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none',
          padding: '10px 24px', borderRadius: 999,
          background: t.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${t.border}`, transition: 'all 0.3s',
        }}
      >
        <span style={{
          width: 24, height: 24, borderRadius: 6, fontSize: 10, fontWeight: 700,
          background: `linear-gradient(135deg, #ffeebb, #d4a843, #8a6a1e)`,
          color: '#0a0908', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>VW</span>
        <span style={{ fontSize: 12, color: t.textMuted, letterSpacing: '0.06em' }}>
          Powered by <strong style={{ color: '#d4a843', fontWeight: 600 }}>Vassweb</strong>
        </span>
      </a>
    </div>
  );
}
