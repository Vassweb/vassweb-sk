'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { auth, db, isSupabaseConfigured } from '@/lib/supabase';

/* ═══════════════════════════════════════════════════════════════
   VASSWEB BUSINESS APP v2.0
   All-in-one CRM / Project / Invoice Manager
   + Supabase sync + AI Assistant + PWA + Auth
   ═══════════════════════════════════════════════════════════════ */

// ─── Types ───────────────────────────────────────────────────
type View = 'dashboard' | 'clients' | 'projects' | 'invoices' | 'ai' | 'settings';
type ProjectStatus = 'konzultacia' | 'navrh' | 'vyvoj' | 'testovanie' | 'spusteny' | 'pozastaveny';
type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

interface Client {
  id: string; name: string; company: string; email: string;
  phone: string; notes: string; created_at: string; tags: string[];
}

interface Project {
  id: string; name: string; client_id: string; status: ProjectStatus;
  budget: number; spent: number; start_date: string; deadline: string;
  description: string; progress: number;
}

interface Invoice {
  id: string; number: string; client_id: string; project_id: string;
  amount: number; status: InvoiceStatus; issued: string; due: string;
  items: { desc: string; qty: number; price: number }[];
}

interface AIMessage {
  role: 'user' | 'assistant'; content: string; timestamp: string;
}

interface Notification {
  id: string; type: 'warning' | 'info' | 'success'; title: string; desc: string; time: string;
}

// ─── Theme ───────────────────────────────────────────────────
const T = {
  bg: '#0a0908', bgCard: '#111110', bgHover: '#1a1918',
  bgActive: 'rgba(212,168,67,0.08)', border: 'rgba(212,168,67,0.1)',
  borderHover: 'rgba(212,168,67,0.25)',
  gold: '#d4a843', goldLight: '#ffeebb', goldDark: '#8a6a1e',
  text: '#fff', textMuted: 'rgba(255,255,255,0.5)', textSoft: 'rgba(255,255,255,0.7)',
  green: '#4ade80', red: '#f87171', blue: '#60a5fa', orange: '#fb923c', purple: '#c084fc',
};

const font = 'var(--font-inter), Inter, system-ui, sans-serif';
const fontHeading = 'var(--font-heading), Playfair Display, Georgia, serif';

// ─── Demo Data ───────────────────────────────────────────────
const demoClients: Client[] = [
  { id: 'c1', name: 'Martin Kováč', company: 'TechStart s.r.o.', email: 'martin@techstart.sk', phone: '+421 911 222 333', notes: 'Záujem o redesign webu a AI chatbot', created_at: '2026-01-15', tags: ['VIP', 'Web'] },
  { id: 'c2', name: 'Jana Molnárová', company: 'BioFarm Nitra', email: 'jana@biofarm.sk', phone: '+421 905 444 555', notes: 'E-shop + automatizácia objednávok', created_at: '2026-02-03', tags: ['E-shop'] },
  { id: 'c3', name: 'Peter Szabó', company: 'PS Consulting', email: 'peter@psconsulting.sk', phone: '+421 917 666 777', notes: 'Firemná stránka + CRM', created_at: '2026-02-20', tags: ['Web', 'CRM'] },
  { id: 'c4', name: 'Eva Horváthová', company: 'Dizajn Studio EH', email: 'eva@dizajnstudio.sk', phone: '+421 908 888 999', notes: 'Portfólio web s galériou', created_at: '2026-03-01', tags: ['Web'] },
  { id: 'c5', name: 'Tomáš Novák', company: 'AutoServis Plus', email: 'tomas@autoservis.sk', phone: '+421 903 111 222', notes: 'Rezervačný systém online', created_at: '2026-03-10', tags: ['App', 'Automatizácia'] },
];

const demoProjects: Project[] = [
  { id: 'p1', name: 'TechStart Redesign', client_id: 'c1', status: 'vyvoj', budget: 4500, spent: 2800, start_date: '2026-02-01', deadline: '2026-04-15', description: 'Kompletný redesign firemného webu s AI chatbotom', progress: 62 },
  { id: 'p2', name: 'BioFarm E-shop', client_id: 'c2', status: 'navrh', budget: 6000, spent: 800, start_date: '2026-03-01', deadline: '2026-05-30', description: 'E-shop s automatizáciou objednávok a fakturácie', progress: 15 },
  { id: 'p3', name: 'PS Consulting Web', client_id: 'c3', status: 'spusteny', budget: 2500, spent: 2500, start_date: '2025-12-01', deadline: '2026-02-28', description: 'Firemná prezentačná stránka', progress: 100 },
  { id: 'p4', name: 'Dizajn Studio Portfólio', client_id: 'c4', status: 'konzultacia', budget: 1800, spent: 0, start_date: '2026-03-15', deadline: '2026-05-01', description: 'Portfólio web s dynamickou galériou', progress: 5 },
  { id: 'p5', name: 'AutoServis Rezervácie', client_id: 'c5', status: 'testovanie', budget: 3800, spent: 3200, start_date: '2026-01-10', deadline: '2026-03-31', description: 'Online rezervačný systém s notifikáciami', progress: 85 },
];

const demoInvoices: Invoice[] = [
  { id: 'i1', number: 'VW-2026-001', client_id: 'c1', project_id: 'p1', amount: 2250, status: 'paid', issued: '2026-02-01', due: '2026-02-15', items: [{ desc: 'Záloha — TechStart Redesign (50%)', qty: 1, price: 2250 }] },
  { id: 'i2', number: 'VW-2026-002', client_id: 'c3', project_id: 'p3', amount: 2500, status: 'paid', issued: '2026-02-28', due: '2026-03-14', items: [{ desc: 'PS Consulting Web — kompletná stránka', qty: 1, price: 2500 }] },
  { id: 'i3', number: 'VW-2026-003', client_id: 'c2', project_id: 'p2', amount: 1800, status: 'sent', issued: '2026-03-05', due: '2026-03-19', items: [{ desc: 'Záloha — BioFarm E-shop (30%)', qty: 1, price: 1800 }] },
  { id: 'i4', number: 'VW-2026-004', client_id: 'c5', project_id: 'p5', amount: 1900, status: 'overdue', issued: '2026-02-10', due: '2026-02-24', items: [{ desc: 'Záloha — AutoServis Rezervácie (50%)', qty: 1, price: 1900 }] },
  { id: 'i5', number: 'VW-2026-005', client_id: 'c1', project_id: 'p1', amount: 2250, status: 'draft', issued: '2026-03-15', due: '2026-03-29', items: [{ desc: 'Doplatok — TechStart Redesign (50%)', qty: 1, price: 2250 }] },
];

// ─── Helpers ─────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);
const fmt = (n: number) => n.toLocaleString('sk-SK', { minimumFractionDigits: 0 }) + ' €';
const fmtDate = (d: string) => { try { return new Date(d).toLocaleDateString('sk-SK'); } catch { return d; } };
const now = () => new Date().toISOString();

const statusLabels: Record<ProjectStatus, string> = {
  konzultacia: 'Konzultácia', navrh: 'Návrh', vyvoj: 'Vývoj',
  testovanie: 'Testovanie', spusteny: 'Spustený', pozastaveny: 'Pozastavený',
};
const statusColors: Record<ProjectStatus, string> = {
  konzultacia: T.purple, navrh: T.blue, vyvoj: T.orange,
  testovanie: T.goldLight, spusteny: T.green, pozastaveny: T.red,
};
const invStatusLabels: Record<InvoiceStatus, string> = {
  draft: 'Koncept', sent: 'Odoslaná', paid: 'Zaplatená', overdue: 'Po splatnosti',
};
const invStatusColors: Record<InvoiceStatus, string> = {
  draft: T.textMuted, sent: T.blue, paid: T.green, overdue: T.red,
};

// ─── SVG Icons ───────────────────────────────────────────────
function Icon({ d, size = 20, color = 'currentColor' }: { d: string; size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
}

const icons = {
  dashboard: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
  clients: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75 M9 7a4 4 0 110-8 4 4 0 010 8z',
  projects: 'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z',
  invoices: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  ai: 'M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1.27c.34-.6.99-1 1.73-1a2 2 0 110 4c-.74 0-1.39-.4-1.73-1H20a7 7 0 01-7 7v1.27c.6.34 1 .99 1 1.73a2 2 0 11-4 0c0-.74.4-1.39 1-1.73V23a7 7 0 01-7-7H2.73c-.34.6-.99 1-1.73 1a2 2 0 110-4c.74 0 1.39.4 1.73 1H4a7 7 0 017-7V5.73C10.4 5.39 10 4.74 10 4a2 2 0 012-2z',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  plus: 'M12 5v14 M5 12h14',
  edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  trash: 'M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2',
  x: 'M18 6L6 18 M6 6l12 12',
  check: 'M20 6L9 17l-5-5',
  trend: 'M23 6l-9.5 9.5-5-5L1 18',
  calendar: 'M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z M16 2v4 M8 2v4 M3 10h18',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
  phone: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z',
  tag: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01',
  menu: 'M3 12h18 M3 6h18 M3 18h18',
  arrowLeft: 'M19 12H5 M12 19l-7-7 7-7',
  download: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  send: 'M22 2L11 13 M22 2l-7 20-4-9-9-4z',
  bell: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0',
  sync: 'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15',
  lock: 'M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4',
  spark: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.36 6.36l-.71-.71M6.34 6.34l-.7-.7m12.02.01l-.71.71M6.34 17.66l-.7.7',
  cloud: 'M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
};

// ═══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════
function Card({ children, style, onClick, hover }: { children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void; hover?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} onClick={onClick}
      style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: 24, transition: 'all 0.2s', cursor: onClick ? 'pointer' : 'default', ...style }}
      onMouseEnter={() => { if ((hover || onClick) && ref.current) { ref.current.style.borderColor = T.borderHover; ref.current.style.transform = 'translateY(-1px)'; } }}
      onMouseLeave={() => { if ((hover || onClick) && ref.current) { ref.current.style.borderColor = `rgba(212,168,67,0.1)`; ref.current.style.transform = 'translateY(0)'; } }}
    >{children}</div>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 6, background: `${color}15`, color, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em' }}>{label}</span>;
}

function Btn({ children, onClick, variant = 'primary', style: s, disabled }: {
  children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'ghost' | 'danger'; style?: React.CSSProperties; disabled?: boolean;
}) {
  const base: React.CSSProperties = { padding: '10px 20px', borderRadius: 10, cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, fontFamily: font, display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s', border: 'none', opacity: disabled ? 0.5 : 1 };
  const styles: Record<string, React.CSSProperties> = {
    primary: { ...base, background: `linear-gradient(135deg, ${T.goldLight}, ${T.gold}, ${T.goldDark})`, color: T.bg },
    ghost: { ...base, background: 'transparent', border: `1px solid ${T.border}`, color: T.textSoft },
    danger: { ...base, background: 'rgba(248,113,113,0.1)', border: `1px solid rgba(248,113,113,0.2)`, color: T.red },
  };
  return <button onClick={disabled ? undefined : onClick} style={{ ...styles[variant], ...s }}>{children}</button>;
}

function ProgressBar({ value, color = T.gold }: { value: number; color?: string }) {
  return <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
    <div style={{ height: '100%', width: `${Math.min(100, value)}%`, borderRadius: 3, background: color, transition: 'width 0.4s ease' }} />
  </div>;
}

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div style={{ position: 'relative', maxWidth: 300 }}>
      <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }}><Icon d={icons.search} size={16} /></div>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '10px 12px 10px 36px', background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, color: T.text, fontSize: 13, fontFamily: font, outline: 'none' }} />
    </div>
  );
}

function Modal({ open, onClose, title, children, width = 520 }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; width?: number }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ width: '100%', maxWidth: width, maxHeight: '90vh', background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16, overflow: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: `1px solid ${T.border}` }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: T.gold }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.textMuted, cursor: 'pointer', padding: 4 }}><Icon d={icons.x} size={20} /></button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: T.textMuted, marginBottom: 6, letterSpacing: '0.05em' }}>{label}</label>
    {children}
  </div>;
}

function Input({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ width: '100%', padding: '10px 14px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, color: T.text, fontSize: 13, fontFamily: font, outline: 'none' }} />;
}

function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{ width: '100%', padding: '10px 14px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, color: T.text, fontSize: 13, fontFamily: font, outline: 'none', resize: 'vertical' }} />;
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return <select value={value} onChange={e => onChange(e.target.value)}
    style={{ width: '100%', padding: '10px 14px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, color: T.text, fontSize: 13, fontFamily: font, outline: 'none', cursor: 'pointer' }}>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>;
}

// ═══════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useDemo, setUseDemo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isSupabaseConfigured()) {
      onLogin(email || 'demo@vassweb.sk');
      return;
    }

    setLoading(true);
    try {
      const result = isSignUp
        ? await auth.signUp(email, password)
        : await auth.signIn(email, password);

      if (result.error) {
        setError(result.error);
      } else if (result.data?.access_token) {
        onLogin(email);
      } else if (isSignUp) {
        setIsSignUp(false);
        alert('Registrácia úspešná! Skontrolujte email pre overenie.');
      }
    } catch {
      setError('Nepodarilo sa pripojiť k serveru');
    }
    setLoading(false);
  };

  if (useDemo) {
    onLogin('demo@vassweb.sk');
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: T.bg, fontFamily: font, color: T.text, padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, margin: '0 auto 16px',
            background: `linear-gradient(135deg, ${T.goldLight}, ${T.gold}, ${T.goldDark})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 700, color: T.bg,
          }}>VW</div>
          <h1 style={{ fontFamily: fontHeading, fontSize: 28, fontWeight: 400, marginBottom: 4 }}>Vassweb <span style={{ color: T.gold }}>App</span></h1>
          <p style={{ color: T.textMuted, fontSize: 14 }}>Business Management System</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <FormField label="E-mail">
              <Input value={email} onChange={setEmail} placeholder="vas@email.sk" type="email" />
            </FormField>
            <FormField label="Heslo">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Vaše heslo"
                style={{ width: '100%', padding: '10px 14px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, color: T.text, fontSize: 13, fontFamily: font, outline: 'none' }} />
            </FormField>

            {error && <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(248,113,113,0.1)', color: T.red, fontSize: 13, marginBottom: 16 }}>{error}</div>}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '10px 20px', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 13, fontWeight: 600, fontFamily: font, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: `linear-gradient(135deg, ${T.goldLight}, ${T.gold}, ${T.goldDark})`, color: T.bg, border: 'none',
              opacity: loading ? 0.5 : 1, transition: 'all 0.2s', marginBottom: 12,
            }}>
              <Icon d={icons.lock} size={16} /> {loading ? 'Načítavam...' : isSignUp ? 'Registrovať sa' : 'Prihlásiť sa'}
            </button>

            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <button type="button" onClick={() => setIsSignUp(!isSignUp)}
                style={{ background: 'none', border: 'none', color: T.gold, cursor: 'pointer', fontSize: 13, fontFamily: font }}>
                {isSignUp ? 'Už mám účet — prihlásiť sa' : 'Nemám účet — registrovať sa'}
              </button>
            </div>
          </form>

          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16, textAlign: 'center' }}>
            <button onClick={() => setUseDemo(true)}
              style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 10, padding: '10px 20px', color: T.textSoft, cursor: 'pointer', fontSize: 13, fontFamily: font, width: '100%', transition: 'all 0.2s' }}>
              <Icon d={icons.zap} size={16} /> Demo mód (bez prihlásenia)
            </button>
          </div>
        </Card>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: T.textMuted }}>
          © 2026 Vassweb s.r.o. — Business App v2.0
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function VasswebApp() {
  const [user, setUser] = useState<string | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'local' | 'synced' | 'syncing'>('local');
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Data state — start empty if Supabase configured, demo otherwise
  const [clients, setClients] = useState<Client[]>(isSupabaseConfigured() ? [] : demoClients);
  const [projects, setProjects] = useState<Project[]>(isSupabaseConfigured() ? [] : demoProjects);
  const [invoices, setInvoices] = useState<Invoice[]>(isSupabaseConfigured() ? [] : demoInvoices);
  const [loaded, setLoaded] = useState(false);

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('vw-access-token');
    const savedUser = localStorage.getItem('vw-user-email');
    if (token || savedUser) {
      setUser(savedUser || 'user@vassweb.sk');
    }
  }, []);

  // Load data from Supabase or localStorage
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const loadData = async () => {
      if (isSupabaseConfigured()) {
        setSyncStatus('syncing');
        try {
          const [cRes, pRes, iRes] = await Promise.all([
            db.clients.getAll(),
            db.projects.getAll(),
            db.invoices.getAll(),
          ]);
          if (cancelled) return;
          if (cRes.data) setClients(cRes.data.map(c => ({ id: c.id, name: c.name, company: c.company, email: c.email, phone: c.phone, notes: c.notes, created_at: c.created_at, tags: c.tags || [] })));
          if (pRes.data) setProjects(pRes.data.map(p => ({ id: p.id, name: p.name, client_id: p.client_id || '', status: p.status, budget: p.budget, spent: p.spent, start_date: p.start_date || '', deadline: p.deadline || '', description: p.description, progress: p.progress })));
          if (iRes.data) setInvoices(iRes.data.map(i => ({ id: i.id, number: i.number, client_id: i.client_id || '', project_id: i.project_id || '', amount: i.amount, status: i.status as InvoiceStatus, issued: i.issued, due: i.due || '', items: [] })));
          setSyncStatus('synced');
        } catch {
          setSyncStatus('local');
          // Fall back to localStorage
          try {
            const saved = localStorage.getItem('vassweb-app-data');
            if (saved) { const d = JSON.parse(saved); if (d.clients) setClients(d.clients); if (d.projects) setProjects(d.projects); if (d.invoices) setInvoices(d.invoices); }
          } catch {}
        }
      } else {
        try {
          const saved = localStorage.getItem('vassweb-app-data');
          if (saved) { const d = JSON.parse(saved); if (d.clients) setClients(d.clients); if (d.projects) setProjects(d.projects); if (d.invoices) setInvoices(d.invoices); }
        } catch {}
        setSyncStatus('local');
      }
      if (!cancelled) setLoaded(true);
    };
    loadData();
    return () => { cancelled = true; };
  }, [user]);

  // Save data to localStorage as cache
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem('vassweb-app-data', JSON.stringify({ clients, projects, invoices }));
  }, [clients, projects, invoices, loaded]);

  // Auto-detect overdue invoices
  useEffect(() => {
    if (!loaded) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let changed = false;
    const updated = invoices.map(inv => {
      if (inv.status === 'sent' && inv.due) {
        const dueDate = new Date(inv.due);
        dueDate.setHours(0, 0, 0, 0);
        if (dueDate < today) {
          changed = true;
          return { ...inv, status: 'overdue' as InvoiceStatus };
        }
      }
      return inv;
    });
    if (changed) setInvoices(updated);
  }, [loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Supabase write helpers
  const supaWrite = useMemo(() => ({
    async saveClient(c: Client, isNew: boolean) {
      if (!isSupabaseConfigured()) return;
      try { if (isNew) await db.clients.create(c); else await db.clients.update(c.id, c); } catch {}
    },
    async deleteClient(id: string) {
      if (!isSupabaseConfigured()) return;
      try { await db.clients.delete(id); } catch {}
    },
    async saveProject(p: Project, isNew: boolean) {
      if (!isSupabaseConfigured()) return;
      try { if (isNew) await db.projects.create(p); else await db.projects.update(p.id, p); } catch {}
    },
    async deleteProject(id: string) {
      if (!isSupabaseConfigured()) return;
      try { await db.projects.delete(id); } catch {}
    },
    async saveInvoice(i: Invoice, isNew: boolean) {
      if (!isSupabaseConfigured()) return;
      const { items: _items, ...rest } = i;
      try { if (isNew) await db.invoices.create(rest); else await db.invoices.update(i.id, rest); } catch {}
    },
    async deleteInvoice(id: string) {
      if (!isSupabaseConfigured()) return;
      try { await db.invoices.delete(id); } catch {}
    },
  }), []);

  // Register service worker & PWA install prompt
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw-app.js').catch(() => {});
    }
    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Global search keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setGlobalSearchOpen(prev => !prev); setGlobalSearchQuery(''); }
      if (e.key === 'Escape') setGlobalSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Generate smart notifications
  useEffect(() => {
    if (!loaded) return;
    const notifs: Notification[] = [];
    const today = new Date();

    // Overdue invoices
    invoices.filter(i => i.status === 'overdue').forEach(i => {
      const client = clients.find(c => c.id === i.client_id);
      notifs.push({ id: `ov-${i.id}`, type: 'warning', title: `Faktúra ${i.number} po splatnosti`, desc: `${client?.company || 'Klient'} — ${fmt(i.amount)}`, time: i.due });
    });

    // Upcoming deadlines (next 7 days)
    projects.filter(p => p.deadline && !['spusteny', 'pozastaveny'].includes(p.status)).forEach(p => {
      const deadline = new Date(p.deadline);
      const diff = Math.floor((deadline.getTime() - today.getTime()) / 86400000);
      if (diff >= 0 && diff <= 7) {
        notifs.push({ id: `dl-${p.id}`, type: diff <= 2 ? 'warning' : 'info', title: `Deadline: ${p.name}`, desc: `${diff === 0 ? 'Dnes' : `O ${diff} dní`} — ${p.progress}% hotové`, time: p.deadline });
      }
    });

    // Budget alerts
    projects.filter(p => p.budget > 0 && (p.spent / p.budget) > 0.9 && p.status !== 'spusteny').forEach(p => {
      notifs.push({ id: `bg-${p.id}`, type: 'warning', title: `Budget alert: ${p.name}`, desc: `${fmt(p.spent)} z ${fmt(p.budget)} (${Math.round((p.spent / p.budget) * 100)}%)`, time: now() });
    });

    // Unsent invoices
    const drafts = invoices.filter(i => i.status === 'draft').length;
    if (drafts > 0) {
      notifs.push({ id: 'drafts', type: 'info', title: `${drafts} faktúr na odoslanie`, desc: 'Máte neodoslané koncepty faktúr', time: now() });
    }

    setNotifications(notifs);
  }, [clients, projects, invoices, loaded]);

  // View from URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('view');
    if (v && ['dashboard', 'clients', 'projects', 'invoices', 'ai', 'settings'].includes(v)) {
      setView(v as View);
    }
  }, []);

  const getClient = useCallback((id: string) => clients.find(c => c.id === id), [clients]);

  const handleLogin = (email: string) => {
    setUser(email);
    localStorage.setItem('vw-user-email', email);
  };

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    localStorage.removeItem('vw-user-email');
    setClients(demoClients);
    setProjects(demoProjects);
    setInvoices(demoInvoices);
  };

  const handleInstall = async () => {
    if (installPrompt && 'prompt' in installPrompt) {
      (installPrompt as { prompt: () => void }).prompt();
      setInstallPrompt(null);
    }
  };

  // Auth gate
  if (!user) return <LoginScreen onLogin={handleLogin} />;

  const navItems: { key: View; label: string; icon: string; badge?: number }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: icons.dashboard },
    { key: 'clients', label: 'Klienti', icon: icons.clients, badge: clients.length },
    { key: 'projects', label: 'Projekty', icon: icons.projects, badge: projects.filter(p => !['spusteny', 'pozastaveny'].includes(p.status)).length },
    { key: 'invoices', label: 'Faktúry', icon: icons.invoices, badge: invoices.filter(i => i.status === 'overdue').length },
    { key: 'ai', label: 'AI Asistent', icon: icons.ai },
    { key: 'settings', label: 'Nastavenia', icon: icons.settings },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: T.bg, fontFamily: font, color: T.text }}>
      {/* ═══ SIDEBAR ═══ */}
      <aside className="sidebar-desktop" style={{
        width: sidebarOpen ? 260 : 72, minHeight: '100vh', background: T.bgCard,
        borderRight: `1px solid ${T.border}`, transition: 'width 0.3s ease',
        display: 'flex', flexDirection: 'column', position: 'fixed',
        left: 0, top: 0, bottom: 0, zIndex: 40, overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: sidebarOpen ? '20px 16px' : '20px 12px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 12, justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${T.goldLight}, ${T.gold}, ${T.goldDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: T.bg, flexShrink: 0 }}>VW</div>
          {sidebarOpen && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.gold, letterSpacing: '0.05em' }}>VASSWEB</div>
              <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: '0.1em' }}>BUSINESS APP</div>
            </div>
          )}
        </div>

        {/* Sync Status */}
        {sidebarOpen && (
          <div style={{ padding: '8px 16px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: syncStatus === 'synced' ? T.green : syncStatus === 'syncing' ? T.orange : T.textMuted }} />
            <span style={{ fontSize: 11, color: T.textMuted }}>{syncStatus === 'synced' ? 'Synchronizované' : syncStatus === 'syncing' ? 'Synchronizujem...' : 'Lokálny mód'}</span>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => {
            const active = view === item.key;
            return (
              <button key={item.key} onClick={() => { setView(item.key); setMobileSidebar(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: sidebarOpen ? '11px 14px' : '11px',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                borderRadius: 10, background: active ? T.bgActive : 'transparent',
                border: active ? `1px solid ${T.border}` : '1px solid transparent',
                color: active ? T.gold : T.textMuted, cursor: 'pointer',
                transition: 'all 0.15s', fontSize: 13, fontWeight: active ? 600 : 400,
                fontFamily: font, letterSpacing: '0.02em', width: '100%', position: 'relative',
              }}>
                <Icon d={item.icon} size={20} />
                {sidebarOpen && <span>{item.label}</span>}
                {item.badge && item.badge > 0 && sidebarOpen ? (
                  <span style={{ marginLeft: 'auto', background: item.key === 'invoices' ? T.red : `${T.gold}30`, color: item.key === 'invoices' ? '#fff' : T.gold, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>{item.badge}</span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Install PWA button */}
        {installPrompt && sidebarOpen && (
          <div style={{ padding: '8px 12px', borderTop: `1px solid ${T.border}` }}>
            <button onClick={handleInstall} style={{
              width: '100%', padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
              background: `linear-gradient(135deg, ${T.gold}20, ${T.goldDark}20)`,
              border: `1px solid ${T.gold}40`, color: T.gold, fontSize: 12, fontFamily: font,
              display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600,
            }}>
              <Icon d={icons.download} size={16} /> Nainštalovať na mobil
            </button>
          </div>
        )}

        {/* User & Collapse */}
        <div style={{ borderTop: `1px solid ${T.border}`, padding: '12px' }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '0 4px' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${T.gold}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: T.gold }}>{user.charAt(0).toUpperCase()}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: T.textSoft, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user}</div>
              </div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            width: '100%', padding: 8, background: 'none', border: 'none',
            color: T.textMuted, cursor: 'pointer', display: 'flex', justifyContent: 'center',
          }}>
            <Icon d={sidebarOpen ? icons.arrowLeft : icons.menu} size={18} />
          </button>
        </div>
      </aside>

      {/* ═══ MOBILE TOPBAR ═══ */}
      <div className="mobile-topbar" style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 56,
        background: T.bgCard, borderBottom: `1px solid ${T.border}`,
        display: 'none', alignItems: 'center', padding: '0 12px', gap: 8, zIndex: 50,
      }}>
        <button onClick={() => setMobileSidebar(!mobileSidebar)} style={{ background: 'none', border: 'none', color: T.gold, cursor: 'pointer', padding: 4 }}>
          <Icon d={mobileSidebar ? icons.x : icons.menu} size={22} />
        </button>
        <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: T.gold, letterSpacing: '0.05em' }}>VW APP</div>
        <button onClick={() => setShowNotifs(!showNotifs)} style={{ background: 'none', border: 'none', color: T.textMuted, cursor: 'pointer', padding: 4, position: 'relative' }}>
          <Icon d={icons.bell} size={20} />
          {notifications.length > 0 && <span style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: '50%', background: T.red }} />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebar && (
        <div className="mobile-sidebar-overlay" style={{ position: 'fixed', inset: 0, zIndex: 45, background: 'rgba(0,0,0,0.7)' }} onClick={() => setMobileSidebar(false)}>
          <div style={{ width: 260, height: '100%', background: T.bgCard, borderRight: `1px solid ${T.border}`, paddingTop: 56 }} onClick={e => e.stopPropagation()}>
            <nav style={{ padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {navItems.map(item => {
                const active = view === item.key;
                return (
                  <button key={item.key} onClick={() => { setView(item.key); setMobileSidebar(false); }} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10,
                    background: active ? T.bgActive : 'transparent',
                    border: active ? `1px solid ${T.border}` : '1px solid transparent',
                    color: active ? T.gold : T.textMuted, cursor: 'pointer',
                    fontSize: 13, fontWeight: active ? 600 : 400, fontFamily: font, width: '100%',
                  }}>
                    <Icon d={item.icon} size={20} /><span>{item.label}</span>
                    {item.badge && item.badge > 0 ? <span style={{ marginLeft: 'auto', background: `${T.gold}30`, color: T.gold, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>{item.badge}</span> : null}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="main-content" style={{ flex: 1, marginLeft: sidebarOpen ? 260 : 72, transition: 'margin-left 0.3s ease', minHeight: '100vh' }}>
        {/* Top bar with notifications */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '16px 32px 0', gap: 12 }}>
          <button onClick={() => { setGlobalSearchOpen(true); setGlobalSearchQuery(''); }} style={{
            background: 'none', border: `1px solid ${T.border}`, borderRadius: 10,
            color: T.textMuted, cursor: 'pointer', padding: '8px 14px', fontSize: 12,
            fontFamily: font, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Icon d={icons.search} size={16} />
            <span style={{ fontSize: 11, color: T.textMuted }}>Hľadať...</span>
            <span style={{ fontSize: 10, color: T.textMuted, background: T.bg, padding: '2px 6px', borderRadius: 4, marginLeft: 4 }}>⌘K</span>
          </button>
          <button onClick={() => setShowNotifs(!showNotifs)} style={{
            background: 'none', border: `1px solid ${T.border}`, borderRadius: 10,
            color: T.textMuted, cursor: 'pointer', padding: '8px 14px', fontSize: 12,
            fontFamily: font, display: 'flex', alignItems: 'center', gap: 8, position: 'relative',
          }}>
            <Icon d={icons.bell} size={16} />
            {notifications.length > 0 && <>
              <span style={{ color: T.gold }}>{notifications.length}</span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.red, position: 'absolute', top: 6, right: 6 }} />
            </>}
          </button>
        </div>

        {/* Notifications dropdown */}
        {showNotifs && (
          <div style={{ position: 'fixed', top: 60, right: 32, width: 360, maxHeight: 480, zIndex: 90, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: T.gold }}>Smart Notifikácie</span>
              <span style={{ fontSize: 11, color: T.textMuted }}>{notifications.length} aktívnych</span>
            </div>
            {notifications.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: T.textMuted, fontSize: 13 }}>Všetko je v poriadku!</div>
            ) : (
              notifications.map(n => (
                <div key={n.id} style={{ padding: '12px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 6, flexShrink: 0, background: n.type === 'warning' ? T.red : n.type === 'success' ? T.green : T.blue }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: T.textMuted }}>{n.desc}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '16px 32px 64px' }}>
          {view === 'dashboard' && <DashboardView clients={clients} projects={projects} invoices={invoices} getClient={getClient} setView={setView} notifications={notifications} />}
          {view === 'clients' && <ClientsView clients={clients} setClients={setClients} projects={projects} supaWrite={supaWrite} />}
          {view === 'projects' && <ProjectsView projects={projects} setProjects={setProjects} clients={clients} getClient={getClient} supaWrite={supaWrite} />}
          {view === 'invoices' && <InvoicesView invoices={invoices} setInvoices={setInvoices} clients={clients} projects={projects} getClient={getClient} supaWrite={supaWrite} />}
          {view === 'ai' && <AIView clients={clients} projects={projects} invoices={invoices} />}
          {view === 'settings' && <SettingsView clients={clients} projects={projects} invoices={invoices} setClients={setClients} setProjects={setProjects} setInvoices={setInvoices} user={user} onLogout={handleLogout} syncStatus={syncStatus} />}
        </div>
      </main>

      {/* ═══ GLOBAL SEARCH MODAL ═══ */}
      {globalSearchOpen && (() => {
        const q = globalSearchQuery.toLowerCase();
        const matchedClients = q ? clients.filter(c => `${c.name} ${c.company} ${c.email}`.toLowerCase().includes(q)) : [];
        const matchedProjects = q ? projects.filter(p => `${p.name} ${p.description}`.toLowerCase().includes(q)) : [];
        const matchedInvoices = q ? invoices.filter(i => i.number.toLowerCase().includes(q)) : [];
        const hasResults = matchedClients.length + matchedProjects.length + matchedInvoices.length > 0;
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', paddingTop: 100 }} onClick={() => setGlobalSearchOpen(false)}>
            <div style={{ width: '100%', maxWidth: 520, maxHeight: 480, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
              {/* Search input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: `1px solid ${T.border}` }}>
                <Icon d={icons.search} size={18} color={T.gold} />
                <input autoFocus value={globalSearchQuery} onChange={e => setGlobalSearchQuery(e.target.value)} placeholder="Hľadať klientov, projekty, faktúry..."
                  style={{ flex: 1, background: 'none', border: 'none', color: T.text, fontSize: 14, fontFamily: font, outline: 'none' }} />
                <span style={{ fontSize: 10, color: T.textMuted, background: T.bg, padding: '3px 8px', borderRadius: 4 }}>ESC</span>
              </div>
              {/* Results */}
              <div style={{ maxHeight: 380, overflowY: 'auto', padding: '8px 0' }}>
                {!q && <div style={{ padding: '24px 20px', textAlign: 'center', color: T.textMuted, fontSize: 13 }}>Zadajte hľadaný výraz...</div>}
                {q && !hasResults && <div style={{ padding: '24px 20px', textAlign: 'center', color: T.textMuted, fontSize: 13 }}>Žiadne výsledky pre &ldquo;{globalSearchQuery}&rdquo;</div>}
                {matchedClients.length > 0 && (
                  <div>
                    <div style={{ padding: '8px 20px', fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Klienti</div>
                    {matchedClients.slice(0, 5).map(c => (
                      <button key={c.id} onClick={() => { setGlobalSearchOpen(false); setView('clients'); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 20px', background: 'none', border: 'none', color: T.text, cursor: 'pointer', fontFamily: font, fontSize: 13, textAlign: 'left', transition: 'background 0.1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)} onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: `${T.purple}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={icons.clients} size={14} color={T.purple} /></div>
                        <div><div style={{ fontWeight: 500 }}>{c.name}</div><div style={{ fontSize: 11, color: T.textMuted }}>{c.company} — {c.email}</div></div>
                      </button>
                    ))}
                  </div>
                )}
                {matchedProjects.length > 0 && (
                  <div>
                    <div style={{ padding: '8px 20px', fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Projekty</div>
                    {matchedProjects.slice(0, 5).map(p => (
                      <button key={p.id} onClick={() => { setGlobalSearchOpen(false); setView('projects'); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 20px', background: 'none', border: 'none', color: T.text, cursor: 'pointer', fontFamily: font, fontSize: 13, textAlign: 'left', transition: 'background 0.1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)} onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: `${T.blue}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={icons.projects} size={14} color={T.blue} /></div>
                        <div><div style={{ fontWeight: 500 }}>{p.name}</div><div style={{ fontSize: 11, color: T.textMuted }}>{statusLabels[p.status]} — {p.progress}%</div></div>
                      </button>
                    ))}
                  </div>
                )}
                {matchedInvoices.length > 0 && (
                  <div>
                    <div style={{ padding: '8px 20px', fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Faktúry</div>
                    {matchedInvoices.slice(0, 5).map(inv => (
                      <button key={inv.id} onClick={() => { setGlobalSearchOpen(false); setView('invoices'); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 20px', background: 'none', border: 'none', color: T.text, cursor: 'pointer', fontFamily: font, fontSize: 13, textAlign: 'left', transition: 'background 0.1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)} onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: `${T.green}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={icons.invoices} size={14} color={T.green} /></div>
                        <div><div style={{ fontWeight: 500 }}>{inv.number}</div><div style={{ fontSize: 11, color: T.textMuted }}>{fmt(inv.amount)} — {invStatusLabels[inv.status]}</div></div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Click outside to close notifs */}
      {showNotifs && <div style={{ position: 'fixed', inset: 0, zIndex: 80 }} onClick={() => setShowNotifs(false)} />}

      <style jsx global>{`
        .sidebar-desktop { display: flex !important; }
        .mobile-topbar { display: none !important; }
        .mobile-sidebar-overlay { display: none !important; }
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .mobile-topbar { display: flex !important; }
          .main-content { margin-left: 0 !important; padding-top: 56px !important; }
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD VIEW
// ═══════════════════════════════════════════════════════════════
function DashboardView({ clients, projects, invoices, getClient, setView, notifications }: {
  clients: Client[]; projects: Project[]; invoices: Invoice[];
  getClient: (id: string) => Client | undefined; setView: (v: View) => void; notifications: Notification[];
}) {
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.amount, 0);
  const activeProjects = projects.filter(p => !['spusteny', 'pozastaveny'].includes(p.status)).length;
  const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;

  const stats = [
    { label: 'Celkový príjem', value: fmt(totalRevenue), color: T.green, icon: icons.trend },
    { label: 'Čakajúce platby', value: fmt(pendingRevenue), color: T.orange, icon: icons.invoices },
    { label: 'Aktívne projekty', value: String(activeProjects), color: T.blue, icon: icons.projects },
    { label: 'Klienti', value: String(clients.length), color: T.purple, icon: icons.clients },
  ];

  const recentProjects = [...projects].filter(p => p.status !== 'spusteny').sort((a, b) => b.progress - a.progress).slice(0, 5);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  const monthlyRev = months.map((m, i) => {
    const monthInvoices = invoices.filter(inv => { const d = new Date(inv.issued); return d.getFullYear() === currentYear && d.getMonth() === i && inv.status === 'paid'; });
    return { month: m, amount: monthInvoices.reduce((s, inv) => s + inv.amount, 0) };
  });
  const maxRev = Math.max(...monthlyRev.map(m => m.amount), 1);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: fontHeading, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400, marginBottom: 4 }}>Dashboard</h1>
          <p style={{ color: T.textMuted, fontSize: 14 }}>{new Date().toLocaleDateString('sk-SK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <Btn onClick={() => setView('ai')} variant="ghost"><Icon d={icons.ai} size={16} /> AI Asistent</Btn>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
        {stats.map((s, i) => (
          <Card key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={s.icon} size={20} color={s.color} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      {notifications.filter(n => n.type === 'warning').length > 0 && (
        <Card style={{ borderColor: 'rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.03)', marginBottom: 20, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Icon d={icons.bell} size={18} color={T.red} />
            <span style={{ fontSize: 13, fontWeight: 600, color: T.red }}>{notifications.filter(n => n.type === 'warning').length} upozornení vyžaduje pozornosť</span>
            <Btn variant="danger" onClick={() => setView('invoices')} style={{ marginLeft: 'auto', fontSize: 11, padding: '6px 12px' }}>Zobraziť</Btn>
          </div>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 18, marginBottom: 24 }}>
        {/* Revenue Chart — 12 months SVG */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.gold, marginBottom: 16 }}>Príjmy {currentYear}</div>
          {(() => {
            const W = 560, H = 200, padL = 55, padR = 10, padT = 25, padB = 32;
            const chartW = W - padL - padR, chartH = H - padT - padB;
            const barW = chartW / 12 - 4;
            const gridLines = 4;
            const step = maxRev / gridLines;
            return (
              <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.goldLight} />
                    <stop offset="100%" stopColor={T.goldDark} />
                  </linearGradient>
                </defs>
                {/* Grid lines and Y labels */}
                {Array.from({ length: gridLines + 1 }).map((_, gi) => {
                  const val = step * gi;
                  const y = padT + chartH - (chartH * val / maxRev);
                  return (
                    <g key={gi}>
                      <line x1={padL} y1={y} x2={W - padR} y2={y} stroke={T.border} strokeWidth={1} />
                      <text x={padL - 8} y={y + 4} textAnchor="end" fill={T.textMuted} fontSize={9} fontFamily="system-ui">{val >= 1000 ? `${(val / 1000).toFixed(1)}k` : Math.round(val)}</text>
                    </g>
                  );
                })}
                {/* Bars */}
                {monthlyRev.map((m, i) => {
                  const barH = m.amount > 0 ? Math.max(4, (m.amount / maxRev) * chartH) : 0;
                  const x = padL + i * (chartW / 12) + 2;
                  const y = padT + chartH - barH;
                  const isHovered = hoveredBar === i;
                  return (
                    <g key={i}
                      onMouseEnter={() => setHoveredBar(i)}
                      onMouseLeave={() => setHoveredBar(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Hover background */}
                      <rect x={x - 2} y={padT} width={barW + 4} height={chartH} fill={isHovered ? 'rgba(212,168,67,0.04)' : 'transparent'} rx={3} />
                      {/* Bar */}
                      <rect x={x} y={y} width={barW} height={barH} fill="url(#barGrad)" rx={3}
                        style={{ transition: 'all 0.2s', opacity: isHovered ? 1 : 0.8 }} />
                      {/* X label */}
                      <text x={x + barW / 2} y={H - 8} textAnchor="middle" fill={isHovered ? T.gold : T.textMuted} fontSize={9} fontWeight={isHovered ? 600 : 400} fontFamily="system-ui">{m.month}</text>
                      {/* Hover tooltip */}
                      {isHovered && m.amount > 0 && (
                        <g>
                          <rect x={x + barW / 2 - 32} y={y - 22} width={64} height={18} rx={4} fill={T.bgCard} stroke={T.gold} strokeWidth={0.5} />
                          <text x={x + barW / 2} y={y - 10} textAnchor="middle" fill={T.gold} fontSize={9} fontWeight={600} fontFamily="system-ui">{fmt(m.amount)}</text>
                        </g>
                      )}
                    </g>
                  );
                })}
                {/* Bottom axis */}
                <line x1={padL} y1={padT + chartH} x2={W - padR} y2={padT + chartH} stroke={T.border} strokeWidth={1} />
              </svg>
            );
          })()}
        </Card>

        {/* Project Status */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.gold, marginBottom: 16 }}>Stav projektov</div>
          {(Object.keys(statusLabels) as ProjectStatus[]).map(status => {
            const count = projects.filter(p => p.status === status).length;
            if (!count) return null;
            return (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColors[status] }} />
                <div style={{ flex: 1, fontSize: 13, color: T.textSoft }}>{statusLabels[status]}</div>
                <span style={{ fontSize: 14, fontWeight: 600, color: statusColors[status] }}>{count}</span>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Active Projects Table */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.gold }}>Aktívne projekty</span>
          <Btn variant="ghost" onClick={() => setView('projects')} style={{ fontSize: 11, padding: '6px 12px' }}>Všetky</Btn>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['Projekt', 'Klient', 'Stav', 'Progres', 'Budget'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontSize: 10, color: T.textMuted, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: `1px solid ${T.border}` }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {recentProjects.map(p => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: '12px 10px', fontSize: 13, fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: '12px 10px', fontSize: 12, color: T.textMuted }}>{getClient(p.client_id)?.company || '—'}</td>
                  <td style={{ padding: '12px 10px' }}><Badge label={statusLabels[p.status]} color={statusColors[p.status]} /></td>
                  <td style={{ padding: '12px 10px', minWidth: 100 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1 }}><ProgressBar value={p.progress} color={statusColors[p.status]} /></div>
                      <span style={{ fontSize: 11, color: T.textMuted }}>{p.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 10px', fontSize: 12, color: T.textSoft }}>{fmt(p.budget)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// CLIENTS VIEW
// ═══════════════════════════════════════════════════════════════
function ClientsView({ clients, setClients, projects, supaWrite }: { clients: Client[]; setClients: React.Dispatch<React.SetStateAction<Client[]>>; projects: Project[]; supaWrite: { saveClient: (c: Client, isNew: boolean) => void; deleteClient: (id: string) => void } }) {
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<Client | null>(null);
  const [form, setForm] = useState<Partial<Client>>({});

  const filtered = useMemo(() => clients.filter(c => `${c.name} ${c.company} ${c.email} ${c.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase())), [clients, search]);

  const openAdd = () => { setForm({ name: '', company: '', email: '', phone: '', notes: '', tags: [] }); setModal('add'); };
  const openEdit = (c: Client) => { setForm({ ...c }); setSelected(c); setModal('edit'); };

  const save = () => {
    if (!form.name || !form.email) return;
    if (modal === 'add') {
      const newClient = { ...form, id: uid(), created_at: now().slice(0, 10), tags: form.tags || [] } as Client;
      setClients(prev => [...prev, newClient]);
      supaWrite.saveClient(newClient, true);
    } else if (modal === 'edit' && selected) {
      const updated = { ...selected, ...form } as Client;
      setClients(prev => prev.map(c => c.id === selected.id ? updated : c));
      supaWrite.saveClient(updated, false);
    }
    setModal(null);
  };

  const remove = (id: string) => { if (confirm('Odstrániť klienta?')) { setClients(prev => prev.filter(c => c.id !== id)); supaWrite.deleteClient(id); } };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: fontHeading, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400, marginBottom: 4 }}>Klienti</h1>
          <p style={{ color: T.textMuted, fontSize: 14 }}>{clients.length} klientov</p>
        </div>
        <Btn onClick={openAdd}><Icon d={icons.plus} size={16} /> Nový klient</Btn>
      </div>

      <div style={{ marginBottom: 20 }}><SearchInput value={search} onChange={setSearch} placeholder="Hľadať..." /></div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {filtered.map(c => {
          const cp = projects.filter(p => p.client_id === c.id);
          return (
            <Card key={c.id} hover onClick={() => openEdit(c)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: T.gold }}>{c.company}</div>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${T.gold}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: T.gold }}>
                  {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.textMuted }}><Icon d={icons.mail} size={13} /> {c.email}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.textMuted }}><Icon d={icons.phone} size={13} /> {c.phone}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 4 }}>{c.tags.map(t => <Badge key={t} label={t} color={T.gold} />)}</div>
                <span style={{ fontSize: 11, color: T.textMuted }}>{cp.length} projektov</span>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: T.textMuted }}><Icon d={icons.clients} size={48} color={T.textMuted} /><p style={{ marginTop: 16, fontSize: 14 }}>Žiadni klienti</p></div>}

      <Modal open={modal !== null} onClose={() => setModal(null)} title={modal === 'add' ? 'Nový klient' : 'Upraviť klienta'}>
        <FormField label="Meno *"><Input value={form.name || ''} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Meno" /></FormField>
        <FormField label="Firma"><Input value={form.company || ''} onChange={v => setForm(f => ({ ...f, company: v }))} placeholder="Firma" /></FormField>
        <FormField label="E-mail *"><Input value={form.email || ''} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="email@firma.sk" type="email" /></FormField>
        <FormField label="Telefón"><Input value={form.phone || ''} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="+421 ..." /></FormField>
        <FormField label="Poznámky"><TextArea value={form.notes || ''} onChange={v => setForm(f => ({ ...f, notes: v }))} /></FormField>
        <FormField label="Tagy (čiarkou)"><Input value={(form.tags || []).join(', ')} onChange={v => setForm(f => ({ ...f, tags: v.split(',').map(t => t.trim()).filter(Boolean) }))} placeholder="VIP, Web..." /></FormField>
        <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
          {modal === 'edit' && selected && <Btn variant="danger" onClick={() => { remove(selected.id); setModal(null); }}><Icon d={icons.trash} size={16} /></Btn>}
          <Btn variant="ghost" onClick={() => setModal(null)}>Zrušiť</Btn>
          <Btn onClick={save}><Icon d={icons.check} size={16} /> Uložiť</Btn>
        </div>
      </Modal>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROJECTS VIEW
// ═══════════════════════════════════════════════════════════════
function ProjectsView({ projects, setProjects, clients, getClient, supaWrite }: { projects: Project[]; setProjects: React.Dispatch<React.SetStateAction<Project[]>>; clients: Client[]; getClient: (id: string) => Client | undefined; supaWrite: { saveProject: (p: Project, isNew: boolean) => void; deleteProject: (id: string) => void } }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [form, setForm] = useState<Partial<Project>>({});

  const filtered = useMemo(() => {
    let r = projects;
    if (filter !== 'all') r = r.filter(p => p.status === filter);
    if (search) r = r.filter(p => `${p.name} ${getClient(p.client_id)?.company || ''}`.toLowerCase().includes(search.toLowerCase()));
    return r;
  }, [projects, filter, search, getClient]);

  const openAdd = () => { setForm({ name: '', client_id: clients[0]?.id || '', status: 'konzultacia', budget: 0, spent: 0, start_date: now().slice(0, 10), deadline: '', description: '', progress: 0 }); setModal('add'); };
  const openEdit = (p: Project) => { setForm({ ...p }); setSelected(p); setModal('edit'); };
  const save = () => {
    if (!form.name) return;
    if (modal === 'add') {
      const newProject = { ...form, id: uid() } as Project;
      setProjects(prev => [...prev, newProject]);
      supaWrite.saveProject(newProject, true);
    } else if (modal === 'edit' && selected) {
      const updated = { ...selected, ...form } as Project;
      setProjects(prev => prev.map(p => p.id === selected.id ? updated : p));
      supaWrite.saveProject(updated, false);
    }
    setModal(null);
  };
  const remove = (id: string) => { if (confirm('Odstrániť?')) { setProjects(prev => prev.filter(p => p.id !== id)); supaWrite.deleteProject(id); } };
  const statuses: ProjectStatus[] = ['konzultacia', 'navrh', 'vyvoj', 'testovanie', 'spusteny', 'pozastaveny'];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: fontHeading, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400, marginBottom: 4 }}>Projekty</h1>
          <p style={{ color: T.textMuted, fontSize: 14 }}>{projects.length} projektov</p>
        </div>
        <Btn onClick={openAdd}><Icon d={icons.plus} size={16} /> Nový projekt</Btn>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Hľadať..." />
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {['all' as const, ...statuses].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: '7px 12px', borderRadius: 8, cursor: 'pointer', border: filter === s ? `1px solid ${s === 'all' ? T.gold : statusColors[s as ProjectStatus]}` : `1px solid ${T.border}`, background: filter === s ? `${s === 'all' ? T.gold : statusColors[s as ProjectStatus]}10` : 'transparent', color: filter === s ? (s === 'all' ? T.gold : statusColors[s as ProjectStatus]) : T.textMuted, fontSize: 11, fontWeight: 500, fontFamily: font }}>
              {s === 'all' ? 'Všetky' : statusLabels[s as ProjectStatus]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
        {filtered.map(p => {
          const client = getClient(p.client_id);
          const budgetPct = p.budget > 0 ? (p.spent / p.budget) * 100 : 0;
          return (
            <Card key={p.id} hover onClick={() => openEdit(p)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div><div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{p.name}</div><div style={{ fontSize: 12, color: T.textMuted }}>{client?.company || '—'}</div></div>
                <Badge label={statusLabels[p.status]} color={statusColors[p.status]} />
              </div>
              <p style={{ fontSize: 12, color: T.textSoft, marginBottom: 14, lineHeight: 1.5 }}>{p.description}</p>
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 10, color: T.textMuted }}>Progres</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: statusColors[p.status] }}>{p.progress}%</span>
                </div>
                <ProgressBar value={p.progress} color={statusColors[p.status]} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 11, color: T.textMuted }}>{p.start_date ? fmtDate(p.start_date) : '—'} — {p.deadline ? fmtDate(p.deadline) : '—'}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: budgetPct > 90 ? T.red : T.textSoft }}>{fmt(p.spent)}/{fmt(p.budget)}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: T.textMuted, fontSize: 14 }}>Žiadne projekty</div>}

      <Modal open={modal !== null} onClose={() => setModal(null)} title={modal === 'add' ? 'Nový projekt' : 'Upraviť'} width={560}>
        <FormField label="Názov *"><Input value={form.name || ''} onChange={v => setForm(f => ({ ...f, name: v }))} /></FormField>
        <FormField label="Klient"><Select value={form.client_id || ''} onChange={v => setForm(f => ({ ...f, client_id: v }))} options={clients.map(c => ({ value: c.id, label: `${c.name} — ${c.company}` }))} /></FormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Stav"><Select value={form.status || 'konzultacia'} onChange={v => setForm(f => ({ ...f, status: v as ProjectStatus }))} options={statuses.map(s => ({ value: s, label: statusLabels[s] }))} /></FormField>
          <FormField label="Progres (%)"><Input value={String(form.progress ?? 0)} onChange={v => setForm(f => ({ ...f, progress: Math.min(100, Math.max(0, parseInt(v) || 0)) }))} type="number" /></FormField>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Budget (€)"><Input value={String(form.budget ?? 0)} onChange={v => setForm(f => ({ ...f, budget: parseFloat(v) || 0 }))} type="number" /></FormField>
          <FormField label="Minuté (€)"><Input value={String(form.spent ?? 0)} onChange={v => setForm(f => ({ ...f, spent: parseFloat(v) || 0 }))} type="number" /></FormField>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Začiatok"><Input value={form.start_date || ''} onChange={v => setForm(f => ({ ...f, start_date: v }))} type="date" /></FormField>
          <FormField label="Deadline"><Input value={form.deadline || ''} onChange={v => setForm(f => ({ ...f, deadline: v }))} type="date" /></FormField>
        </div>
        <FormField label="Popis"><TextArea value={form.description || ''} onChange={v => setForm(f => ({ ...f, description: v }))} /></FormField>
        <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
          {modal === 'edit' && selected && <Btn variant="danger" onClick={() => { remove(selected.id); setModal(null); }}><Icon d={icons.trash} size={16} /></Btn>}
          <Btn variant="ghost" onClick={() => setModal(null)}>Zrušiť</Btn>
          <Btn onClick={save}><Icon d={icons.check} size={16} /> Uložiť</Btn>
        </div>
      </Modal>
    </>
  );
}

// ─── PDF Invoice Export ──────────────────────────────────────
function exportInvoicePDF(invoice: Invoice, client: Client | undefined) {
  const total = invoice.items.reduce((s, it) => s + it.qty * it.price, 0);
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Faktúra ${invoice.number}</title><style>
    *{margin:0;padding:0;box-sizing:border-box}body{font-family:Helvetica,Arial,sans-serif;color:#222;background:#fff;padding:0}
    .header{background:#0a0908;color:#fff;padding:32px 40px;display:flex;justify-content:space-between;align-items:center}
    .header h1{font-size:28px;font-weight:300;letter-spacing:2px}.header .logo{font-size:24px;font-weight:700;color:#d4a843;border:2px solid #d4a843;padding:6px 14px;border-radius:8px}
    .meta{display:flex;justify-content:space-between;padding:32px 40px;border-bottom:1px solid #eee}
    .meta-block{}.meta-block h3{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;margin-bottom:8px}
    .meta-block p{font-size:13px;line-height:1.6;color:#333}
    .items{padding:24px 40px}.items table{width:100%;border-collapse:collapse}
    .items th{text-align:left;padding:10px 12px;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#999;border-bottom:2px solid #d4a843}
    .items td{padding:12px;font-size:13px;border-bottom:1px solid #eee}
    .items td.num{text-align:right;font-variant-numeric:tabular-nums}
    .total-row{background:#f9f6f0;font-weight:700}.total-row td{border-bottom:none;font-size:15px;color:#0a0908}
    .footer{padding:24px 40px;text-align:center;font-size:11px;color:#999;border-top:1px solid #eee;margin-top:24px}
    .status{display:inline-block;padding:4px 12px;border-radius:4px;font-size:11px;font-weight:600;margin-left:12px;
      ${invoice.status==='paid'?'background:#dcfce7;color:#16a34a':invoice.status==='overdue'?'background:#fee2e2;color:#dc2626':invoice.status==='sent'?'background:#dbeafe;color:#2563eb':'background:#f3f4f6;color:#6b7280'}}
    @media print{body{padding:0}@page{margin:15mm}}
  </style></head><body>
  <div class="header"><h1>FAKTÚRA</h1><div class="logo">VW</div></div>
  <div class="meta">
    <div class="meta-block"><h3>Faktúra</h3><p><strong>${invoice.number}</strong><span class="status">${invoice.status === 'paid' ? 'Zaplatená' : invoice.status === 'sent' ? 'Odoslaná' : invoice.status === 'overdue' ? 'Po splatnosti' : 'Koncept'}</span></p><p>Vystavená: ${new Date(invoice.issued).toLocaleDateString('sk-SK')}</p><p>Splatnosť: ${invoice.due ? new Date(invoice.due).toLocaleDateString('sk-SK') : '—'}</p></div>
    <div class="meta-block" style="text-align:right"><h3>Odberateľ</h3><p><strong>${client?.company || client?.name || '—'}</strong></p><p>${client?.name || ''}</p><p>${client?.email || ''}</p><p>${client?.phone || ''}</p></div>
  </div>
  <div class="meta" style="border-bottom:none;padding-bottom:0">
    <div class="meta-block"><h3>Dodávateľ</h3><p><strong>Vassweb s.r.o.</strong></p><p>info@vassweb.sk</p></div>
  </div>
  <div class="items"><table><thead><tr><th>Popis</th><th style="text-align:right;width:80px">Množstvo</th><th style="text-align:right;width:120px">Cena/ks</th><th style="text-align:right;width:120px">Spolu</th></tr></thead><tbody>
    ${invoice.items.map(it => `<tr><td>${it.desc}</td><td class="num">${it.qty}</td><td class="num">${it.price.toLocaleString('sk-SK')} €</td><td class="num">${(it.qty * it.price).toLocaleString('sk-SK')} €</td></tr>`).join('')}
    <tr class="total-row"><td colspan="3" style="text-align:right;padding-right:12px">CELKOM</td><td class="num">${total.toLocaleString('sk-SK')} €</td></tr>
  </tbody></table></div>
  <div class="footer">Vassweb s.r.o. — vassweb.sk — Faktúra vygenerovaná z Vassweb Business App</div>
  <script>window.onload=function(){window.print()}</script>
  </body></html>`;
  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); }
}

// ═══════════════════════════════════════════════════════════════
// INVOICES VIEW
// ═══════════════════════════════════════════════════════════════
function InvoicesView({ invoices, setInvoices, clients, projects, getClient, supaWrite }: { invoices: Invoice[]; setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>; clients: Client[]; projects: Project[]; getClient: (id: string) => Client | undefined; supaWrite: { saveInvoice: (i: Invoice, isNew: boolean) => void; deleteInvoice: (id: string) => void } }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<InvoiceStatus | 'all'>('all');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [form, setForm] = useState<Partial<Invoice>>({});

  const filtered = useMemo(() => {
    let r = invoices;
    if (filter !== 'all') r = r.filter(i => i.status === filter);
    if (search) r = r.filter(i => `${i.number} ${getClient(i.client_id)?.company || ''}`.toLowerCase().includes(search.toLowerCase()));
    return r;
  }, [invoices, filter, search, getClient]);

  const nextNum = `VW-2026-${String(invoices.length + 1).padStart(3, '0')}`;
  const openAdd = () => { setForm({ number: nextNum, client_id: clients[0]?.id || '', project_id: '', amount: 0, status: 'draft', issued: now().slice(0, 10), due: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10), items: [{ desc: '', qty: 1, price: 0 }] }); setModal('add'); };
  const openEdit = (inv: Invoice) => { setForm({ ...inv }); setSelected(inv); setModal('edit'); };
  const save = () => {
    if (!form.number) return;
    const total = (form.items || []).reduce((s, it) => s + it.qty * it.price, 0);
    if (modal === 'add') {
      const newInv = { ...form, amount: total, id: uid() } as Invoice;
      setInvoices(prev => [...prev, newInv]);
      supaWrite.saveInvoice(newInv, true);
    } else if (modal === 'edit' && selected) {
      const updated = { ...selected, ...form, amount: total } as Invoice;
      setInvoices(prev => prev.map(i => i.id === selected.id ? updated : i));
      supaWrite.saveInvoice(updated, false);
    }
    setModal(null);
  };
  const remove = (id: string) => { if (confirm('Odstrániť?')) { setInvoices(prev => prev.filter(i => i.id !== id)); supaWrite.deleteInvoice(id); } };
  const updateItem = (idx: number, field: string, value: string | number) => setForm(f => { const items = [...(f.items || [])]; items[idx] = { ...items[idx], [field]: value }; return { ...f, items }; });
  const invStatuses: InvoiceStatus[] = ['draft', 'sent', 'paid', 'overdue'];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: fontHeading, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400, marginBottom: 4 }}>Faktúry</h1>
          <p style={{ color: T.textMuted, fontSize: 14 }}>{invoices.length} faktúr</p>
        </div>
        <Btn onClick={openAdd}><Icon d={icons.plus} size={16} /> Nová faktúra</Btn>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 20 }}>
        {invStatuses.map(s => {
          const total = invoices.filter(i => i.status === s).reduce((sum, i) => sum + i.amount, 0);
          const count = invoices.filter(i => i.status === s).length;
          return (
            <Card key={s} onClick={() => setFilter(f => f === s ? 'all' : s)} style={{ cursor: 'pointer', padding: 14, borderColor: filter === s ? invStatusColors[s] : undefined }}>
              <div style={{ fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{invStatusLabels[s]}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: invStatusColors[s] }}>{fmt(total)}</div>
              <div style={{ fontSize: 10, color: T.textMuted }}>{count} faktúr</div>
            </Card>
          );
        })}
      </div>

      <div style={{ marginBottom: 20 }}><SearchInput value={search} onChange={setSearch} placeholder="Hľadať..." /></div>

      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              {['Číslo', 'Klient', 'Suma', 'Stav', 'Vystavená', 'Splatnosť'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontSize: 10, color: T.textMuted, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: `1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id} style={{ borderBottom: `1px solid ${T.border}`, cursor: 'pointer' }} onClick={() => openEdit(inv)}>
                  <td style={{ padding: '12px 10px', fontSize: 13, fontWeight: 600, color: T.gold }}>{inv.number}</td>
                  <td style={{ padding: '12px 10px', fontSize: 12, color: T.textSoft }}>{getClient(inv.client_id)?.company || '—'}</td>
                  <td style={{ padding: '12px 10px', fontSize: 13, fontWeight: 600 }}>{fmt(inv.amount)}</td>
                  <td style={{ padding: '12px 10px' }}><Badge label={invStatusLabels[inv.status]} color={invStatusColors[inv.status]} /></td>
                  <td style={{ padding: '12px 10px', fontSize: 12, color: T.textMuted }}>{fmtDate(inv.issued)}</td>
                  <td style={{ padding: '12px 10px', fontSize: 12, color: inv.status === 'overdue' ? T.red : T.textMuted }}>{fmtDate(inv.due)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: T.textMuted, fontSize: 13 }}>Žiadne faktúry</div>}
      </Card>

      <Modal open={modal !== null} onClose={() => setModal(null)} title={modal === 'add' ? 'Nová faktúra' : `Faktúra ${form.number}`} width={640}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Číslo"><Input value={form.number || ''} onChange={v => setForm(f => ({ ...f, number: v }))} /></FormField>
          <FormField label="Stav"><Select value={form.status || 'draft'} onChange={v => setForm(f => ({ ...f, status: v as InvoiceStatus }))} options={invStatuses.map(s => ({ value: s, label: invStatusLabels[s] }))} /></FormField>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Klient"><Select value={form.client_id || ''} onChange={v => setForm(f => ({ ...f, client_id: v }))} options={clients.map(c => ({ value: c.id, label: c.company || c.name }))} /></FormField>
          <FormField label="Projekt"><Select value={form.project_id || ''} onChange={v => setForm(f => ({ ...f, project_id: v }))} options={[{ value: '', label: '—' }, ...projects.map(p => ({ value: p.id, label: p.name }))]} /></FormField>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Vystavená"><Input value={form.issued || ''} onChange={v => setForm(f => ({ ...f, issued: v }))} type="date" /></FormField>
          <FormField label="Splatnosť"><Input value={form.due || ''} onChange={v => setForm(f => ({ ...f, due: v }))} type="date" /></FormField>
        </div>

        <div style={{ marginTop: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: T.textMuted, marginBottom: 10, letterSpacing: '0.05em' }}>POLOŽKY</div>
          {(form.items || []).map((item, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 100px 28px', gap: 6, marginBottom: 6, alignItems: 'center' }}>
              <input value={item.desc} onChange={e => updateItem(idx, 'desc', e.target.value)} placeholder="Popis"
                style={{ padding: '7px 10px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 12, fontFamily: font, outline: 'none' }} />
              <input type="number" value={item.qty} onChange={e => updateItem(idx, 'qty', parseInt(e.target.value) || 0)}
                style={{ padding: '7px 10px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 12, fontFamily: font, outline: 'none', textAlign: 'center' }} />
              <input type="number" value={item.price} onChange={e => updateItem(idx, 'price', parseFloat(e.target.value) || 0)}
                style={{ padding: '7px 10px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 12, fontFamily: font, outline: 'none', textAlign: 'right' }} />
              <button onClick={() => setForm(f => ({ ...f, items: (f.items || []).filter((_, i) => i !== idx) }))} style={{ background: 'none', border: 'none', color: T.red, cursor: 'pointer', padding: 2 }}><Icon d={icons.x} size={14} /></button>
            </div>
          ))}
          <button onClick={() => setForm(f => ({ ...f, items: [...(f.items || []), { desc: '', qty: 1, price: 0 }] }))}
            style={{ background: 'none', border: `1px dashed ${T.border}`, borderRadius: 8, color: T.textMuted, cursor: 'pointer', padding: '7px 14px', fontSize: 11, fontFamily: font, width: '100%' }}>+ Položka</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 0', borderTop: `1px solid ${T.border}` }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>CELKOM</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: T.gold }}>{fmt((form.items || []).reduce((s, it) => s + it.qty * it.price, 0))}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          {modal === 'edit' && selected && <Btn variant="danger" onClick={() => { remove(selected.id); setModal(null); }}><Icon d={icons.trash} size={16} /></Btn>}
          {modal === 'edit' && selected && <Btn variant="ghost" onClick={() => { const total = (form.items || []).reduce((s, it) => s + it.qty * it.price, 0); exportInvoicePDF({ ...selected, ...form, amount: total } as Invoice, getClient(form.client_id || selected.client_id)); }}><Icon d={icons.download} size={16} /> Export PDF</Btn>}
          <Btn variant="ghost" onClick={() => setModal(null)}>Zrušiť</Btn>
          <Btn onClick={save}><Icon d={icons.check} size={16} /> Uložiť</Btn>
        </div>
      </Modal>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// AI ASSISTANT VIEW
// ═══════════════════════════════════════════════════════════════
function AIView({ clients, projects, invoices }: { clients: Client[]; projects: Project[]; invoices: Invoice[] }) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const suggestions = [
    { title: 'Prehľad projektov', query: 'Daj mi stručný prehľad všetkých aktívnych projektov a ich stav.' },
    { title: 'Faktúry na riešenie', query: 'Ktoré faktúry sú po splatnosti alebo čakajú na odoslanie? Čo mám urobiť?' },
    { title: 'Email klientovi', query: 'Napíš follow-up email pre klienta, ktorý má projekt v stave vývoja.' },
    { title: 'Týždenný report', query: 'Vytvor týždenný report o stave firmy — príjmy, projekty, klienti.' },
    { title: 'Cenová ponuka', query: 'Pomôž mi napísať cenovú ponuku pre nového klienta, ktorý chce e-shop s AI chatbotom.' },
    { title: 'Optimalizácia', query: 'Analyzuj moje dáta a navrhni, kde mám najväčší priestor na zlepšenie.' },
    { title: 'Cenová ponuka pre e-shop', query: 'Vytvor detailnú cenovú ponuku pre e-shop riešenie vrátane dizajnu, vývoja, platobnej brány, SEO a údržby. Rozdeľ na položky s cenami.' },
    { title: 'Email draft pre follow-up', query: 'Napíš follow-up email pre klienta, ktorému sme poslali cenovú ponuku pred týždňom a ešte neodpovedal. Buď zdvorilý ale asertívny.' },
  ];
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: AIMessage = { role: 'user', content: msg, timestamp: now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const totalRev = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
      const pending = invoices.filter(i => ['sent', 'overdue'].includes(i.status)).reduce((s, i) => s + i.amount, 0);
      const overdue = invoices.filter(i => i.status === 'overdue').length;

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          context: {
            stats: { clients: clients.length, activeProjects: projects.filter(p => !['spusteny', 'pozastaveny'].includes(p.status)).length, revenue: totalRev, pending, overdue },
            clients: clients.map(c => ({ name: c.name, company: c.company, tags: c.tags })),
            projects: projects.map(p => ({ name: p.name, status: p.status, progress: p.progress, budget: p.budget, spent: p.spent, deadline: p.deadline })),
            invoices: invoices.map(i => ({ number: i.number, amount: i.amount, status: i.status, due: i.due })),
          },
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply, timestamp: now() }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `Chyba: ${data.error || 'Nepodarilo sa spojiť s AI.'}`, timestamp: now() }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Nastala chyba pri komunikácii s AI. Skontrolujte OPENAI_API_KEY v .env súbore.', timestamp: now() }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: fontHeading, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400, marginBottom: 4 }}>AI Asistent</h1>
        <p style={{ color: T.textMuted, fontSize: 14 }}>Váš inteligentný business partner — pozná vaše projekty, klientov a faktúry</p>
      </div>

      {/* Quick suggestions (only when no messages) */}
      {messages.length === 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 12, letterSpacing: '0.05em' }}>RÝCHLE AKCIE</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {suggestions.map((s, i) => (
              <Card key={i} hover onClick={() => sendMessage(s.query)} style={{ padding: 14, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon d={icons.spark} size={16} color={T.gold} />
                  <span style={{ fontSize: 13, color: T.textSoft }}>{s.title}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Chat area */}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeIn 0.3s ease' }}>
            <div style={{
              maxWidth: '80%', padding: '12px 16px', borderRadius: 14,
              background: m.role === 'user' ? `linear-gradient(135deg, ${T.gold}30, ${T.goldDark}30)` : T.bgCard,
              border: `1px solid ${m.role === 'user' ? T.gold + '30' : T.border}`,
            }}>
              {m.role === 'assistant' && <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><Icon d={icons.ai} size={14} color={T.gold} /><span style={{ fontSize: 11, color: T.gold, fontWeight: 600 }}>AI Asistent</span></div>}
              <div style={{ fontSize: 13, lineHeight: 1.7, color: T.textSoft, whiteSpace: 'pre-wrap' }}>{m.content}</div>
              <div style={{ fontSize: 10, color: T.textMuted, marginTop: 6, textAlign: 'right' }}>{new Date(m.timestamp).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 8, padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon d={icons.ai} size={14} color={T.gold} />
              <span style={{ fontSize: 12, color: T.textMuted, animation: 'pulse 1.5s ease infinite' }}>AI premýšľa...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Spýtajte sa AI na čokoľvek o vašom biznise..."
            rows={1}
            style={{
              width: '100%', padding: '14px 16px', background: T.bgCard,
              border: `1px solid ${T.border}`, borderRadius: 14, color: T.text,
              fontSize: 13, fontFamily: font, outline: 'none', resize: 'none',
              minHeight: 48, maxHeight: 120,
            }}
          />
        </div>
        <Btn onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ height: 48, padding: '0 20px' }}>
          <Icon d={icons.send} size={18} />
        </Btn>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SETTINGS VIEW
// ═══════════════════════════════════════════════════════════════
function SettingsView({ clients, projects, invoices, setClients, setProjects, setInvoices, user, onLogout, syncStatus }: {
  clients: Client[]; projects: Project[]; invoices: Invoice[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  user: string; onLogout: () => void; syncStatus: string;
}) {
  const [msg, setMsg] = useState('');

  const exportData = () => {
    const data = JSON.stringify({ clients, projects, invoices, exported: now() }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `vassweb-backup-${now().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
    setMsg('Záloha stiahnutá!'); setTimeout(() => setMsg(''), 3000);
  };

  const importData = () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const d = JSON.parse(reader.result as string);
          if (d.clients) setClients(d.clients);
          if (d.projects) setProjects(d.projects);
          if (d.invoices) setInvoices(d.invoices);
          setMsg('Import úspešný!');
        } catch { setMsg('Chyba importu!'); }
        setTimeout(() => setMsg(''), 3000);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const resetData = () => {
    if (confirm('Obnoviť demo dáta?')) {
      setClients(demoClients); setProjects(demoProjects); setInvoices(demoInvoices);
      setMsg('Demo dáta obnovené.'); setTimeout(() => setMsg(''), 3000);
    }
  };

  return (
    <>
      <h1 style={{ fontFamily: fontHeading, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400, marginBottom: 28 }}>Nastavenia</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
        {/* User */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.gold, marginBottom: 14 }}>Účet</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: '12px 14px', background: T.bg, borderRadius: 10, border: `1px solid ${T.border}` }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${T.gold}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: T.gold }}>{user.charAt(0).toUpperCase()}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{user}</div>
              <div style={{ fontSize: 11, color: T.textMuted }}>Mód: {syncStatus === 'synced' ? 'Synchronizovaný' : 'Lokálny'}</div>
            </div>
          </div>
          <Btn variant="ghost" onClick={onLogout} style={{ width: '100%', justifyContent: 'center' }}><Icon d={icons.lock} size={16} /> Odhlásiť sa</Btn>
        </Card>

        {/* Data */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.gold, marginBottom: 14 }}>Správa dát</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Btn onClick={exportData} variant="ghost" style={{ justifyContent: 'flex-start', width: '100%' }}><Icon d={icons.download} size={16} /> Export zálohy (JSON)</Btn>
            <Btn onClick={importData} variant="ghost" style={{ justifyContent: 'flex-start', width: '100%' }}><Icon d={icons.download} size={16} /> Import dát</Btn>
            <Btn onClick={resetData} variant="danger" style={{ justifyContent: 'flex-start', width: '100%' }}><Icon d={icons.trash} size={16} /> Obnoviť demo dáta</Btn>
          </div>
          {msg && <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 8, background: msg.includes('Chyba') ? 'rgba(248,113,113,0.1)' : 'rgba(74,222,128,0.1)', color: msg.includes('Chyba') ? T.red : T.green, fontSize: 12 }}>{msg}</div>}
        </Card>

        {/* Stats */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.gold, marginBottom: 14 }}>Štatistiky</div>
          {[
            { l: 'Klienti', v: clients.length },
            { l: 'Projekty', v: projects.length },
            { l: 'Aktívne projekty', v: projects.filter(p => !['spusteny', 'pozastaveny'].includes(p.status)).length },
            { l: 'Faktúry', v: invoices.length },
            { l: 'Zaplatené', v: invoices.filter(i => i.status === 'paid').length },
            { l: 'Obrat', v: fmt(invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)) },
          ].map(s => (
            <div key={s.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 12, color: T.textSoft }}>{s.l}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{s.v}</span>
            </div>
          ))}
        </Card>

        {/* Setup Guide */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.gold, marginBottom: 14 }}>Nastavenie synchronizácie</div>
          <p style={{ fontSize: 12, color: T.textSoft, lineHeight: 1.6, marginBottom: 12 }}>Pre plnú synchronizáciu medzi zariadeniami nastav tieto environment premenné:</p>
          <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, fontSize: 12, fontFamily: 'monospace', color: T.gold, lineHeight: 1.8 }}>
            NEXT_PUBLIC_SUPABASE_URL=<br />
            NEXT_PUBLIC_SUPABASE_ANON_KEY=<br />
            OPENAI_API_KEY=
          </div>
          <p style={{ fontSize: 11, color: T.textMuted, marginTop: 10 }}>Potom spusti SQL schému v Supabase SQL Editor</p>
        </Card>

        {/* About */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${T.goldLight}, ${T.gold}, ${T.goldDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: T.bg }}>VW</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: T.gold }}>Vassweb Business App</div>
              <div style={{ fontSize: 11, color: T.textMuted }}>v2.0 — AI + Sync + PWA</div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: T.textSoft, lineHeight: 1.6 }}>All-in-one business management s AI asistentom, real-time synchronizáciou a mobilnou podporou.</p>
          <div style={{ marginTop: 12, fontSize: 11, color: T.textMuted }}>© 2026 Vassweb s.r.o.</div>
        </Card>
      </div>
    </>
  );
}
