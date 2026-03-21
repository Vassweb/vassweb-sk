'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { auth, db, isSupabaseConfigured } from '@/lib/supabase';

/* ═══════════════════════════════════════════════════════════════
   VASSWEB BUSINESS APP v2.0
   All-in-one CRM / Project / Invoice Manager
   + Supabase sync + AI Assistant + PWA + Auth
   ═══════════════════════════════════════════════════════════════ */

// ─── Types ───────────────────────────────────────────────────
type View = 'dashboard' | 'clients' | 'projects' | 'invoices' | 'tasks' | 'quotes' | 'calendar' | 'documents' | 'analytics' | 'email' | 'ai' | 'settings' | 'help' | 'moj-system' | 'checklist' | 'trening' | 'tyzdenny-prehlad' | 'vc-dashboard' | 'vc-budovy' | 'vc-sluzby' | 'vc-ponuky' | 'vc-sla' | 'vc-airbnb' | 'vc-tepovanie' | 'vc-klienti' | 'vc-dokumenty' | 'vc-nastavenia';
type OrgId = 'vassweb' | 'vassco';
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

type TaskStatus = 'nova' | 'v_procese' | 'hotova' | 'zrusena';
type TaskPriority = 'nizka' | 'stredna' | 'vysoka' | 'urgentna';
type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'invoiced';
type CalEventType = 'meeting' | 'deadline' | 'followup' | 'reminder';

interface Task {
  id: string; title: string; description: string; status: TaskStatus;
  priority: TaskPriority; client_id: string; project_id: string;
  due_date: string; created_at: string;
}

interface Quote {
  id: string; number: string; client_id: string; project_id: string;
  status: QuoteStatus; amount: number; valid_until: string; notes: string;
  items: { desc: string; qty: number; price: number }[];
  created_at: string;
}

interface CalEvent {
  id: string; title: string; description: string; type: CalEventType;
  date: string; time: string; client_id: string; project_id: string;
}

interface DocFile {
  id: string; name: string; file_url: string; file_size: number;
  category: string; client_id: string; project_id: string; created_at: string;
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
const fmt = (n: number | null | undefined) => (Number(n) || 0).toLocaleString('sk-SK', { minimumFractionDigits: 0 }) + ' €';
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

const taskStatusLabels: Record<TaskStatus, string> = { nova: 'Nová', v_procese: 'V procese', hotova: 'Hotová', zrusena: 'Zrušená' };
const taskStatusColors: Record<TaskStatus, string> = { nova: T.blue, v_procese: T.orange, hotova: T.green, zrusena: T.red };
const taskPriorityLabels: Record<TaskPriority, string> = { nizka: 'Nízka', stredna: 'Stredná', vysoka: 'Vysoká', urgentna: 'Urgentná' };
const taskPriorityColors: Record<TaskPriority, string> = { nizka: T.textMuted, stredna: T.blue, vysoka: T.orange, urgentna: T.red };
const quoteStatusLabels: Record<QuoteStatus, string> = { draft: 'Koncept', sent: 'Odoslaná', accepted: 'Akceptovaná', rejected: 'Odmietnutá', invoiced: 'Fakturovaná' };
const quoteStatusColors: Record<QuoteStatus, string> = { draft: T.textMuted, sent: T.blue, accepted: T.green, rejected: T.red, invoiced: T.purple };
const calTypeLabels: Record<CalEventType, string> = { meeting: 'Stretnutie', deadline: 'Deadline', followup: 'Follow-up', reminder: 'Pripomienka' };
const calTypeColors: Record<CalEventType, string> = { meeting: T.blue, deadline: T.red, followup: T.orange, reminder: T.purple };

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
  task: 'M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11',
  quote: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M12 18v-6 M9 15h6',
  doc: 'M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z M13 2v7h7',
  help: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3 M12 17h.01',
  info: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8h.01 M11 12h1v4h1',
  arrowRight: 'M5 12h14 M12 5l7 7-7 7',
  lightbulb: 'M9 21h6 M12 3a6 6 0 00-6 6c0 2.22 1.21 4.16 3 5.2V17a1 1 0 001 1h4a1 1 0 001-1v-2.8c1.79-1.04 3-2.98 3-5.2a6 6 0 00-6-6z',
  workflow: 'M22 12h-4l-3 9L9 3l-3 9H2',
  fire: 'M12 12c2-2.96 0-7-1-8 0 3.038-1.773 4.741-3 6-1.226 1.26-2 3.24-2 5a6 6 0 1012 0c0-1.532-1.056-3.94-2-5-1.786 3-2.791 3-4 2z',
  checkSquare: 'M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11',
  dumbbell: 'M6.5 6.5h11 M6.5 17.5h11 M6 20V4 M18 20V4 M2 8v8 M22 8v8 M2 8h4 M18 8h4 M2 16h4 M18 16h4',
  calendarWeek: 'M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z M16 2v4 M8 2v4 M3 10h18 M8 14h.01 M12 14h.01 M16 14h.01 M8 18h.01 M12 18h.01',
  switchOrg: 'M16 3h5v5 M4 20L21 3 M21 16v5h-5 M15 15l6 6 M4 4l5 5',
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

function InfoTip({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} title={`Info: ${title}`} style={{
        background: 'none', border: `1px solid ${T.border}`, borderRadius: '50%',
        width: 22, height: 22, cursor: 'pointer', color: T.textMuted, display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s',
        padding: 0,
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = T.gold; (e.currentTarget as HTMLButtonElement).style.color = T.gold; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = T.border; (e.currentTarget as HTMLButtonElement).style.color = T.textMuted; }}
      >
        <Icon d={icons.info} size={13} />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={title} width={480}>
        <div style={{ color: T.textSoft, fontSize: 14, lineHeight: 1.7 }}>{children}</div>
      </Modal>
    </>
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
  const [authChecked, setAuthChecked] = useState(false);
  const [view, setView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'local' | 'synced' | 'syncing'>('local');
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [activeOrg, setActiveOrg] = useState<OrgId>('vassweb');

  // Data state — start empty if Supabase configured, demo otherwise
  const [clients, setClients] = useState<Client[]>(isSupabaseConfigured() ? [] : demoClients);
  const [projects, setProjects] = useState<Project[]>(isSupabaseConfigured() ? [] : demoProjects);
  const [invoices, setInvoices] = useState<Invoice[]>(isSupabaseConfigured() ? [] : demoInvoices);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [calEvents, setCalEvents] = useState<CalEvent[]>([]);
  const [docs, setDocs] = useState<DocFile[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Check auth on mount — cookie + localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasCookie = document.cookie.includes('sb-access-token');
    const token = localStorage.getItem('vw-access-token');
    const savedUser = localStorage.getItem('vw-user-email');
    if (hasCookie || token || savedUser) {
      setUser(savedUser || 'user@vassweb.sk');
    } else {
      // No auth — redirect to login
      window.location.href = '/login';
      return;
    }
    setAuthChecked(true);
  }, []);

  // Load data from Supabase or localStorage
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const loadData = async () => {
      if (isSupabaseConfigured()) {
        setSyncStatus('syncing');
        try {
          const [cRes, pRes, iRes, tRes, qRes, eRes, dRes] = await Promise.all([
            db.clients.getAll(),
            db.projects.getAll(),
            db.invoices.getAll(),
            db.tasks.getAll(),
            db.quotes.getAll(),
            db.calendarEvents.getAll(),
            db.documents.getAll(),
          ]);
          if (cancelled) return;
          // Check if any request returned a session error (redirect already handled by supaFetch)
          const allResults = [cRes, pRes, iRes, tRes, qRes, eRes, dRes];
          if (allResults.some(r => r.error === 'Session expired')) return;
          if (cRes.data) setClients(cRes.data.map(c => ({ id: c.id, name: c.name, company: c.company, email: c.email, phone: c.phone, notes: c.notes, created_at: c.created_at, tags: c.tags || [] })));
          if (pRes.data) setProjects(pRes.data.map(p => ({ id: p.id, name: p.name, client_id: p.client_id || '', status: p.status, budget: p.budget, spent: p.spent, start_date: p.start_date || '', deadline: p.deadline || '', description: p.description, progress: p.progress })));
          if (iRes.data) setInvoices(iRes.data.map(i => ({ id: i.id, number: i.number, client_id: i.client_id || '', project_id: i.project_id || '', amount: i.amount, status: i.status as InvoiceStatus, issued: i.issued, due: i.due || '', items: [] })));
          if (tRes.data) setTasks(tRes.data.map(t => ({ id: t.id, title: t.title, description: t.description, status: t.status as TaskStatus, priority: t.priority as TaskPriority, client_id: t.client_id || '', project_id: t.project_id || '', due_date: t.due_date || '', created_at: t.created_at })));
          if (qRes.data) setQuotes(qRes.data.map(q => ({ id: q.id, number: q.number, client_id: q.client_id || '', project_id: q.project_id || '', status: q.status as QuoteStatus, amount: q.amount, valid_until: q.valid_until || '', notes: q.notes, items: [], created_at: q.created_at })));
          if (eRes.data) setCalEvents(eRes.data.map(e => ({ id: e.id, title: e.title, description: e.description, type: e.type as CalEventType, date: e.date, time: e.time || '', client_id: e.client_id || '', project_id: e.project_id || '' })));
          if (dRes.data) setDocs(dRes.data.map(d => ({ id: d.id, name: d.name, file_url: d.file_url, file_size: d.file_size, category: d.category, client_id: d.client_id || '', project_id: d.project_id || '', created_at: d.created_at })));
          // Lazy-create user_settings if missing
          try {
            const sRes = await db.settings.get();
            if (!sRes.data) {
              await db.settings.upsert({ company_name: 'Vass & Co. s.r.o.', company_email: user, invoice_prefix: 'VW', invoice_next_number: 1 });
            }
          } catch {}
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
    async saveTask(t: Task, isNew: boolean) {
      if (!isSupabaseConfigured()) return;
      try { if (isNew) await db.tasks.create(t); else await db.tasks.update(t.id, t); } catch {}
    },
    async deleteTask(id: string) { if (!isSupabaseConfigured()) return; try { await db.tasks.delete(id); } catch {} },
    async saveQuote(q: Quote, isNew: boolean) {
      if (!isSupabaseConfigured()) return;
      const { items: _items, ...rest } = q;
      try { if (isNew) await db.quotes.create(rest); else await db.quotes.update(q.id, rest); } catch {}
    },
    async deleteQuote(id: string) { if (!isSupabaseConfigured()) return; try { await db.quotes.delete(id); } catch {} },
    async saveEvent(e: CalEvent, isNew: boolean) {
      if (!isSupabaseConfigured()) return;
      try { if (isNew) await db.calendarEvents.create(e); else await db.calendarEvents.update(e.id, e); } catch {}
    },
    async deleteEvent(id: string) { if (!isSupabaseConfigured()) return; try { await db.calendarEvents.delete(id); } catch {} },
    async saveDoc(d: DocFile, isNew: boolean) {
      if (!isSupabaseConfigured()) return;
      try { if (isNew) await db.documents.create(d); else await db.documents.update(d.id, d); } catch {}
    },
    async deleteDoc(id: string) { if (!isSupabaseConfigured()) return; try { await db.documents.delete(id); } catch {} },
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

    // Urgent tasks
    const urgentTasks = tasks.filter(t => t.priority === 'urgentna' && t.status !== 'hotova' && t.status !== 'zrusena');
    if (urgentTasks.length > 0) {
      notifs.push({ id: 'urgent-tasks', type: 'warning', title: `${urgentTasks.length} urgentných úloh`, desc: urgentTasks.map(t => t.title).join(', '), time: now() });
    }

    // Tasks with past due dates
    tasks.filter(t => t.due_date && t.status !== 'hotova' && t.status !== 'zrusena').forEach(t => {
      const dueDate = new Date(t.due_date);
      const diff = Math.floor((dueDate.getTime() - today.getTime()) / 86400000);
      if (diff < 0) {
        notifs.push({ id: `task-overdue-${t.id}`, type: 'warning', title: `Úloha po termíne: ${t.title}`, desc: `Mala byť hotová ${fmtDate(t.due_date)}`, time: t.due_date });
      } else if (diff <= 2) {
        notifs.push({ id: `task-due-${t.id}`, type: 'info', title: `Úloha čoskoro: ${t.title}`, desc: `${diff === 0 ? 'Dnes' : diff === 1 ? 'Zajtra' : 'Pozajtra'}`, time: t.due_date });
      }
    });

    // Expiring quotes
    quotes.filter(q => q.status === 'sent' && q.valid_until).forEach(q => {
      const validDate = new Date(q.valid_until);
      const diff = Math.floor((validDate.getTime() - today.getTime()) / 86400000);
      if (diff >= 0 && diff <= 5) {
        const client = clients.find(c => c.id === q.client_id);
        notifs.push({ id: `quote-exp-${q.id}`, type: diff <= 2 ? 'warning' : 'info', title: `Ponuka ${q.number} čoskoro vyprší`, desc: `${client?.company || 'Klient'} — ${diff === 0 ? 'dnes' : `o ${diff} dní`}`, time: q.valid_until });
      }
    });

    setNotifications(notifs);
  }, [clients, projects, invoices, tasks, quotes, loaded]);

  // View from URL param
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view');
      if (v && ['dashboard', 'clients', 'projects', 'invoices', 'ai', 'settings'].includes(v)) {
        setView(v as View);
      }
    } catch {}
  }, []);

  const getClient = useCallback((id: string) => clients.find(c => c.id === id), [clients]);

  const handleLogin = (email: string) => {
    setUser(email);
    localStorage.setItem('vw-user-email', email);
  };

  const handleLogout = async () => {
    await auth.signOut();
    document.cookie = 'sb-access-token=; path=/; max-age=0';
    localStorage.removeItem('vw-user-email');
    localStorage.removeItem('vw-access-token');
    localStorage.removeItem('vw-refresh-token');
    window.location.href = '/login';
  };

  const handleInstall = async () => {
    if (installPrompt && 'prompt' in installPrompt) {
      (installPrompt as { prompt: () => void }).prompt();
      setInstallPrompt(null);
    }
  };

  // Auth gate
  // Show nothing until auth is checked
  if (!authChecked || !user) return null;

  const navItems: { key: View; label: string; icon: string; badge?: number }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: icons.dashboard },
    { key: 'clients', label: 'Klienti', icon: icons.clients, badge: clients.length },
    { key: 'projects', label: 'Projekty', icon: icons.projects, badge: projects.filter(p => !['spusteny', 'pozastaveny'].includes(p.status)).length },
    { key: 'invoices', label: 'Faktúry', icon: icons.invoices, badge: invoices.filter(i => i.status === 'overdue').length },
    { key: 'tasks', label: 'Úlohy', icon: icons.task, badge: tasks.filter(t => t.status !== 'hotova' && t.status !== 'zrusena').length },
    { key: 'quotes', label: 'Ponuky', icon: icons.quote, badge: quotes.filter(q => q.status === 'sent').length },
    { key: 'calendar', label: 'Kalendár', icon: icons.calendar },
    { key: 'documents', label: 'Dokumenty', icon: icons.doc },
    { key: 'analytics', label: 'Analytika', icon: icons.trend },
    { key: 'email', label: 'Emaily', icon: icons.mail },
    { key: 'ai', label: 'AI Asistent', icon: icons.ai },
    { key: 'settings', label: 'Nastavenia', icon: icons.settings },
    { key: 'help', label: 'Návod & Pomoc', icon: icons.help },
  ];

  const vasscoNavItems: { key: View; label: string; icon: string }[] = [
    { key: 'vc-dashboard', label: 'Prehľad', icon: icons.dashboard },
    { key: 'vc-budovy', label: 'Budovy & Objekty', icon: icons.doc },
    { key: 'vc-sluzby', label: 'Služby', icon: icons.settings },
    { key: 'vc-ponuky', label: 'Cenové ponuky', icon: icons.quote },
    { key: 'vc-sla', label: 'SLA & Zmluvy', icon: icons.doc },
    { key: 'vc-klienti', label: 'Klienti', icon: icons.clients },
    { key: 'vc-airbnb', label: 'Airbnb Správa', icon: icons.calendar },
    { key: 'vc-tepovanie', label: 'Tepovanie', icon: icons.task },
    { key: 'vc-dokumenty', label: 'Dokumenty', icon: icons.doc },
    { key: 'vc-nastavenia', label: 'Nastavenia', icon: icons.settings },
  ];

  const systemItems: { key: View; label: string; icon: string }[] = [
    { key: 'moj-system', label: 'Oheň / Vlna / Ľad', icon: icons.fire },
    { key: 'checklist', label: 'Denný Checklist', icon: icons.checkSquare },
    { key: 'trening', label: 'Tréning', icon: icons.dumbbell },
    { key: 'tyzdenny-prehlad', label: 'Týždenný Prehľad', icon: icons.calendarWeek },
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
        {/* Org Switcher */}
        <div style={{ padding: sidebarOpen ? '12px 12px' : '12px 8px', borderBottom: `1px solid ${T.border}` }}>
          <button onClick={() => { const newOrg = activeOrg === 'vassweb' ? 'vassco' : 'vassweb'; setActiveOrg(newOrg); setView(newOrg === 'vassweb' ? 'dashboard' : 'vc-dashboard'); }} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: sidebarOpen ? '10px 12px' : '10px',
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
            borderRadius: 12, background: T.bgHover, border: `1px solid ${T.borderHover}`,
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: activeOrg === 'vassco' ? '50%' : 10, flexShrink: 0,
              background: `linear-gradient(135deg, ${T.goldLight}, ${T.gold}, ${T.goldDark})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: activeOrg === 'vassco' ? 13 : 15, fontWeight: 700, color: T.bg,
              transition: 'border-radius 0.2s',
            }}>{activeOrg === 'vassco' ? 'V&C' : 'VW'}</div>
            {sidebarOpen && (
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.gold, letterSpacing: '0.03em' }}>
                  {activeOrg === 'vassco' ? 'VASS & CO.' : 'VASSWEB'}
                </div>
                <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: '0.05em' }}>
                  {activeOrg === 'vassco' ? 'FACILITY MANAGEMENT' : 'WEB & AI STUDIO'}
                </div>
              </div>
            )}
            {sidebarOpen && <Icon d={icons.switchOrg} size={14} color={T.textMuted} />}
          </button>
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
          {(activeOrg === 'vassweb' ? navItems : vasscoNavItems).map(item => {
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
                {'badge' in item && (item as { badge?: number }).badge && (item as { badge?: number }).badge! > 0 && sidebarOpen ? (
                  <span style={{ marginLeft: 'auto', background: item.key === 'invoices' ? T.red : `${T.gold}30`, color: item.key === 'invoices' ? '#fff' : T.gold, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>{(item as { badge?: number }).badge}</span>
                ) : null}
              </button>
            );
          })}

          {/* ─── MÔJ SYSTÉM sekcia ─── */}
          {sidebarOpen && (
            <div style={{ padding: '12px 14px 4px', marginTop: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: T.gold, letterSpacing: '0.12em', opacity: 0.6 }}>MÔJ SYSTÉM</div>
            </div>
          )}
          {!sidebarOpen && <div style={{ margin: '8px 0', borderTop: `1px solid ${T.border}` }} />}
          {systemItems.map(item => {
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
                fontFamily: font, letterSpacing: '0.02em', width: '100%',
              }}>
                <Icon d={item.icon} size={20} />
                {sidebarOpen && <span>{item.label}</span>}
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
          {view === 'dashboard' && <DashboardView clients={clients} projects={projects} invoices={invoices} tasks={tasks} quotes={quotes} getClient={getClient} setView={setView} notifications={notifications} />}
          {view === 'clients' && <ClientsView clients={clients} setClients={setClients} projects={projects} supaWrite={supaWrite} />}
          {view === 'projects' && <ProjectsView projects={projects} setProjects={setProjects} clients={clients} getClient={getClient} supaWrite={supaWrite} />}
          {view === 'invoices' && <InvoicesView invoices={invoices} setInvoices={setInvoices} clients={clients} projects={projects} getClient={getClient} supaWrite={supaWrite} />}
          {view === 'tasks' && <TasksView tasks={tasks} setTasks={setTasks} clients={clients} projects={projects} getClient={getClient} supaWrite={supaWrite} />}
          {view === 'quotes' && <QuotesView quotes={quotes} setQuotes={setQuotes} clients={clients} projects={projects} getClient={getClient} invoices={invoices} setInvoices={setInvoices} supaWrite={supaWrite} />}
          {view === 'calendar' && <CalendarView events={calEvents} setEvents={setCalEvents} projects={projects} clients={clients} supaWrite={supaWrite} />}
          {view === 'analytics' && <AnalyticsView clients={clients} projects={projects} invoices={invoices} quotes={quotes} tasks={tasks} getClient={getClient} />}
          {view === 'documents' && <DocumentsView docs={docs} setDocs={setDocs} clients={clients} projects={projects} getClient={getClient} supaWrite={supaWrite} />}
          {view === 'email' && <EmailView clients={clients} getClient={getClient} />}
          {view === 'ai' && <AIView clients={clients} projects={projects} invoices={invoices} />}
          {view === 'settings' && <SettingsView clients={clients} projects={projects} invoices={invoices} setClients={setClients} setProjects={setProjects} setInvoices={setInvoices} user={user} onLogout={handleLogout} syncStatus={syncStatus} />}
          {view === 'help' && <HelpView setView={setView} />}
          {view === 'moj-system' && <MojSystemView />}
          {view === 'checklist' && <ChecklistView />}
          {view === 'trening' && <TreningView />}
          {view === 'tyzdenny-prehlad' && <TyzdennyPrehladView />}
          {view === 'vc-dashboard' && <VCDashboardView />}
          {view === 'vc-budovy' && <VCBudovyView />}
          {view === 'vc-sluzby' && <VCSluzbyView />}
          {view === 'vc-ponuky' && <VCPonukyView />}
          {view === 'vc-sla' && <VCSlaView />}
          {view === 'vc-klienti' && <VCKlientiView />}
          {view === 'vc-airbnb' && <VCAirbnbView />}
          {view === 'vc-tepovanie' && <VCTepovanieView />}
          {view === 'vc-dokumenty' && <VCDokumentyView />}
          {view === 'vc-nastavenia' && <VCNastaveniaView />}
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
function DashboardView({ clients, projects, invoices, tasks, quotes, getClient, setView, notifications }: {
  clients: Client[]; projects: Project[]; invoices: Invoice[]; tasks: Task[]; quotes: Quote[];
  getClient: (id: string) => Client | undefined; setView: (v: View) => void; notifications: Notification[];
}) {
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0);
  const pendingRevenue = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + (i.amount || 0), 0);
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
    return { month: m, amount: monthInvoices.reduce((s, inv) => s + (inv.amount || 0), 0) };
  });
  const maxRev = Math.max(...monthlyRev.map(m => m.amount), 1);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontFamily: fontHeading, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400 }}>Dashboard</h1>
            <InfoTip title="Dashboard — Prehľad biznisu">
              <p style={{ marginBottom: 12 }}>Dashboard ti dáva okamžitý prehľad o stave tvojho biznisu:</p>
              <ul style={{ paddingLeft: 18, marginBottom: 12 }}>
                <li style={{ marginBottom: 6 }}><strong style={{ color: T.gold }}>KPI karty</strong> — počet klientov, projektov, faktúr a celkový obrat</li>
                <li style={{ marginBottom: 6 }}><strong style={{ color: T.gold }}>Graf cash flow</strong> — príjmy za posledných 6 mesiacov</li>
                <li style={{ marginBottom: 6 }}><strong style={{ color: T.gold }}>Nadchádzajúce</strong> — blížiace sa deadliny a nezaplatené faktúry</li>
              </ul>
              <p style={{ color: T.textMuted, fontSize: 12 }}>Klikni na KPI karty pre rýchly prechod do príslušnej sekcie.</p>
            </InfoTip>
          </div>
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

      {/* Quick Actions */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.gold, marginRight: 4 }}>Rýchle akcie:</span>
          <Btn variant="ghost" onClick={() => setView('clients')} style={{ fontSize: 11, padding: '6px 14px' }}><Icon d={icons.plus} size={14} /> Nový klient</Btn>
          <Btn variant="ghost" onClick={() => setView('projects')} style={{ fontSize: 11, padding: '6px 14px' }}><Icon d={icons.plus} size={14} /> Nový projekt</Btn>
          <Btn variant="ghost" onClick={() => setView('invoices')} style={{ fontSize: 11, padding: '6px 14px' }}><Icon d={icons.plus} size={14} /> Nová faktúra</Btn>
          <Btn variant="ghost" onClick={() => setView('quotes')} style={{ fontSize: 11, padding: '6px 14px' }}><Icon d={icons.quote} size={14} /> Nová ponuka</Btn>
          <Btn variant="ghost" onClick={() => setView('email')} style={{ fontSize: 11, padding: '6px 14px' }}><Icon d={icons.mail} size={14} /> Poslať email</Btn>
          <Btn variant="ghost" onClick={() => setView('tasks')} style={{ fontSize: 11, padding: '6px 14px' }}><Icon d={icons.task} size={14} /> Nová úloha</Btn>
        </div>
      </Card>

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
                      <text x={padL - 8} y={y + 4} textAnchor="end" fill={T.textMuted} fontSize={9} fontFamily="system-ui">{(val || 0) >= 1000 ? `${((val || 0) / 1000).toFixed(1)}k` : Math.round(val || 0)}</text>
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

      {/* Tasks & Quotes Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18, marginBottom: 24 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.gold }}>Dnešné úlohy</span>
            <Btn variant="ghost" onClick={() => setView('tasks')} style={{ fontSize: 11, padding: '6px 12px' }}>Všetky</Btn>
          </div>
          {tasks.filter(t => t.status !== 'hotova' && t.status !== 'zrusena').slice(0, 5).map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${T.border}` }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: taskPriorityColors[t.priority], flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 13, color: T.textSoft }}>{t.title}</div>
              <Badge label={taskStatusLabels[t.status]} color={taskStatusColors[t.status]} />
            </div>
          ))}
          {tasks.filter(t => t.status !== 'hotova' && t.status !== 'zrusena').length === 0 && <p style={{ fontSize: 12, color: T.textMuted }}>Žiadne aktívne úlohy</p>}
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.gold }}>Čakajúce ponuky</span>
            <Btn variant="ghost" onClick={() => setView('quotes')} style={{ fontSize: 11, padding: '6px 12px' }}>Všetky</Btn>
          </div>
          {quotes.filter(q => q.status === 'sent' || q.status === 'draft').slice(0, 5).map(q => (
            <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${T.border}` }}>
              <div>
                <div style={{ fontSize: 13, color: T.textSoft }}>{q.number}</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>{getClient(q.client_id)?.company || '—'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.gold }}>{fmt(q.amount)}</div>
                <Badge label={quoteStatusLabels[q.status]} color={quoteStatusColors[q.status]} />
              </div>
            </div>
          ))}
          {quotes.filter(q => q.status === 'sent' || q.status === 'draft').length === 0 && <p style={{ fontSize: 12, color: T.textMuted }}>Žiadne čakajúce ponuky</p>}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontFamily: fontHeading, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400 }}>Klienti</h1>
            <InfoTip title="Klienti — CRM">
              <p style={{ marginBottom: 12 }}>Tu eviduješ všetkých svojich klientov. Pre každého klienta ukladáš:</p>
              <ul style={{ paddingLeft: 18, marginBottom: 12 }}>
                <li style={{ marginBottom: 4 }}>Kontaktné údaje (meno, firma, email, telefón)</li>
                <li style={{ marginBottom: 4 }}>Poznámky (napr. typ projektu, cenové dohodnutia)</li>
                <li style={{ marginBottom: 4 }}>Štítky / tagy (napr. "VIP", "Web", "Logo")</li>
              </ul>
              <p style={{ color: T.textMuted, fontSize: 12 }}>Klienti sú prepojení s projektmi a faktúrami. Klikni "+ Nový klient" pre pridanie.</p>
            </InfoTip>
          </div>
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
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontFamily: fontHeading, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400 }}>Projekty</h1>
            <InfoTip title="Projekty — Stavy a Kanban">
              <p style={{ marginBottom: 10 }}>Každý projekt prechádza týmito stavmi:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {[['Konzultácia', 'Prvý kontakt, zisťovanie požiadaviek'], ['Návrh', 'Zaslal si cenovú ponuku, čakáš na odpoveď'], ['Vývoj', 'Aktívna práca na projekte'], ['Testovanie', 'Odovzdávanie, opravy, finalizácia'], ['Spustený', 'Projekt je online / odovzdaný'], ['Pozastavený', 'Dočasne zastavený']].map(([s, d]) => (
                  <div key={s} style={{ display: 'flex', gap: 8 }}><strong style={{ color: T.gold, minWidth: 100 }}>{s}:</strong><span style={{ color: T.textMuted, fontSize: 12 }}>{d}</span></div>
                ))}
              </div>
              <p style={{ color: T.textMuted, fontSize: 12 }}>V Kanban zobrazení môžeš ťahať karty medzi stĺpcami na zmenu stavu.</p>
            </InfoTip>
          </div>
          <p style={{ color: T.textMuted, fontSize: 14 }}>{projects.length} projektov</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant={viewMode === 'list' ? 'primary' : 'ghost'} onClick={() => setViewMode('list')} style={{ fontSize: 11, padding: '8px 14px' }}><Icon d={icons.menu} size={14} /> Zoznam</Btn>
          <Btn variant={viewMode === 'kanban' ? 'primary' : 'ghost'} onClick={() => setViewMode('kanban')} style={{ fontSize: 11, padding: '8px 14px' }}><Icon d={icons.projects} size={14} /> Kanban</Btn>
          <Btn onClick={openAdd}><Icon d={icons.plus} size={16} /> Nový</Btn>
        </div>
      </div>

      {/* Kanban Board */}
      {viewMode === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${statuses.length}, minmax(200px, 1fr))`, gap: 12, overflowX: 'auto', paddingBottom: 16 }}>
          {statuses.map(status => {
            const col = projects.filter(p => p.status === status);
            return (
              <div key={status} style={{ background: `${statusColors[status]}06`, border: `1px solid ${statusColors[status]}20`, borderRadius: 12, padding: 12, minHeight: 300 }}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  const id = e.dataTransfer.getData('projectId');
                  if (id) {
                    setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p));
                    const proj = projects.find(p => p.id === id);
                    if (proj) supaWrite.saveProject({ ...proj, status }, false);
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '8px 10px', borderRadius: 8, background: `${statusColors[status]}12` }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColors[status] }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: statusColors[status], letterSpacing: '0.06em', textTransform: 'uppercase' }}>{statusLabels[status]}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: T.textMuted, background: T.bgCard, borderRadius: 6, padding: '2px 8px' }}>{col.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {col.map(p => {
                    const cl = getClient(p.client_id);
                    return (
                      <div key={p.id} draggable onDragStart={e => e.dataTransfer.setData('projectId', p.id)} onClick={() => openEdit(p)}
                        style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, cursor: 'grab', transition: 'all 0.2s' }}
                        onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = statusColors[status]; }}
                        onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'rgba(212,168,67,0.1)'; }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{p.name}</div>
                        {cl && <div style={{ fontSize: 11, color: T.gold, marginBottom: 8 }}>{cl.company}</div>}
                        <ProgressBar value={p.progress} color={statusColors[status]} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: T.textMuted }}>
                          <span>{p.progress}%</span>
                          <span>{fmt(p.budget)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List view */}
      {viewMode === 'list' && <>
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
      </>}

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
async function exportInvoicePDF(invoice: Invoice, client: Client | undefined) {
  try {
    const res = await fetch('/api/invoices/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoice, client }),
    });
    const html = await res.text();
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
  } catch {
    alert('Chyba pri generovaní PDF');
  }
}

async function emailInvoice(invoice: Invoice, client: Client | undefined) {
  if (!client?.email) { alert('Klient nemá email'); return; }
  if (!confirm(`Odoslať faktúru ${invoice.number} na ${client.email}?`)) return;
  try {
    const total = invoice.items.reduce((s, it) => s + it.qty * it.price, 0);
    const dph = Math.round(total * 0.2 * 100) / 100;
    const res = await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: client.email,
        subject: `Faktúra ${invoice.number} — Vassweb`,
        replyTo: 'richard.vass@vassco.sk',
        html: `<div style="font-family:system-ui;max-width:600px;margin:0 auto;background:#0a0908;color:#e8e0d0;padding:40px 32px;border-radius:8px;">
          <div style="text-align:center;margin-bottom:24px;"><span style="font-size:22px;font-weight:700;color:#d4a843;">V&Co.</span></div>
          <h2 style="color:#fff;font-size:18px;margin-bottom:16px;">Faktúra ${invoice.number}</h2>
          <p style="color:rgba(232,224,208,0.7);font-size:14px;line-height:1.7;">Dobrý deň,<br><br>zasielame Vám faktúru č. <strong style="color:#d4a843;">${invoice.number}</strong> na sumu <strong style="color:#d4a843;">${((total || 0) + (dph || 0)).toLocaleString('sk-SK', { minimumFractionDigits: 2 })} € s DPH</strong>.</p>
          <div style="background:rgba(212,168,67,0.08);border:1px solid rgba(212,168,67,0.2);border-radius:8px;padding:16px;margin:20px 0;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:rgba(232,224,208,0.5);font-size:13px;">Základ DPH</span><span style="color:#e8e0d0;font-size:13px;">${(total || 0).toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €</span></div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:rgba(232,224,208,0.5);font-size:13px;">DPH 20%</span><span style="color:#e8e0d0;font-size:13px;">${(dph || 0).toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €</span></div>
            <div style="display:flex;justify-content:space-between;border-top:1px solid rgba(212,168,67,0.2);padding-top:8px;"><span style="color:#fff;font-size:15px;font-weight:700;">CELKOM</span><span style="color:#d4a843;font-size:18px;font-weight:700;">${((total || 0) + (dph || 0)).toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €</span></div>
          </div>
          <div style="background:rgba(255,255,255,0.03);border-radius:8px;padding:16px;margin-bottom:20px;">
            <p style="color:rgba(232,224,208,0.5);font-size:12px;margin-bottom:6px;">IBAN: <strong style="color:#d4a843;">SK11 0900 0000 0052 3252 7162</strong></p>
            <p style="color:rgba(232,224,208,0.5);font-size:12px;margin-bottom:6px;">VS: <strong style="color:#e8e0d0;">${invoice.number?.replace(/\D/g, '') || ''}</strong></p>
            <p style="color:rgba(232,224,208,0.5);font-size:12px;">Splatnosť: <strong style="color:#e8e0d0;">${invoice.due || '—'}</strong></p>
          </div>
          <p style="color:rgba(232,224,208,0.5);font-size:12px;">Ďakujeme za spoluprácu.<br>Richard Vass, Vassweb</p>
          <div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(212,168,67,0.1);text-align:center;font-size:11px;color:rgba(232,224,208,0.25);">VVD s. r. o. | IČO: 56921021 | vassweb.sk</div>
        </div>`,
      }),
    });
    const data = await res.json();
    if (data.success) alert('Faktúra odoslaná!');
    else alert(`Chyba: ${data.error}`);
  } catch { alert('Chyba pri odosielaní'); }
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontFamily: fontHeading, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400 }}>Faktúry</h1>
            <InfoTip title="Faktúry — Stavy a PDF">
              <p style={{ marginBottom: 10 }}>Stavy faktúr:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {[['Draft', 'Pracovná verzia — ešte nie odoslaná'], ['Odoslaná', 'Klient ju dostal, čaká sa na platbu'], ['Zaplatená', 'Platba prijatá ✓'], ['Po splatnosti', 'Uplynul dátum splatnosti — pošli upomienku']].map(([s, d]) => (
                  <div key={s} style={{ display: 'flex', gap: 8 }}><strong style={{ color: T.gold, minWidth: 100 }}>{s}:</strong><span style={{ color: T.textMuted, fontSize: 12 }}>{d}</span></div>
                ))}
              </div>
              <p style={{ color: T.textMuted, fontSize: 12 }}>Kliknutím na PDF ikonu vygeneruješ a stiahnuť profesionálnu faktúru vo formáte PDF.</p>
            </InfoTip>
          </div>
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
          {modal === 'edit' && selected && <Btn variant="ghost" onClick={() => { const total = (form.items || []).reduce((s, it) => s + it.qty * it.price, 0); exportInvoicePDF({ ...selected, ...form, amount: total } as Invoice, getClient(form.client_id || selected.client_id)); }}><Icon d={icons.download} size={16} /> PDF</Btn>}
          {modal === 'edit' && selected && <Btn variant="ghost" onClick={() => { const total = (form.items || []).reduce((s, it) => s + it.qty * it.price, 0); emailInvoice({ ...selected, ...form, amount: total } as Invoice, getClient(form.client_id || selected.client_id)); }}><Icon d={icons.send} size={16} /> Email</Btn>}
          <Btn variant="ghost" onClick={() => setModal(null)}>Zrušiť</Btn>
          <Btn onClick={save}><Icon d={icons.check} size={16} /> Uložiť</Btn>
        </div>
      </Modal>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// TASKS VIEW
// ═══════════════════════════════════════════════════════════════
function TasksView({ tasks, setTasks, clients, projects, getClient, supaWrite }: {
  tasks: Task[]; setTasks: React.Dispatch<React.SetStateAction<Task[]>>; clients: Client[]; projects: Project[];
  getClient: (id: string) => Client | undefined;
  supaWrite: { saveTask: (t: Task, isNew: boolean) => void; deleteTask: (id: string) => void };
}) {
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [prioFilter, setPrioFilter] = useState<TaskPriority | 'all'>('all');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<Task | null>(null);
  const [form, setForm] = useState<Partial<Task>>({});

  const filtered = useMemo(() => {
    let r = tasks;
    if (filter !== 'all') r = r.filter(t => t.status === filter);
    if (prioFilter !== 'all') r = r.filter(t => t.priority === prioFilter);
    return r;
  }, [tasks, filter, prioFilter]);

  const openAdd = () => { setForm({ title: '', description: '', status: 'nova', priority: 'stredna', client_id: '', project_id: '', due_date: '' }); setModal('add'); };
  const openEdit = (t: Task) => { setForm({ ...t }); setSelected(t); setModal('edit'); };

  const save = () => {
    if (!form.title) return;
    if (modal === 'add') {
      const n = { ...form, id: uid(), created_at: now() } as Task;
      setTasks(prev => [n, ...prev]);
      supaWrite.saveTask(n, true);
    } else if (modal === 'edit' && selected) {
      const u = { ...selected, ...form } as Task;
      setTasks(prev => prev.map(t => t.id === selected.id ? u : t));
      supaWrite.saveTask(u, false);
    }
    setModal(null);
  };

  const remove = (id: string) => { if (confirm('Odstrániť úlohu?')) { setTasks(prev => prev.filter(t => t.id !== id)); supaWrite.deleteTask(id); } };

  const changeStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    const task = tasks.find(t => t.id === id);
    if (task) supaWrite.saveTask({ ...task, status }, false);
  };

  const statuses: TaskStatus[] = ['nova', 'v_procese', 'hotova', 'zrusena'];
  const priorities: TaskPriority[] = ['nizka', 'stredna', 'vysoka', 'urgentna'];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontFamily: fontHeading, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400 }}>Úlohy</h1>
            <InfoTip title="Úlohy — To-do prepojené s projektmi">
              <p style={{ marginBottom: 10 }}>Úlohy sú prepojené s konkrétnym klientom a projektom. Priority:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {[['🔴 Urgentná', 'Riešiť ihneď — blocker alebo klientská požiadavka'], ['🟠 Vysoká', 'Dôležité, riešiť dnes alebo zajtra'], ['🔵 Stredná', 'Normálny postup práce'], ['⚪ Nízka', 'Keď bude čas']].map(([s, d]) => (
                  <div key={s} style={{ display: 'flex', gap: 8 }}><span style={{ minWidth: 110, fontSize: 12 }}>{s}:</span><span style={{ color: T.textMuted, fontSize: 12 }}>{d}</span></div>
                ))}
              </div>
              <p style={{ color: T.textMuted, fontSize: 12 }}>Stav úlohy zmeníš kliknutím na tlačidlá V procese / Hotová priamo v zozname.</p>
            </InfoTip>
          </div>
          <p style={{ color: T.textMuted, fontSize: 14 }}>{tasks.filter(t => t.status !== 'hotova' && t.status !== 'zrusena').length} aktívnych</p>
        </div>
        <Btn onClick={openAdd}><Icon d={icons.plus} size={16} /> Nová úloha</Btn>
      </div>

      {/* Status summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
        {statuses.map(s => {
          const count = tasks.filter(t => t.status === s).length;
          return (
            <Card key={s} onClick={() => setFilter(f => f === s ? 'all' : s)} style={{ cursor: 'pointer', padding: 14, borderColor: filter === s ? taskStatusColors[s] : undefined }}>
              <div style={{ fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{taskStatusLabels[s]}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: taskStatusColors[s] }}>{count}</div>
            </Card>
          );
        })}
      </div>

      {/* Priority filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => setPrioFilter('all')} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontFamily: font, border: `1px solid ${prioFilter === 'all' ? T.gold : T.border}`, background: prioFilter === 'all' ? `${T.gold}15` : 'transparent', color: prioFilter === 'all' ? T.gold : T.textMuted }}>Všetky</button>
        {priorities.map(p => (
          <button key={p} onClick={() => setPrioFilter(f => f === p ? 'all' : p)} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontFamily: font, border: `1px solid ${prioFilter === p ? taskPriorityColors[p] : T.border}`, background: prioFilter === p ? `${taskPriorityColors[p]}15` : 'transparent', color: prioFilter === p ? taskPriorityColors[p] : T.textMuted }}>{taskPriorityLabels[p]}</button>
        ))}
      </div>

      {/* Task list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(t => (
          <Card key={t.id} hover onClick={() => openEdit(t)} style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: taskPriorityColors[t.priority], flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, textDecoration: t.status === 'hotova' ? 'line-through' : 'none', opacity: t.status === 'zrusena' ? 0.4 : 1 }}>{t.title}</div>
                <div style={{ display: 'flex', gap: 8, fontSize: 11, color: T.textMuted, marginTop: 4 }}>
                  {t.client_id && <span>{getClient(t.client_id)?.company}</span>}
                  {t.due_date && <span>• do {fmtDate(t.due_date)}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {statuses.filter(s => s !== t.status).slice(0, 2).map(s => (
                  <button key={s} onClick={e => { e.stopPropagation(); changeStatus(t.id, s); }}
                    style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, cursor: 'pointer', fontFamily: font, border: `1px solid ${taskStatusColors[s]}40`, background: 'transparent', color: taskStatusColors[s] }}>
                    {taskStatusLabels[s]}
                  </button>
                ))}
              </div>
              <Badge label={taskStatusLabels[t.status]} color={taskStatusColors[t.status]} />
            </div>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: T.textMuted }}><Icon d={icons.task} size={48} color={T.textMuted} /><p style={{ marginTop: 16, fontSize: 14 }}>Žiadne úlohy</p></div>}

      <Modal open={modal !== null} onClose={() => setModal(null)} title={modal === 'add' ? 'Nová úloha' : 'Upraviť úlohu'}>
        <FormField label="Názov *"><Input value={form.title || ''} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="Názov úlohy" /></FormField>
        <FormField label="Popis"><TextArea value={form.description || ''} onChange={v => setForm(f => ({ ...f, description: v }))} /></FormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Stav"><Select value={form.status || 'nova'} onChange={v => setForm(f => ({ ...f, status: v as TaskStatus }))} options={statuses.map(s => ({ value: s, label: taskStatusLabels[s] }))} /></FormField>
          <FormField label="Priorita"><Select value={form.priority || 'stredna'} onChange={v => setForm(f => ({ ...f, priority: v as TaskPriority }))} options={priorities.map(p => ({ value: p, label: taskPriorityLabels[p] }))} /></FormField>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Klient"><Select value={form.client_id || ''} onChange={v => setForm(f => ({ ...f, client_id: v }))} options={[{ value: '', label: '—' }, ...clients.map(c => ({ value: c.id, label: c.company || c.name }))]} /></FormField>
          <FormField label="Projekt"><Select value={form.project_id || ''} onChange={v => setForm(f => ({ ...f, project_id: v }))} options={[{ value: '', label: '—' }, ...projects.map(p => ({ value: p.id, label: p.name }))]} /></FormField>
        </div>
        <FormField label="Deadline"><Input value={form.due_date || ''} onChange={v => setForm(f => ({ ...f, due_date: v }))} type="date" /></FormField>
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
// QUOTES VIEW
// ═══════════════════════════════════════════════════════════════
function QuotesView({ quotes, setQuotes, clients, projects, getClient, invoices, setInvoices, supaWrite }: {
  quotes: Quote[]; setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>; clients: Client[]; projects: Project[];
  getClient: (id: string) => Client | undefined; invoices: Invoice[]; setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  supaWrite: { saveQuote: (q: Quote, isNew: boolean) => void; deleteQuote: (id: string) => void; saveInvoice: (i: Invoice, isNew: boolean) => void };
}) {
  const [filter, setFilter] = useState<QuoteStatus | 'all'>('all');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<Quote | null>(null);
  const [form, setForm] = useState<Partial<Quote>>({});

  const filtered = useMemo(() => filter === 'all' ? quotes : quotes.filter(q => q.status === filter), [quotes, filter]);

  const nextNum = `CP-${String(quotes.length + 1).padStart(3, '0')}`;
  const openAdd = () => { setForm({ number: nextNum, client_id: clients[0]?.id || '', project_id: '', status: 'draft', amount: 0, valid_until: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10), notes: '', items: [{ desc: '', qty: 1, price: 0 }] }); setModal('add'); };
  const openEdit = (q: Quote) => { setForm({ ...q }); setSelected(q); setModal('edit'); };

  const save = () => {
    if (!form.number) return;
    const total = (form.items || []).reduce((s, it) => s + it.qty * it.price, 0);
    if (modal === 'add') {
      const n = { ...form, amount: total, id: uid(), created_at: now() } as Quote;
      setQuotes(prev => [n, ...prev]);
      supaWrite.saveQuote(n, true);
    } else if (modal === 'edit' && selected) {
      const u = { ...selected, ...form, amount: total } as Quote;
      setQuotes(prev => prev.map(q => q.id === selected.id ? u : q));
      supaWrite.saveQuote(u, false);
    }
    setModal(null);
  };

  const remove = (id: string) => { if (confirm('Odstrániť ponuku?')) { setQuotes(prev => prev.filter(q => q.id !== id)); supaWrite.deleteQuote(id); } };

  const convertToInvoice = (q: Quote) => {
    const invNum = `VW-2026-${String(invoices.length + 1).padStart(3, '0')}`;
    const newInv: Invoice = {
      id: uid(), number: invNum, client_id: q.client_id, project_id: q.project_id,
      amount: q.amount, status: 'draft', issued: now().slice(0, 10),
      due: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      items: (q.items || []).map(it => ({ desc: it.desc, qty: it.qty, price: it.price })),
    };
    setInvoices(prev => [newInv, ...prev]);
    supaWrite.saveInvoice(newInv, true);
    setQuotes(prev => prev.map(qu => qu.id === q.id ? { ...qu, status: 'invoiced' as QuoteStatus } : qu));
    supaWrite.saveQuote({ ...q, status: 'invoiced' }, false);
    alert(`Faktúra ${invNum} vytvorená z ponuky ${q.number}!`);
  };

  const generateQuotePDF = async (q: Quote) => {
    try {
      const client = getClient(q.client_id);
      const res = await fetch('/api/quotes/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote: q, client }),
      });
      const html = await res.text();
      const w = window.open('', '_blank');
      if (w) { w.document.write(html); w.document.close(); }
    } catch { alert('Chyba pri generovaní PDF'); }
  };

  const updateItem = (idx: number, field: string, value: string | number) => setForm(f => { const items = [...(f.items || [])]; items[idx] = { ...items[idx], [field]: value }; return { ...f, items }; });
  const qStatuses: QuoteStatus[] = ['draft', 'sent', 'accepted', 'rejected', 'invoiced'];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontFamily: fontHeading, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400 }}>Cenové ponuky</h1>
            <InfoTip title="Cenové ponuky — PDF a konverzia">
              <p style={{ marginBottom: 10 }}>Stavy ponúk:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {[['Draft', 'Pripravuješ ponuku, ešte nie odoslaná'], ['Odoslaná', 'Klient ju dostal, čakáš na odpoveď'], ['Prijatá', 'Klient súhlasil — tlačidlo "→ Faktúra" ju prekonvertuje'], ['Odmietnutá', 'Klient odmietol'], ['Fakturovaná', 'Vytvorená faktúra z ponuky']].map(([s, d]) => (
                  <div key={s} style={{ display: 'flex', gap: 8 }}><strong style={{ color: T.gold, minWidth: 100 }}>{s}:</strong><span style={{ color: T.textMuted, fontSize: 12 }}>{d}</span></div>
                ))}
              </div>
              <p style={{ color: T.textMuted, fontSize: 12 }}>Klikni na PDF ikonu pre profesionálny PDF výstup. Prijatú ponuku prekonvertuješ na faktúru jedným klikom.</p>
            </InfoTip>
          </div>
          <p style={{ color: T.textMuted, fontSize: 14 }}>{quotes.length} ponúk</p>
        </div>
        <Btn onClick={openAdd}><Icon d={icons.plus} size={16} /> Nová ponuka</Btn>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
        {qStatuses.map(s => {
          const total = quotes.filter(q => q.status === s).reduce((sum, q) => sum + q.amount, 0);
          const count = quotes.filter(q => q.status === s).length;
          return (
            <Card key={s} onClick={() => setFilter(f => f === s ? 'all' : s)} style={{ cursor: 'pointer', padding: 14, borderColor: filter === s ? quoteStatusColors[s] : undefined }}>
              <div style={{ fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{quoteStatusLabels[s]}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: quoteStatusColors[s] }}>{fmt(total)}</div>
              <div style={{ fontSize: 10, color: T.textMuted }}>{count} ponúk</div>
            </Card>
          );
        })}
      </div>

      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              {['Číslo', 'Klient', 'Suma', 'Stav', 'Platnosť', ''].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontSize: 10, color: T.textMuted, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: `1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(q => (
                <tr key={q.id} style={{ borderBottom: `1px solid ${T.border}`, cursor: 'pointer' }} onClick={() => openEdit(q)}>
                  <td style={{ padding: '12px 10px', fontSize: 13, fontWeight: 600, color: T.gold }}>{q.number}</td>
                  <td style={{ padding: '12px 10px', fontSize: 12, color: T.textSoft }}>{getClient(q.client_id)?.company || '—'}</td>
                  <td style={{ padding: '12px 10px', fontSize: 13, fontWeight: 600 }}>{fmt(q.amount)}</td>
                  <td style={{ padding: '12px 10px' }}><Badge label={quoteStatusLabels[q.status]} color={quoteStatusColors[q.status]} /></td>
                  <td style={{ padding: '12px 10px', fontSize: 12, color: T.textMuted }}>{fmtDate(q.valid_until)}</td>
                  <td style={{ padding: '12px 10px', display: 'flex', gap: 6 }}>
                    <button onClick={e => { e.stopPropagation(); generateQuotePDF(q); }} title="PDF" style={{ padding: '4px 8px', borderRadius: 6, fontSize: 10, cursor: 'pointer', fontFamily: font, border: `1px solid ${T.border}`, background: 'transparent', color: T.textSoft }}>PDF</button>
                    {q.status === 'accepted' && <button onClick={e => { e.stopPropagation(); convertToInvoice(q); }} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, cursor: 'pointer', fontFamily: font, border: `1px solid ${T.gold}`, background: `${T.gold}15`, color: T.gold }}>→ Faktúra</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: T.textMuted, fontSize: 13 }}>Žiadne ponuky</div>}
      </Card>

      <Modal open={modal !== null} onClose={() => setModal(null)} title={modal === 'add' ? 'Nová ponuka' : `Ponuka ${form.number}`} width={640}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Číslo"><Input value={form.number || ''} onChange={v => setForm(f => ({ ...f, number: v }))} /></FormField>
          <FormField label="Stav"><Select value={form.status || 'draft'} onChange={v => setForm(f => ({ ...f, status: v as QuoteStatus }))} options={qStatuses.map(s => ({ value: s, label: quoteStatusLabels[s] }))} /></FormField>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Klient"><Select value={form.client_id || ''} onChange={v => setForm(f => ({ ...f, client_id: v }))} options={[{ value: '', label: '—' }, ...clients.map(c => ({ value: c.id, label: c.company || c.name }))]} /></FormField>
          <FormField label="Platnosť do"><Input value={form.valid_until || ''} onChange={v => setForm(f => ({ ...f, valid_until: v }))} type="date" /></FormField>
        </div>
        <FormField label="Poznámky"><TextArea value={form.notes || ''} onChange={v => setForm(f => ({ ...f, notes: v }))} /></FormField>
        <div style={{ marginTop: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: T.textMuted, marginBottom: 10, letterSpacing: '0.05em' }}>POLOŽKY</div>
          {(form.items || []).map((item, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 100px 28px', gap: 6, marginBottom: 6, alignItems: 'center' }}>
              <input value={item.desc} onChange={e => updateItem(idx, 'desc', e.target.value)} placeholder="Popis" style={{ padding: '7px 10px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 12, fontFamily: font, outline: 'none' }} />
              <input type="number" value={item.qty} onChange={e => updateItem(idx, 'qty', parseInt(e.target.value) || 0)} style={{ padding: '7px 10px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 12, fontFamily: font, outline: 'none', textAlign: 'center' }} />
              <input type="number" value={item.price} onChange={e => updateItem(idx, 'price', parseFloat(e.target.value) || 0)} style={{ padding: '7px 10px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 12, fontFamily: font, outline: 'none', textAlign: 'right' }} />
              <button onClick={() => setForm(f => ({ ...f, items: (f.items || []).filter((_, i) => i !== idx) }))} style={{ background: 'none', border: 'none', color: T.red, cursor: 'pointer', padding: 2 }}><Icon d={icons.x} size={14} /></button>
            </div>
          ))}
          <button onClick={() => setForm(f => ({ ...f, items: [...(f.items || []), { desc: '', qty: 1, price: 0 }] }))} style={{ background: 'none', border: `1px dashed ${T.border}`, borderRadius: 8, color: T.textMuted, cursor: 'pointer', padding: '7px 14px', fontSize: 11, fontFamily: font, width: '100%' }}>+ Položka</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 0', borderTop: `1px solid ${T.border}` }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>CELKOM</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: T.gold }}>{fmt((form.items || []).reduce((s, it) => s + it.qty * it.price, 0))}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          {modal === 'edit' && selected && <Btn variant="danger" onClick={() => { remove(selected.id); setModal(null); }}><Icon d={icons.trash} size={16} /></Btn>}
          <Btn variant="ghost" onClick={() => setModal(null)}>Zrušiť</Btn>
          <Btn onClick={save}><Icon d={icons.check} size={16} /> Uložiť</Btn>
        </div>
      </Modal>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// CALENDAR VIEW
// ═══════════════════════════════════════════════════════════════
function CalendarView({ events, setEvents, projects, clients, supaWrite }: {
  events: CalEvent[]; setEvents: React.Dispatch<React.SetStateAction<CalEvent[]>>; projects: Project[]; clients: Client[];
  supaWrite: { saveEvent: (e: CalEvent, isNew: boolean) => void; deleteEvent: (id: string) => void };
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<CalEvent | null>(null);
  const [form, setForm] = useState<Partial<CalEvent>>({});
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December'];
  const dayNames = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0

  // All events for this month including project deadlines
  const allEvents = useMemo(() => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    const calEvts = events.filter(e => e.date.startsWith(monthStr));
    const deadlineEvts: CalEvent[] = projects
      .filter(p => p.deadline && p.deadline.startsWith(monthStr) && !['spusteny', 'pozastaveny'].includes(p.status))
      .map(p => ({ id: `dl-${p.id}`, title: `Deadline: ${p.name}`, description: '', type: 'deadline' as CalEventType, date: p.deadline, time: '', client_id: p.client_id, project_id: p.id }));
    return [...calEvts, ...deadlineEvts];
  }, [events, projects, year, month]);

  const prev = () => setCurrentDate(new Date(year, month - 1, 1));
  const next = () => setCurrentDate(new Date(year, month + 1, 1));

  const openAddForDay = (day: number) => {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setForm({ title: '', description: '', type: 'meeting', date, time: '10:00', client_id: '', project_id: '' });
    setModal('add');
  };
  const openEdit = (e: CalEvent) => { if (e.id.startsWith('dl-')) return; setForm({ ...e }); setSelected(e); setModal('edit'); };

  const save = () => {
    if (!form.title || !form.date) return;
    if (modal === 'add') {
      const n = { ...form, id: uid() } as CalEvent;
      setEvents(prev => [n, ...prev]);
      supaWrite.saveEvent(n, true);
    } else if (modal === 'edit' && selected) {
      const u = { ...selected, ...form } as CalEvent;
      setEvents(prev => prev.map(e => e.id === selected.id ? u : e));
      supaWrite.saveEvent(u, false);
    }
    setModal(null);
  };
  const remove = (id: string) => { if (confirm('Odstrániť?')) { setEvents(prev => prev.filter(e => e.id !== id)); supaWrite.deleteEvent(id); } };

  const types: CalEventType[] = ['meeting', 'deadline', 'followup', 'reminder'];
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: fontHeading, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400, marginBottom: 4 }}>Kalendár</h1>
          <p style={{ color: T.textMuted, fontSize: 14 }}>{allEvents.length} udalostí tento mesiac</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="ghost" onClick={() => setViewMode(v => v === 'month' ? 'week' : 'month')} style={{ fontSize: 11 }}>{viewMode === 'month' ? 'Týždeň' : 'Mesiac'}</Btn>
        </div>
      </div>

      {/* Month navigation */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={prev} style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 8, color: T.gold, cursor: 'pointer', padding: '6px 14px', fontFamily: font, fontSize: 13 }}>← Pred</button>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: T.gold }}>{monthNames[month]} {year}</h2>
          <button onClick={next} style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 8, color: T.gold, cursor: 'pointer', padding: '6px 14px', fontFamily: font, fontSize: 13 }}>Ďalej →</button>
        </div>
      </Card>

      {/* Calendar grid */}
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
          {/* Day headers */}
          {dayNames.map(d => (
            <div key={d} style={{ padding: '8px 4px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: '0.08em' }}>{d}</div>
          ))}
          {/* Empty cells */}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`e${i}`} style={{ padding: 8, minHeight: 80, background: 'rgba(0,0,0,0.2)', borderRadius: 4 }} />
          ))}
          {/* Days */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = allEvents.filter(e => e.date === dateStr);
            const isToday = dateStr === todayStr;
            return (
              <div key={day} onClick={() => openAddForDay(day)} style={{
                padding: 8, minHeight: 80, borderRadius: 4, cursor: 'pointer',
                background: isToday ? `${T.gold}08` : 'rgba(255,255,255,0.01)',
                border: isToday ? `1px solid ${T.gold}30` : `1px solid ${T.border}`,
                transition: 'background 0.2s',
              }}>
                <div style={{ fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? T.gold : T.textSoft, marginBottom: 4 }}>{day}</div>
                {dayEvents.slice(0, 3).map(e => (
                  <div key={e.id} onClick={ev => { ev.stopPropagation(); openEdit(e); }}
                    style={{ padding: '2px 6px', marginBottom: 2, borderRadius: 4, fontSize: 10, background: `${calTypeColors[e.type]}20`, color: calTypeColors[e.type], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                    {e.title}
                  </div>
                ))}
                {dayEvents.length > 3 && <div style={{ fontSize: 9, color: T.textMuted }}>+{dayEvents.length - 3}</div>}
              </div>
            );
          })}
        </div>
      </Card>

      <Modal open={modal !== null} onClose={() => setModal(null)} title={modal === 'add' ? 'Nová udalosť' : 'Upraviť udalosť'}>
        <FormField label="Názov *"><Input value={form.title || ''} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="Názov" /></FormField>
        <FormField label="Popis"><TextArea value={form.description || ''} onChange={v => setForm(f => ({ ...f, description: v }))} rows={2} /></FormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Typ"><Select value={form.type || 'meeting'} onChange={v => setForm(f => ({ ...f, type: v as CalEventType }))} options={types.map(t => ({ value: t, label: calTypeLabels[t] }))} /></FormField>
          <FormField label="Čas"><Input value={form.time || ''} onChange={v => setForm(f => ({ ...f, time: v }))} type="time" /></FormField>
        </div>
        <FormField label="Dátum"><Input value={form.date || ''} onChange={v => setForm(f => ({ ...f, date: v }))} type="date" /></FormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Klient"><Select value={form.client_id || ''} onChange={v => setForm(f => ({ ...f, client_id: v }))} options={[{ value: '', label: '—' }, ...clients.map(c => ({ value: c.id, label: c.company || c.name }))]} /></FormField>
          <FormField label="Projekt"><Select value={form.project_id || ''} onChange={v => setForm(f => ({ ...f, project_id: v }))} options={[{ value: '', label: '—' }, ...projects.map(p => ({ value: p.id, label: p.name }))]} /></FormField>
        </div>
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
// DOCUMENTS VIEW
// ═══════════════════════════════════════════════════════════════
function DocumentsView({ docs, setDocs, clients, projects, getClient, supaWrite }: {
  docs: DocFile[]; setDocs: React.Dispatch<React.SetStateAction<DocFile[]>>; clients: Client[]; projects: Project[];
  getClient: (id: string) => Client | undefined;
  supaWrite: { saveDoc: (d: DocFile, isNew: boolean) => void; deleteDoc: (id: string) => void };
}) {
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState<'add' | null>(null);
  const [form, setForm] = useState<Partial<DocFile>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Record<string, unknown> | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const categories = ['zmluva', 'ponuka', 'faktura', 'podklady', 'assets'];
  const catLabels: Record<string, string> = { zmluva: 'Zmluvy', ponuka: 'Ponuky', faktura: 'Faktúry', podklady: 'Podklady', assets: 'Assets' };

  const filtered = useMemo(() => filter === 'all' ? docs : docs.filter(d => d.category === filter), [docs, filter]);

  const fmtSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if ((bytes || 0) < 1024 * 1024) return `${((bytes || 0) / 1024).toFixed(1)} KB`;
    return `${((bytes || 0) / 1024 / 1024).toFixed(1)} MB`;
  };

  const openAdd = () => { setForm({ name: '', file_url: '', file_size: 0, category: 'podklady', client_id: '', project_id: '' }); setAnalysis(null); setModal('add'); };

  const handleFileUpload = async (file: File) => {
    setAnalyzing(true);
    setAnalysis(null);
    setForm(f => ({ ...f, name: file.name, file_size: file.size }));

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];

      // Create object URL for preview/download
      const objectUrl = URL.createObjectURL(file);
      setForm(f => ({ ...f, file_url: objectUrl }));

      // Send to AI for analysis
      try {
        const res = await fetch('/api/documents/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileBase64: base64, fileName: file.name, mimeType: file.type }),
        });
        const data = await res.json();
        if (data.analysis) {
          setAnalysis(data.analysis);
          // Auto-fill form from analysis
          setForm(f => ({
            ...f,
            category: data.analysis.category || f.category,
            name: file.name,
          }));
          // Try to match client
          if (data.analysis.client_name) {
            const match = clients.find(c =>
              c.company.toLowerCase().includes(data.analysis.client_name.toLowerCase()) ||
              c.name.toLowerCase().includes(data.analysis.client_name.toLowerCase())
            );
            if (match) setForm(f => ({ ...f, client_id: match.id }));
          }
        }
      } catch { /* AI not available, continue without analysis */ }
      setAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) { setModal('add'); handleFileUpload(file); }
  };

  const save = () => {
    if (!form.name) return;
    const n = { ...form, id: uid(), created_at: now(), file_url: form.file_url || '' } as DocFile;
    setDocs(prev => [n, ...prev]);
    supaWrite.saveDoc(n, true);
    setModal(null);
    setAnalysis(null);
  };

  const remove = (id: string) => { if (confirm('Odstrániť dokument?')) { setDocs(prev => prev.filter(d => d.id !== id)); supaWrite.deleteDoc(id); } };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: fontHeading, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400, marginBottom: 4 }}>Dokumenty</h1>
          <p style={{ color: T.textMuted, fontSize: 14 }}>{docs.length} súborov • AI automatická kategorizácia</p>
        </div>
        <Btn onClick={openAdd}><Icon d={icons.plus} size={16} /> Nahrať dokument</Btn>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragOver ? T.gold : T.border}`, borderRadius: 14, padding: 32,
          textAlign: 'center', marginBottom: 20, cursor: 'pointer',
          background: dragOver ? `${T.gold}08` : 'transparent', transition: 'all 0.3s',
        }}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.svg,.txt,.csv';
          input.onchange = (e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) { setModal('add'); handleFileUpload(f); } };
          input.click();
        }}
      >
        <Icon d={icons.cloud} size={32} color={dragOver ? T.gold : T.textMuted} />
        <p style={{ color: dragOver ? T.gold : T.textMuted, fontSize: 13, marginTop: 8 }}>
          Pretiahnite súbor sem alebo kliknite pre nahratie
        </p>
        <p style={{ color: T.textMuted, fontSize: 11, marginTop: 4 }}>PDF, DOCX, obrázky • AI automaticky analyzuje a zaradí</p>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('all')} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontFamily: font, border: `1px solid ${filter === 'all' ? T.gold : T.border}`, background: filter === 'all' ? `${T.gold}15` : 'transparent', color: filter === 'all' ? T.gold : T.textMuted }}>Všetky ({docs.length})</button>
        {categories.map(c => {
          const count = docs.filter(d => d.category === c).length;
          return (
            <button key={c} onClick={() => setFilter(f => f === c ? 'all' : c)} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontFamily: font, border: `1px solid ${filter === c ? T.gold : T.border}`, background: filter === c ? `${T.gold}15` : 'transparent', color: filter === c ? T.gold : T.textMuted }}>
              {catLabels[c]} ({count})
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {filtered.map(d => (
          <Card key={d.id} hover style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${T.gold}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon d={icons.doc} size={18} color={T.gold} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
                <div style={{ display: 'flex', gap: 8, fontSize: 11, color: T.textMuted, marginTop: 4 }}>
                  <Badge label={catLabels[d.category] || d.category} color={T.gold} />
                  <span>{fmtSize(d.file_size)}</span>
                  {d.client_id && <span>• {getClient(d.client_id)?.company}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                {d.file_url && <a href={d.file_url} target="_blank" rel="noopener noreferrer" style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${T.border}`, color: T.gold, fontSize: 10 }}><Icon d={icons.download} size={12} /></a>}
                <button onClick={() => remove(d.id)} style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${T.border}`, background: 'none', color: T.red, cursor: 'pointer' }}><Icon d={icons.trash} size={12} /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: T.textMuted }}><Icon d={icons.doc} size={48} color={T.textMuted} /><p style={{ marginTop: 16, fontSize: 14 }}>Žiadne dokumenty</p></div>}

      <Modal open={modal !== null} onClose={() => { setModal(null); setAnalysis(null); }} title="Nahrať dokument" width={640}>
        {/* File upload area */}
        {!form.name && (
          <div
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt,.csv';
              input.onchange = (e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) handleFileUpload(f); };
              input.click();
            }}
            style={{ border: `2px dashed ${T.border}`, borderRadius: 12, padding: 40, textAlign: 'center', cursor: 'pointer', marginBottom: 16 }}
          >
            <Icon d={icons.cloud} size={32} color={T.textMuted} />
            <p style={{ color: T.textMuted, fontSize: 13, marginTop: 8 }}>Kliknite pre výber súboru</p>
          </div>
        )}

        {/* Analyzing spinner */}
        {analyzing && (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ width: 32, height: 32, border: `2px solid ${T.border}`, borderTopColor: T.gold, borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: T.gold, fontSize: 13 }}>AI analyzuje dokument...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* AI Analysis results */}
        {analysis && (
          <Card style={{ marginBottom: 16, borderColor: `${T.gold}30`, background: `${T.gold}05` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Icon d={icons.spark} size={16} color={T.gold} />
              <span style={{ fontSize: 12, fontWeight: 600, color: T.gold }}>AI ANALÝZA</span>
            </div>
            <p style={{ fontSize: 13, color: T.textSoft, marginBottom: 10, lineHeight: 1.6 }}>{String(analysis.summary || '')}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              <Badge label={String(analysis.type || 'dokument')} color={T.gold} />
              {analysis.amount ? <Badge label={`${String(analysis.amount)} €`} color={T.green} /> : null}
              {analysis.date ? <Badge label={String(analysis.date)} color={T.blue} /> : null}
              {analysis.client_name ? <Badge label={String(analysis.client_name)} color={T.purple} /> : null}
            </div>
            {Array.isArray(analysis.key_items) && analysis.key_items.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>HLAVNÉ POLOŽKY:</div>
                {(analysis.key_items as string[]).map((item, i) => (
                  <div key={i} style={{ fontSize: 12, color: T.textSoft, padding: '2px 0' }}>• {item}</div>
                ))}
              </div>
            )}
            {Array.isArray(analysis.suggested_actions) && analysis.suggested_actions.length > 0 && (
              <div>
                <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>ODPORÚČANÉ AKCIE:</div>
                {(analysis.suggested_actions as string[]).map((action, i) => (
                  <div key={i} style={{ fontSize: 12, color: T.gold, padding: '2px 0' }}>→ {action}</div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Form fields */}
        {form.name && !analyzing && (
          <>
            <FormField label="Názov *"><Input value={form.name || ''} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Názov dokumentu" /></FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <FormField label="Kategória"><Select value={form.category || 'podklady'} onChange={v => setForm(f => ({ ...f, category: v }))} options={categories.map(c => ({ value: c, label: catLabels[c] }))} /></FormField>
              <FormField label="Veľkosť"><div style={{ padding: '10px 14px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 13, color: T.textSoft }}>{fmtSize(form.file_size || 0)}</div></FormField>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <FormField label="Klient"><Select value={form.client_id || ''} onChange={v => setForm(f => ({ ...f, client_id: v }))} options={[{ value: '', label: '—' }, ...clients.map(c => ({ value: c.id, label: c.company || c.name }))]} /></FormField>
              <FormField label="Projekt"><Select value={form.project_id || ''} onChange={v => setForm(f => ({ ...f, project_id: v }))} options={[{ value: '', label: '—' }, ...projects.map(p => ({ value: p.id, label: p.name }))]} /></FormField>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
              <Btn variant="ghost" onClick={() => { setModal(null); setAnalysis(null); }}>Zrušiť</Btn>
              <Btn onClick={save}><Icon d={icons.check} size={16} /> Uložiť dokument</Btn>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// ANALYTICS VIEW
// ═══════════════════════════════════════════════════════════════
function AnalyticsView({ clients, projects, invoices, quotes, tasks, getClient }: {
  clients: Client[]; projects: Project[]; invoices: Invoice[]; quotes: Quote[]; tasks: Task[];
  getClient: (id: string) => Client | undefined;
}) {
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0);
  const pendingRevenue = invoices.filter(i => ['sent', 'overdue'].includes(i.status)).reduce((s, i) => s + (i.amount || 0), 0);
  const activeProjects = projects.filter(p => !['spusteny', 'pozastaveny'].includes(p.status)).length;
  const quoteConversion = quotes.length > 0 ? Math.round((quotes.filter(q => ['accepted', 'invoiced'].includes(q.status)).length / quotes.length) * 100) : 0;
  const avgInvoice = invoices.length > 0 ? Math.round(invoices.reduce((s, i) => s + (i.amount || 0), 0) / invoices.length) : 0;
  const avgPayDays = (() => {
    const paid = invoices.filter(i => i.status === 'paid' && i.issued && i.due);
    if (!paid.length) return 0;
    return Math.round(paid.reduce((s, i) => s + (new Date(i.due).getTime() - new Date(i.issued).getTime()) / 86400000, 0) / paid.length);
  })();

  // Monthly revenue data (last 12 months)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
  const year = new Date().getFullYear();
  const monthlyRev = months.map((m, i) => {
    const paid = invoices.filter(inv => { const d = new Date(inv.issued); return d.getFullYear() === year && d.getMonth() === i && inv.status === 'paid'; });
    return { month: m, amount: paid.reduce((s, inv) => s + (inv.amount || 0), 0) };
  });
  const maxRev = Math.max(...monthlyRev.map(m => m.amount), 1);

  // Top clients by revenue
  const clientRevenue = clients.map(c => ({
    ...c,
    revenue: invoices.filter(i => i.client_id === c.id && i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0),
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const topRevTotal = clientRevenue.reduce((s, c) => s + (c.revenue || 0), 0) || 1;

  // Project status distribution
  const projStatuses = (Object.keys(statusLabels) as ProjectStatus[]).map(s => ({
    status: s, count: projects.filter(p => p.status === s).length, color: statusColors[s],
  })).filter(s => s.count > 0);
  const projTotal = projects.length || 1;

  // Pipeline funnel
  const pipeline = [
    { label: 'Ponuky odoslané', value: quotes.filter(q => q.status === 'sent').reduce((s, q) => s + (q.amount || 0), 0), color: T.blue },
    { label: 'Akceptované', value: quotes.filter(q => q.status === 'accepted').reduce((s, q) => s + (q.amount || 0), 0), color: T.green },
    { label: 'Fakturované', value: quotes.filter(q => q.status === 'invoiced').reduce((s, q) => s + (q.amount || 0), 0), color: T.gold },
    { label: 'Zaplatené', value: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0), color: T.green },
  ];
  const maxPipeline = Math.max(...pipeline.map(p => p.value), 1);

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: fontHeading, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400, marginBottom: 4 }}>Analytika</h1>
        <p style={{ color: T.textMuted, fontSize: 14 }}>Prehľad výkonnosti biznisu</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Príjem (YTD)', value: fmt(totalRevenue), color: T.green },
          { label: 'Čakajúce platby', value: fmt(pendingRevenue), color: T.orange },
          { label: 'Aktívne projekty', value: String(activeProjects), color: T.blue },
          { label: 'Konverzia ponúk', value: `${quoteConversion}%`, color: T.purple },
          { label: 'Priem. faktúra', value: fmt(avgInvoice), color: T.gold },
          { label: 'Priem. splatnosť', value: `${avgPayDays} dní`, color: T.textSoft },
        ].map((kpi, i) => (
          <Card key={i} style={{ padding: 16 }}>
            <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{kpi.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 18, marginBottom: 24 }}>
        {/* Revenue Chart */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.gold, marginBottom: 16 }}>Mesačné príjmy {year}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 180 }}>
            {monthlyRev.map((m, i) => {
              const h = m.amount > 0 ? Math.max(8, (m.amount / maxRev) * 160) : 4;
              const hovered = hoveredBar === i;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                  onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                  {hovered && m.amount > 0 && <div style={{ fontSize: 10, color: T.gold, fontWeight: 600, whiteSpace: 'nowrap' }}>{fmt(m.amount)}</div>}
                  <div style={{
                    width: '100%', height: h, borderRadius: 4,
                    background: hovered ? `linear-gradient(180deg, ${T.goldLight}, ${T.gold})` : `linear-gradient(180deg, ${T.gold}60, ${T.goldDark}40)`,
                    transition: 'all 0.2s', cursor: 'pointer',
                  }} />
                  <div style={{ fontSize: 9, color: hovered ? T.gold : T.textMuted }}>{m.month}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Top Clients */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.gold, marginBottom: 16 }}>Top klienti podľa obratu</div>
          {clientRevenue.map((c, i) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: `${T.gold}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: T.gold }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{c.company || c.name}</div>
                <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(c.revenue / topRevTotal) * 100}%`, background: T.gold, borderRadius: 2 }} />
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.gold, whiteSpace: 'nowrap' }}>{fmt(c.revenue)}</div>
            </div>
          ))}
          {clientRevenue.length === 0 && <p style={{ fontSize: 12, color: T.textMuted }}>Zatiaľ žiadne dáta</p>}
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
        {/* Project Status Donut */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.gold, marginBottom: 16 }}>Projekty podľa stavu</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <svg width={120} height={120} viewBox="0 0 120 120">
              {(() => {
                let offset = 0;
                return projStatuses.map(s => {
                  const pct = s.count / projTotal;
                  const dashArray = `${pct * 314} ${314 - pct * 314}`;
                  const el = <circle key={s.status} cx={60} cy={60} r={50} fill="none" stroke={s.color} strokeWidth={16}
                    strokeDasharray={dashArray} strokeDashoffset={-offset * 314} transform="rotate(-90 60 60)" />;
                  offset += pct;
                  return el;
                });
              })()}
              <text x={60} y={56} textAnchor="middle" fill={T.text} fontSize={24} fontWeight={700}>{projects.length}</text>
              <text x={60} y={72} textAnchor="middle" fill={T.textMuted} fontSize={10}>projektov</text>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {projStatuses.map(s => (
                <div key={s.status} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
                  <span style={{ fontSize: 12, color: T.textSoft }}>{statusLabels[s.status]}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: s.color, marginLeft: 'auto' }}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Pipeline Funnel */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.gold, marginBottom: 16 }}>Pipeline hodnota</div>
          {pipeline.map((p, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: T.textSoft }}>{p.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: p.color }}>{fmt(p.value)}</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }}>
                <div style={{ height: '100%', width: `${Math.max(2, (p.value / maxPipeline) * 100)}%`, background: p.color, borderRadius: 4, transition: 'width 0.5s' }} />
              </div>
            </div>
          ))}
        </Card>

        {/* Task Summary */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.gold, marginBottom: 16 }}>Úlohy</div>
          {(['nova', 'v_procese', 'hotova', 'zrusena'] as TaskStatus[]).map(s => {
            const count = tasks.filter(t => t.status === s).length;
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: taskStatusColors[s] }} />
                <span style={{ flex: 1, fontSize: 13, color: T.textSoft }}>{taskStatusLabels[s]}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: taskStatusColors[s] }}>{count}</span>
              </div>
            );
          })}
        </Card>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// HELP VIEW — Návod na používanie
// ═══════════════════════════════════════════════════════════════
function HelpView({ setView }: { setView: (v: View) => void }) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      key: 'dashboard',
      icon: icons.dashboard,
      color: T.gold,
      title: 'Dashboard',
      subtitle: 'Prehľad všetkého na jednom mieste',
      description: 'Dashboard ti dáva okamžitý prehľad o stave tvojho biznisu. Vidíš počet klientov, aktívnych projektov, nevyplatených faktúr a celkový obrat. Grafy znázorňujú cash flow a rozdelenie príjmov. Sekcia "Nadchádzajúce" upozorní na blížiace sa deadliny a nezaplatené faktúry.',
      tips: ['Klikni na farebné KPI karty pre rýchle filtrovanie', 'Graf cash flow zobrazuje posledných 6 mesiacov', 'Upozornenia zobrazujú faktúry po splatnosti a blížiace sa deadliny'],
    },
    {
      key: 'clients',
      icon: icons.clients,
      color: T.purple,
      title: 'Klienti',
      subtitle: 'CRM — správa kontaktov a klientov',
      description: 'Tu eviduješ všetkých svojich klientov. Pre každého klienta môžeš uložiť meno, firmu, email, telefón, poznámky a štítky (napr. "VIP", "Web", "Logo"). Klienti sú prepojení s projektmi a faktúrami — všetko na jednom mieste.',
      tips: ['Štítky (tagy) pomáhajú filtrovať klientov podľa typu služby', 'Z karty klienta vidíš všetky jeho projekty a faktúry', 'Kliknutím na "+" pridáš nového klienta'],
    },
    {
      key: 'projects',
      icon: icons.projects,
      color: T.blue,
      title: 'Projekty',
      subtitle: 'Správa projektov s Kanban boardom',
      description: 'Projekty ti umožňujú sledovať postup práce pre každého klienta. Každý projekt má stav (Konzultácia → Návrh → Vývoj → Testovanie → Spustený), rozpočet, minuté náklady a percento dokončenia. Môžeš prepínať medzi zoznamovým a Kanban zobrazením.',
      tips: ['Kanban board: ťahaj karty projektov medzi stĺpcami na zmenu stavu', 'Stav "Konzultácia" = prvá komunikácia, "Návrh" = zaslal si ponuku', 'Sleduj minuté náklady vs. rozpočet — pri prekročení sa zobrazí červené upozornenie'],
    },
    {
      key: 'invoices',
      icon: icons.invoices,
      color: T.green,
      title: 'Faktúry',
      subtitle: 'Vystavovanie a sledovanie faktúr',
      description: 'Vystavuj faktúry priamo z appky a sleduj ich stav (Draft → Odoslaná → Zaplatená / Po splatnosti). Každá faktúra je prepojená s klientom a projektom. Systém automaticky označí faktúry po splatnosti červenou farbou.',
      tips: ['Draft = pracovná verzia, ešte nie odoslaná klientovi', '"PDF" tlačidlo vygeneruje faktúru ako PDF dokument', 'Faktúry po splatnosti sa zobrazujú červenou — pošli upomienku cez Emaily'],
    },
    {
      key: 'tasks',
      icon: icons.task,
      color: T.orange,
      title: 'Úlohy',
      subtitle: 'To-do zoznam prepojený s projektmi',
      description: 'Úlohy ti pomáhajú nestratiť prehľad o tom, čo treba urobiť pre každý projekt. Každá úloha má prioritu (Nízka / Stredná / Vysoká / Urgentná), stav (Nová / V procese / Hotová) a deadline. Môžeš ich filtrovať podľa priority.',
      tips: ['Urgentné úlohy sú zvýraznené červenou — riešenie ihneď!', 'Úlohy s termínom v minulosti sú automaticky zvýraznené', 'Klikni na úlohu pre rýchlu zmenu stavu'],
    },
    {
      key: 'quotes',
      icon: icons.quote,
      color: T.blue,
      title: 'Cenové ponuky',
      subtitle: 'Tvorba a sledovanie cenových ponúk',
      description: 'Vytváraj profesionálne cenové ponuky pre klientov. Každá ponuka má položky s popisom, množstvom a cenou. Stav ponuky ti hovorí kde sa nachádza: Draft → Odoslaná → Prijatá / Odmietnutá. Schválenú ponuku môžeš jedným klikom prekonvertovať na faktúru.',
      tips: ['Draft = pripravuješ, Odoslaná = klient ju má', 'Klik "Vytvoriť faktúru" z akceptovanej ponuky = automatická faktúra', 'Ponuka má dátum platnosti — sleduj aby nezastarala'],
    },
    {
      key: 'calendar',
      icon: icons.calendar,
      color: T.purple,
      title: 'Kalendár',
      subtitle: 'Stretnutia, deadliny a follow-upy',
      description: 'Kalendár zobrazuje všetky dôležité udalosti — stretnutia so klientmi, deadliny projektov a follow-upy. Môžeš prepínať medzi mesačným a týždenným pohľadom. Udalosti sú farebne rozlíšené podľa typu.',
      tips: ['Modrá = stretnutie, červená = deadline, žltá = follow-up', 'Klikni na deň pre pridanie novej udalosti', 'Follow-up = pripomienka pre seba napr. "zavolať klientovi"'],
    },
    {
      key: 'documents',
      icon: icons.doc,
      color: T.gold,
      title: 'Dokumenty',
      subtitle: 'Zmluvy, podklady a súbory',
      description: 'Sekcia dokumentov slúži na evidenciu súborov, zmlúv a podkladov prepojených s projektmi a klientmi. Môžeš nahrávať súbory, pridávať poznámky a organizovať dokumenty podľa klienta alebo projektu.',
      tips: ['Prepoj každý dokument s konkrétnym klientom a projektom', 'Typy: Zmluva, Faktúra, Ponuka, Podklady, Iné', 'AI dokáže analyzovať obsah nahratých dokumentov'],
    },
    {
      key: 'analytics',
      icon: icons.trend,
      color: T.green,
      title: 'Analytika',
      subtitle: 'Prehľady, grafy a KPI',
      description: 'Analytika ti dáva detailný pohľad na výkonnosť tvojho biznisu. Vidíš príjmy za jednotlivé mesiace, zoznam top klientov, stav projektového pipeline a štatistiky úloh. Pomáha ti rozhodovať sa na základe dát.',
      tips: ['Mesačné príjmy = iba zaplatené faktúry', 'Pipeline zobrazuje celkovú hodnotu aktívnych projektov', 'Top klienti = zoradení podľa celkovej hodnoty faktúr'],
    },
    {
      key: 'email',
      icon: icons.mail,
      color: T.blue,
      title: 'Emaily',
      subtitle: 'Odosielanie emailov klientom',
      description: 'Z tejto sekcie môžeš posielať emaily priamo klientom — upomienky na nezaplatené faktúry, follow-upy po stretnutiach alebo vlastné správy. AI Asistent ti pomôže napísať profesionálny email.',
      tips: ['Emaily sa odosielajú cez Resend API (nakonfigurované v nastaveniach)', 'Tlačidlo "Upomienka" automaticky vygeneruje text pre oneskorené platby', 'História odoslaných emailov sa zobrazuje v zozname'],
    },
    {
      key: 'ai',
      icon: icons.ai,
      color: T.gold,
      title: 'AI Asistent',
      subtitle: 'Claude AI pre tvoj biznis',
      description: 'AI Asistent pozná tvoje klientov, projekty a faktúry. Môžeš sa ho pýtať čokoľvek — "Napíš email Zolimu ohľadom platby", "Aký je stav projektu Euphoria?", "Vygeneruj cenový návrh pre web". Asistent odpovedá v slovenčine.',
      tips: ['AI má prístup k tvojim dátam — hovorí tebou o tvojich klientoch', 'Prompt: "Napíš upomienku na faktúru FA-001" → profesionálny email', 'Prompt: "Aké projekty mi končia tento mesiac?" → okamžitý prehľad'],
    },
  ];

  const workflow = [
    { step: 1, label: 'Pridaj klienta', desc: 'Klienti → +', color: T.purple, icon: icons.clients },
    { step: 2, label: 'Vytvor projekt', desc: 'Projekty → +', color: T.blue, icon: icons.projects },
    { step: 3, label: 'Pošli ponuku', desc: 'Ponuky → +', color: T.orange, icon: icons.quote },
    { step: 4, label: 'Vystav faktúru', desc: 'Faktúry → +', color: T.green, icon: icons.invoices },
  ];

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${T.goldLight}, ${T.gold})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon d={icons.help} size={20} color={T.bg} />
          </div>
          <div>
            <h1 style={{ fontFamily: fontHeading, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400, marginBottom: 2 }}>Návod & Pomoc</h1>
            <p style={{ fontSize: 13, color: T.textMuted }}>Ako používať Vassweb Business App</p>
          </div>
        </div>
      </div>

      {/* Workflow — základný postup */}
      <Card style={{ marginBottom: 24, background: `linear-gradient(135deg, ${T.bgCard}, rgba(212,168,67,0.03))` }}>
        <div style={{ fontSize: 12, color: T.gold, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
          ⚡ Základný pracovný postup
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {workflow.map((w, i) => (
            <div key={w.step} style={{ display: 'flex', alignItems: 'center', gap: i < workflow.length - 1 ? 0 : 0 }}>
              <div
                onClick={() => setView(w.step === 1 ? 'clients' : w.step === 2 ? 'projects' : w.step === 3 ? 'quotes' : 'invoices')}
                style={{ flex: 1, background: T.bg, border: `1px solid ${w.color}33`, borderRadius: 12, padding: '14px 12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = w.color; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${w.color}33`; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${w.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                  <Icon d={w.icon} size={18} color={w.color} />
                </div>
                <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 2 }}>Krok {w.step}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: w.color }}>{w.label}</div>
                <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>{w.desc}</div>
              </div>
              {i < workflow.length - 1 && (
                <div style={{ color: T.textMuted, fontSize: 18, padding: '0 4px', flexShrink: 0 }}>→</div>
              )}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: T.textMuted, marginTop: 14, lineHeight: 1.6 }}>
          💡 Každá sekcia je prepojená — keď vytvoríš projekt pre klienta, automaticky ho vidíš vo faktúrach, úlohách aj analytike.
        </p>
      </Card>

      {/* Sekcie */}
      <div style={{ fontSize: 12, color: T.gold, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
        Prehľad sekcií — klikni pre detail
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14, marginBottom: 32 }}>
        {sections.map(s => (
          <div key={s.key}>
            <Card
              hover
              onClick={() => setActiveSection(activeSection === s.key ? null : s.key)}
              style={{ border: activeSection === s.key ? `1px solid ${s.color}` : undefined, transition: 'all 0.2s' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon d={s.icon} size={20} color={s.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: s.color }}>{s.title}</div>
                    <div style={{ color: T.textMuted, fontSize: 12 }}>{activeSection === s.key ? '▲' : '▼'}</div>
                  </div>
                  <div style={{ fontSize: 12, color: T.textMuted }}>{s.subtitle}</div>
                </div>
              </div>

              {activeSection === s.key && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
                  <p style={{ fontSize: 13, color: T.textSoft, lineHeight: 1.7, marginBottom: 14 }}>{s.description}</p>
                  <div style={{ fontSize: 11, color: T.gold, fontWeight: 600, letterSpacing: '0.06em', marginBottom: 8 }}>TIPY:</div>
                  {s.tips.map((tip, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                      <div style={{ color: s.color, flexShrink: 0, marginTop: 1 }}>✓</div>
                      <div style={{ fontSize: 12, color: T.textSoft, lineHeight: 1.5 }}>{tip}</div>
                    </div>
                  ))}
                  <div style={{ marginTop: 14 }}>
                    <Btn onClick={() => setView(s.key as View)} variant="ghost" style={{ fontSize: 12, padding: '8px 14px' }}>
                      Otvoriť sekciu →
                    </Btn>
                  </div>
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>

      {/* FAQ / Časté otázky */}
      <div style={{ fontSize: 12, color: T.gold, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
        Časté otázky
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
        {[
          { q: 'Ako pridám nového klienta?', a: 'Choď do sekcie Klienti a klikni na tlačidlo "+ Nový klient" vpravo hore. Vyplň meno, firmu, email a telefón.' },
          { q: 'Ako zmením stav projektu?', a: 'V Projektoch klikni na projekt a zmeň stav v rolovacom menu. V Kanban zobrazení môžeš ťahať karty medzi stĺpcami.' },
          { q: 'Ako vygenerujem PDF faktúru?', a: 'Choď do Faktúry, nájdi faktúru a klikni na ikonu PDF. Faktúra sa automaticky vygeneruje a stiahne.' },
          { q: 'Prečo sa mi nezobrazujú dáta?', a: 'Skontroluj internetové pripojenie. Ak je appka offline, dáta sa načítajú zo zálohy. Po obnovení spojenia sa synchronizujú.' },
          { q: 'Ako funguje AI Asistent?', a: 'AI Asistent pozná tvojich klientov a projekty. Pýtaj sa ho v slovenčine — napíše emaily, zhrnie stav projektov, vygeneruje texty.' },
          { q: 'Čo sú Úlohy (Tasks)?', a: 'Úlohy sú to-do položky prepojené s konkrétnym klientom a projektom. Pomáhajú ti nestratiť prehľad čo treba urobiť.' },
        ].map((faq, i) => (
          <Card key={i} style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 6 }}>❓ {faq.q}</div>
            <div style={{ fontSize: 13, color: T.textSoft, lineHeight: 1.6 }}>{faq.a}</div>
          </Card>
        ))}
      </div>

      {/* Contact / Version */}
      <Card style={{ background: `linear-gradient(135deg, ${T.bgCard}, rgba(212,168,67,0.04))`, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🤝</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: T.gold, marginBottom: 6 }}>Potrebuješ pomoc?</div>
        <p style={{ fontSize: 13, color: T.textSoft, lineHeight: 1.6, maxWidth: 400, margin: '0 auto 16px' }}>
          Appka je vyvíjaná špeciálne pre Vassweb. Ak niečo nefunguje alebo chceš novú funkciu, daj vedieť.
        </p>
        <div style={{ fontSize: 11, color: T.textMuted }}>Vassweb Business App v2.0 · © 2026 Vassweb s.r.o.</div>
      </Card>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// EMAIL VIEW
// ═══════════════════════════════════════════════════════════════
function EmailView({ clients, getClient }: { clients: Client[]; getClient: (id: string) => Client | undefined }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<Client[]>([]);
  const [sentEmails, setSentEmails] = useState<{ to: string; subject: string; time: string }[]>([]);
  const [template, setTemplate] = useState('');

  const templates: Record<string, { subject: string; body: string }> = {
    ponuka: {
      subject: 'Cenová ponuka — Vassweb',
      body: `Dobrý deň [MENO],\n\npripravili sme pre Vás cenovú ponuku na [PROJEKT]. Nižšie nájdete detailný rozpis.\n\n[POLOŽKY]\n\nCelková cena: [SUMA] € bez DPH\n\nPonuka je platná 30 dní. V prípade otázok nás neváhajte kontaktovať.\n\nS pozdravom,\nRichard Vass\nVassweb | vassweb.sk\n+421 918 668 728`,
    },
    faktura: {
      subject: 'Faktúra [ČÍSLO] — Vassweb',
      body: `Dobrý deň [MENO],\n\nv prílohe zasielame faktúru č. [ČÍSLO] na sumu [SUMA] €.\n\nSplatnosť: [DÁTUM]\nIBAN: SK11 0900 0000 0052 3252 7162\nVS: [VS]\n\nĎakujeme za spoluprácu.\n\nS pozdravom,\nRichard Vass\nVassweb`,
    },
    followup: {
      subject: 'Dobrý deň — máte otázky k našej ponuke?',
      body: `Dobrý deň [MENO],\n\nradi by sme sa opýtali, či ste mali čas pozrieť si našu cenovú ponuku, ktorú sme Vám zaslali minulý týždeň.\n\nAk máte akékoľvek otázky alebo by ste chceli niečo upraviť, neváhajte nás kontaktovať. Radi Vám pomôžeme.\n\nS pozdravom,\nRichard Vass\nVassweb`,
    },
    dakujem: {
      subject: 'Ďakujeme za spoluprácu — Vassweb',
      body: `Dobrý deň [MENO],\n\nchceli by sme Vám poďakovať za úspešnú spoluprácu na projekte [PROJEKT].\n\nBolo nám potešením pracovať s Vami a tešíme sa na ďalšiu spoluprácu. Ak budete potrebovať akékoľvek úpravy, údržbu alebo nový projekt, neváhajte nás kontaktovať.\n\nS pozdravom,\nRichard Vass\nVassweb`,
    },
    welcome: {
      subject: 'Vitajte vo Vassweb — začíname spoluprácu!',
      body: `Dobrý deň [MENO],\n\nveľmi nás teší, že ste sa rozhodli pre spoluprácu s Vassweb.\n\nV najbližších dňoch Vám zašleme podrobný plán projektu a harmonogram. Medzičasom nás neváhajte kontaktovať s akýmikoľvek otázkami.\n\nKontakt:\nRichard Vass\nrichard.vass@vassco.sk\n+421 918 668 728\n\nTešíme sa na spoluprácu!`,
    },
    upomienka: {
      subject: 'Upomienka — nezaplatená faktúra [ČÍSLO]',
      body: `Dobrý deň [MENO],\n\ndovoľujeme si Vás zdvorilo upozorniť, že faktúra č. [ČÍSLO] na sumu [SUMA] € je po splatnosti.\n\nPôvodná splatnosť: [DÁTUM]\nIBAN: SK11 0900 0000 0052 3252 7162\nVariabilný symbol: [VS]\n\nAk ste medzičasom platbu uskutočnili, prosím ignorujte túto správu. V opačnom prípade Vás prosíme o uhradenie čo najskôr.\n\nĎakujeme za porozumenie.\n\nS pozdravom,\nRichard Vass\nVassweb | vassweb.sk`,
    },
    status_update: {
      subject: 'Aktualizácia projektu [PROJEKT] — Vassweb',
      body: `Dobrý deň [MENO],\n\nchceli by sme Vás informovať o aktuálnom stave projektu [PROJEKT].\n\nAktuálny stav: [STAV]\nPostup: [PROGRESS]%\nPredpokladaný deadline: [DEADLINE]\n\nAk máte otázky alebo pripomienky, neváhajte nás kontaktovať.\n\nS pozdravom,\nRichard Vass\nVassweb`,
    },
  };

  const applyTemplate = (key: string) => {
    if (templates[key]) {
      setSubject(templates[key].subject);
      setBody(templates[key].body);
      setTemplate(key);
    }
  };

  const handleToChange = (val: string) => {
    setTo(val);
    if (val.length > 1) {
      const matches = clients.filter(c => c.name.toLowerCase().includes(val.toLowerCase()) || c.email.toLowerCase().includes(val.toLowerCase()) || c.company.toLowerCase().includes(val.toLowerCase()));
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const selectClient = (c: Client) => { setTo(c.email); setSuggestions([]); setBody(b => b.replace(/\[MENO\]/g, c.name)); setSubject(s => s.replace(/\[MENO\]/g, c.name)); };

  const sendEmail = async () => {
    if (!to || !subject || !body) { setError('Vyplňte všetky polia.'); return; }
    setSending(true); setError('');
    try {
      const htmlBody = `<div style="font-family:system-ui;max-width:600px;margin:0 auto;background:#0a0908;color:#fff;padding:32px;border-radius:8px;">
        <div style="border-bottom:1px solid rgba(212,168,67,0.15);padding-bottom:16px;margin-bottom:24px;">
          <div style="color:#d4a843;font-size:18px;font-weight:700;letter-spacing:0.1em;">VASSWEB</div>
        </div>
        <div style="white-space:pre-wrap;line-height:1.7;font-size:14px;color:rgba(255,255,255,0.8);">${body}</div>
        <div style="border-top:1px solid rgba(212,168,67,0.15);padding-top:16px;margin-top:32px;font-size:12px;color:rgba(255,255,255,0.3);">
          VVD s. r. o. (Vassweb) | IČO: 56921021 | vassweb.sk
        </div>
      </div>`;
      const res = await fetch('/api/email/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, html: htmlBody, replyTo: 'richard.vass@vassco.sk' }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true); setSentEmails(prev => [{ to, subject, time: now() }, ...prev]);
        setTimeout(() => { setSent(false); setTo(''); setSubject(''); setBody(''); setTemplate(''); }, 3000);
      } else {
        setError(data.error || 'Chyba pri odosielaní.');
      }
    } catch { setError('Nepodarilo sa odoslať email.'); }
    setSending(false);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontFamily: fontHeading, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400 }}>Emaily</h1>
            <InfoTip title="Emaily — šablóny a odosielanie">
              <p style={{ marginBottom: 10 }}>K dispozícii máš 7 emailových šablón:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                {[['Ponuka', 'Cenová ponuka s detailmi'], ['Faktúra', 'Odoslanie faktúry klientovi'], ['Upomienka', 'Nezaplatená faktúra po splatnosti'], ['Follow-up', 'Pripomienka k neodpovedanej ponuke'], ['Stav projektu', 'Aktualizácia pre klienta'], ['Ďakujem', 'Poďakovanie po úspešnom projekte'], ['Welcome', 'Privítanie nového klienta']].map(([s, d]) => (
                  <div key={s} style={{ display: 'flex', gap: 8 }}><strong style={{ color: T.gold, minWidth: 100, fontSize: 12 }}>{s}:</strong><span style={{ color: T.textMuted, fontSize: 12 }}>{d}</span></div>
                ))}
              </div>
              <p style={{ color: T.textMuted, fontSize: 12 }}>Placeholder [MENO] sa automaticky nahradí keď vyberiš klienta.</p>
            </InfoTip>
          </div>
          <p style={{ color: T.textMuted, fontSize: 14 }}>Komunikácia s klientmi</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 18 }}>
        {/* Compose */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.gold, marginBottom: 14 }}>Nový email</div>

          {/* Templates */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {[
              { key: 'ponuka', label: 'Ponuka' }, { key: 'faktura', label: 'Faktúra' },
              { key: 'upomienka', label: 'Upomienka' }, { key: 'followup', label: 'Follow-up' },
              { key: 'status_update', label: 'Stav projektu' }, { key: 'dakujem', label: 'Ďakujem' },
              { key: 'welcome', label: 'Welcome' },
            ].map(t => (
              <button key={t.key} onClick={() => applyTemplate(t.key)}
                style={{ padding: '5px 12px', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontFamily: font, border: `1px solid ${template === t.key ? T.gold : T.border}`, background: template === t.key ? `${T.gold}15` : 'transparent', color: template === t.key ? T.gold : T.textMuted }}>
                {t.label}
              </button>
            ))}
          </div>

          <FormField label="Komu">
            <div style={{ position: 'relative' }}>
              <Input value={to} onChange={handleToChange} placeholder="email@firma.sk alebo meno klienta" type="email" />
              {suggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, marginTop: 4, overflow: 'hidden' }}>
                  {suggestions.map(c => (
                    <div key={c.id} onClick={() => selectClient(c)} style={{ padding: '10px 14px', cursor: 'pointer', fontSize: 13, borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: T.textSoft }}>{c.name} <span style={{ color: T.textMuted }}>({c.company})</span></span>
                      <span style={{ color: T.gold, fontSize: 11 }}>{c.email}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormField>
          <FormField label="Predmet"><Input value={subject} onChange={setSubject} placeholder="Predmet emailu" /></FormField>
          <FormField label="Text"><TextArea value={body} onChange={setBody} placeholder="Text emailu..." rows={10} /></FormField>

          {error && <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(248,113,113,0.1)', color: T.red, fontSize: 12, marginBottom: 12 }}>{error}</div>}
          {sent && <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(74,222,128,0.1)', color: T.green, fontSize: 12, marginBottom: 12 }}>Email odoslaný!</div>}

          <Btn onClick={sendEmail} disabled={sending}>
            <Icon d={icons.send} size={16} /> {sending ? 'Odosielam...' : 'Odoslať email'}
          </Btn>
        </Card>

        {/* Sent Emails + Quick Send */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Quick Send to Clients */}
          <Card>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.gold, marginBottom: 14 }}>Rýchly email klientovi</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {clients.slice(0, 8).map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, border: `1px solid ${T.border}` }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: T.textMuted }}>{c.email}</div>
                  </div>
                  <button onClick={() => { setTo(c.email); setBody(b => b || `Dobrý deň ${c.name},\n\n`); }}
                    style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: T.gold, fontSize: 11, fontFamily: font }}>
                    <Icon d={icons.mail} size={12} />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Sent Log */}
          {sentEmails.length > 0 && (
            <Card>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.gold, marginBottom: 14 }}>Odoslané ({sentEmails.length})</div>
              {sentEmails.map((e, i) => (
                <div key={i} style={{ padding: '8px 0', borderBottom: `1px solid ${T.border}`, fontSize: 12 }}>
                  <div style={{ color: T.textSoft }}>{e.subject}</div>
                  <div style={{ color: T.textMuted, fontSize: 11 }}>{e.to} • {new Date(e.time).toLocaleTimeString('sk-SK')}</div>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
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
  const [selectedModel, setSelectedModel] = useState<string>('claude-sonnet-4-20250514');

  const modelOptions = [
    { value: 'claude-haiku-4-5-20251001', label: 'Haiku', desc: 'Rýchly · jednoduchšie úlohy', color: T.green },
    { value: 'claude-sonnet-4-20250514', label: 'Sonnet', desc: 'Vyvážený · odporúčaný', color: T.gold },
    { value: 'claude-opus-4-20250514', label: 'Opus', desc: 'Najsilnejší · zložité úlohy', color: T.purple },
  ];
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
      const totalRev = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0);
      const pending = invoices.filter(i => ['sent', 'overdue'].includes(i.status)).reduce((s, i) => s + (i.amount || 0), 0);
      const overdue = invoices.filter(i => i.status === 'overdue').length;

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          model: selectedModel,
          context: {
            clientCount: clients.length,
            activeProjects: projects.filter(p => !['spusteny', 'pozastaveny'].includes(p.status)).length,
            totalRevenue: totalRev,
            pendingRevenue: pending,
            overdueCount: overdue,
          },
        }),
      });

      const data = await res.json();
      if (data.message?.content) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message.content, timestamp: now() }]);
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
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: fontHeading, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400, marginBottom: 4 }}>AI Asistent</h1>
            <p style={{ color: T.textMuted, fontSize: 14 }}>Váš inteligentný business partner — pozná vaše projekty, klientov a faktúry</p>
          </div>
          {/* Model selector */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: T.textMuted, letterSpacing: '0.05em' }}>MODEL:</span>
            {modelOptions.map(m => (
              <button
                key={m.value}
                onClick={() => setSelectedModel(m.value)}
                title={m.desc}
                style={{
                  padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  fontFamily: font, border: `1px solid ${selectedModel === m.value ? m.color : T.border}`,
                  background: selectedModel === m.value ? `${m.color}18` : 'transparent',
                  color: selectedModel === m.value ? m.color : T.textMuted,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (selectedModel !== m.value) { (e.currentTarget as HTMLButtonElement).style.borderColor = m.color; (e.currentTarget as HTMLButtonElement).style.color = m.color; } }}
                onMouseLeave={e => { if (selectedModel !== m.value) { (e.currentTarget as HTMLButtonElement).style.borderColor = T.border; (e.currentTarget as HTMLButtonElement).style.color = T.textMuted; } }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        {/* Model description */}
        <div style={{ marginTop: 8, fontSize: 11, color: T.textMuted }}>
          {modelOptions.find(m => m.value === selectedModel)?.desc} — {
            selectedModel.includes('haiku') ? 'ideálny pre rýchle otázky a jednoduché texty' :
            selectedModel.includes('opus') ? 'najlepší pre komplexnú analýzu, zložité úlohy a dlhé dokumenty' :
            'ideálny pomer výkonu a rýchlosti pre každodenné úlohy'
          }
        </div>
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
// VASS & CO. — FACILITY MANAGEMENT VIEWS
// ═══════════════════════════════════════════════════════════════

function VCDashboardView() {
  const T_local = T;
  const stats = [
    { label: 'Aktívne budovy', value: '12', color: T_local.gold },
    { label: 'SLA zmluvy', value: '8', color: T_local.green },
    { label: 'Airbnb objekty', value: '4', color: T_local.blue },
    { label: 'Tento mesiac', value: '€4,250', color: T_local.purple },
  ];
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 300, fontFamily: fontHeading, marginBottom: 4 }}>
          Vass <span style={{ color: T_local.gold, fontWeight: 600 }}>&amp; Co.</span>
        </h1>
        <p style={{ color: T_local.textMuted, fontSize: 14 }}>Facility Management Dashboard</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: T_local.bgCard, border: `1px solid ${T_local.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 12, color: T_local.textMuted, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: T_local.bgCard, border: `1px solid ${T_local.border}`, borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: T_local.gold, marginBottom: 16 }}>Najbližšie úlohy</h3>
          {['Kontrola HVAC — Budova A', 'Tepovanie — Airbnb Staré Mesto', 'SLA report — klient Novák', 'Revízia hasiacich prístrojov'].map((t, i) => (
            <div key={i} style={{ padding: '10px 0', borderBottom: i < 3 ? `1px solid ${T_local.border}` : 'none', color: T_local.textSoft, fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{t}</span>
              <span style={{ fontSize: 11, color: T_local.textMuted }}>{['Dnes', 'Zajtra', 'Piatok', 'Budúci týždeň'][i]}</span>
            </div>
          ))}
        </div>
        <div style={{ background: T_local.bgCard, border: `1px solid ${T_local.border}`, borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: T_local.gold, marginBottom: 16 }}>Aktívne Airbnb</h3>
          {[
            { name: 'Apartmán Staré Mesto', status: 'Obsadený', dates: '18.3 – 22.3', color: T_local.green },
            { name: 'Studio Ružinov', status: 'Voľný', dates: 'od 20.3', color: T_local.blue },
            { name: 'Loft Petržalka', status: 'Upratovanie', dates: 'check-in 21.3', color: T_local.orange },
            { name: 'Apartmán Nové Mesto', status: 'Obsadený', dates: '15.3 – 25.3', color: T_local.green },
          ].map((a, i) => (
            <div key={i} style={{ padding: '10px 0', borderBottom: i < 3 ? `1px solid ${T_local.border}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, color: T_local.textSoft }}>{a.name}</div>
                <div style={{ fontSize: 11, color: T_local.textMuted }}>{a.dates}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: a.color, background: `${a.color}15`, padding: '3px 10px', borderRadius: 8 }}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VCBudovyView() {
  const budovy = [
    { name: 'Admin. budova A — Ružinov', type: 'Kancelária', plocha: '450 m²', klient: 'TechCorp s.r.o.', sla: 'Premium', status: 'Aktívna' },
    { name: 'Bytový dom — Staré Mesto', type: 'Rezidenčný', plocha: '1,200 m²', klient: 'Správa BD', sla: 'Štandard', status: 'Aktívna' },
    { name: 'Obchodný priestor — Nivy', type: 'Retail', plocha: '280 m²', klient: 'FreshMarket', sla: 'Premium', status: 'Aktívna' },
    { name: 'Kancelársky komplex B', type: 'Kancelária', plocha: '800 m²', klient: 'DataSoft a.s.', sla: 'Enterprise', status: 'Aktívna' },
    { name: 'Apartmán Staré Mesto', type: 'Airbnb', plocha: '65 m²', klient: '—', sla: '—', status: 'Prenajatý' },
    { name: 'Studio Ružinov', type: 'Airbnb', plocha: '42 m²', klient: '—', sla: '—', status: 'Voľný' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 300, fontFamily: fontHeading }}>Budovy <span style={{ color: T.gold, fontWeight: 600 }}>&amp; Objekty</span></h1>
          <p style={{ color: T.textMuted, fontSize: 13, marginTop: 4 }}>{budovy.length} objektov v správe</p>
        </div>
        <button style={{ padding: '10px 20px', borderRadius: 10, background: `linear-gradient(135deg, ${T.goldLight}, ${T.gold}, ${T.goldDark})`, color: T.bg, fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer' }}>+ Pridať objekt</button>
      </div>
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1fr 1fr', padding: '12px 20px', borderBottom: `1px solid ${T.border}`, fontSize: 11, color: T.textMuted, fontWeight: 600, letterSpacing: '0.05em' }}>
          <span>OBJEKT</span><span>TYP</span><span>PLOCHA</span><span>KLIENT</span><span>SLA</span><span>STATUS</span>
        </div>
        {budovy.map((b, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1fr 1fr', padding: '14px 20px', borderBottom: i < budovy.length - 1 ? `1px solid ${T.border}` : 'none', fontSize: 13, alignItems: 'center', cursor: 'pointer', transition: 'background 0.15s' }} onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <span style={{ fontWeight: 500, color: T.text }}>{b.name}</span>
            <span style={{ color: T.textMuted }}>{b.type}</span>
            <span style={{ color: T.textMuted }}>{b.plocha}</span>
            <span style={{ color: T.textSoft }}>{b.klient}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: b.sla === 'Premium' ? T.gold : b.sla === 'Enterprise' ? T.purple : T.textMuted }}>{b.sla}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: b.status === 'Aktívna' ? T.green : b.status === 'Prenajatý' ? T.blue : T.orange, background: `${b.status === 'Aktívna' ? T.green : b.status === 'Prenajatý' ? T.blue : T.orange}15`, padding: '3px 10px', borderRadius: 8, textAlign: 'center' }}>{b.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VCSluzbyView() {
  const sluzby = [
    { name: 'Upratovanie kancelárií', popis: 'Denné/týždenné upratovanie komerčných priestorov', cena: 'od €3.50/m²', aktivne: 8 },
    { name: 'Správa budov', popis: 'Kompletná technická správa a údržba', cena: 'od €1.20/m²', aktivne: 5 },
    { name: 'Tepovanie', popis: 'Hĺbkové čistenie kobercov, sedačiek, matracov', cena: 'od €25/ks', aktivne: 12 },
    { name: 'Airbnb management', popis: 'Kompletná správa krátkodobého prenájmu', cena: '20% z obratu', aktivne: 4 },
    { name: 'Dezinfekcia', popis: 'Profesionálna dezinfekcia priestorov', cena: 'od €2/m²', aktivne: 3 },
    { name: 'Údržba zelene', popis: 'Starostlivosť o exteriérové a interiérové rastliny', cena: 'od €150/mes', aktivne: 6 },
  ];
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 300, fontFamily: fontHeading, marginBottom: 24 }}>Služby <span style={{ color: T.gold, fontWeight: 600 }}>Vass &amp; Co.</span></h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {sluzby.map((s, i) => (
          <div key={i} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24, cursor: 'pointer', transition: 'border-color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.borderColor = T.gold)} onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{s.name}</h3>
              <span style={{ fontSize: 11, color: T.green, background: `${T.green}15`, padding: '3px 10px', borderRadius: 8 }}>{s.aktivne} aktívnych</span>
            </div>
            <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 12, lineHeight: 1.5 }}>{s.popis}</p>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.gold }}>{s.cena}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VCPonukyView() {
  const ponuky = [
    { cislo: 'CP-2026-001', klient: 'TechCorp s.r.o.', typ: 'Facility Paušál', suma: '€1,850/mes', status: 'Odoslaná', datum: '15.3.2026' },
    { cislo: 'CP-2026-002', klient: 'FreshMarket', typ: 'Office Refresh', suma: '€2,400', status: 'Schválená', datum: '12.3.2026' },
    { cislo: 'CP-2026-003', klient: 'Bytový dom SM', typ: 'Tepovanie', suma: '€680', status: 'Draft', datum: '18.3.2026' },
    { cislo: 'CP-2026-004', klient: 'DataSoft a.s.', typ: 'SLA Enterprise', suma: '€3,200/mes', status: 'Odoslaná', datum: '10.3.2026' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 300, fontFamily: fontHeading }}>Cenové <span style={{ color: T.gold, fontWeight: 600 }}>ponuky</span></h1>
        <button style={{ padding: '10px 20px', borderRadius: 10, background: `linear-gradient(135deg, ${T.goldLight}, ${T.gold}, ${T.goldDark})`, color: T.bg, fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer' }}>+ Nová ponuka</button>
      </div>
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: `1px solid ${T.border}`, fontSize: 11, color: T.textMuted, fontWeight: 600, letterSpacing: '0.05em' }}>
          <span>ČÍSLO</span><span>KLIENT</span><span>TYP</span><span>SUMA</span><span>STATUS</span><span>DÁTUM</span>
        </div>
        {ponuky.map((p, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 1fr', padding: '14px 20px', borderBottom: i < ponuky.length - 1 ? `1px solid ${T.border}` : 'none', fontSize: 13, alignItems: 'center', cursor: 'pointer', transition: 'background 0.15s' }} onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <span style={{ fontWeight: 500, color: T.gold }}>{p.cislo}</span>
            <span style={{ color: T.text }}>{p.klient}</span>
            <span style={{ color: T.textMuted }}>{p.typ}</span>
            <span style={{ fontWeight: 600, color: T.text }}>{p.suma}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: p.status === 'Schválená' ? T.green : p.status === 'Odoslaná' ? T.blue : T.textMuted, background: `${p.status === 'Schválená' ? T.green : p.status === 'Odoslaná' ? T.blue : T.textMuted}15`, padding: '3px 10px', borderRadius: 8, textAlign: 'center' }}>{p.status}</span>
            <span style={{ color: T.textMuted }}>{p.datum}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VCSlaView() {
  const zmluvy = [
    { klient: 'TechCorp s.r.o.', typ: 'Premium SLA', od: '01/2026', do: '12/2026', hodnota: '€22,200/rok', status: 'Aktívna' },
    { klient: 'DataSoft a.s.', typ: 'Enterprise SLA', od: '02/2026', do: '01/2027', hodnota: '€38,400/rok', status: 'Aktívna' },
    { klient: 'FreshMarket', typ: 'Štandard SLA', od: '03/2026', do: '02/2027', hodnota: '€9,600/rok', status: 'Aktívna' },
    { klient: 'Bytový dom SM', typ: 'Správa BD', od: '01/2026', do: '12/2026', hodnota: '€14,400/rok', status: 'Aktívna' },
  ];
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 300, fontFamily: fontHeading, marginBottom: 24 }}>SLA <span style={{ color: T.gold, fontWeight: 600 }}>&amp; Zmluvy</span></h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {zmluvy.map((z, i) => (
          <div key={i} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{z.klient}</h3>
              <span style={{ fontSize: 11, fontWeight: 600, color: T.green, background: `${T.green}15`, padding: '3px 10px', borderRadius: 8 }}>{z.status}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
              <div><span style={{ color: T.textMuted }}>Typ:</span> <span style={{ color: T.textSoft }}>{z.typ}</span></div>
              <div><span style={{ color: T.textMuted }}>Hodnota:</span> <span style={{ color: T.gold, fontWeight: 600 }}>{z.hodnota}</span></div>
              <div><span style={{ color: T.textMuted }}>Od:</span> <span style={{ color: T.textSoft }}>{z.od}</span></div>
              <div><span style={{ color: T.textMuted }}>Do:</span> <span style={{ color: T.textSoft }}>{z.do}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VCAirbnbView() {
  const [mesiac] = useState('Marec 2026');
  const objekty = [
    { name: 'Apartmán Staré Mesto', adresa: 'Michalská 12, Bratislava', obsadenost: 78, prijem: '€1,840', hodnotenie: 4.9, rezervacie: 6 },
    { name: 'Studio Ružinov', adresa: 'Bajkalská 28, Bratislava', obsadenost: 65, prijem: '€920', hodnotenie: 4.7, rezervacie: 4 },
    { name: 'Loft Petržalka', adresa: 'Kutlíkova 5, Bratislava', obsadenost: 82, prijem: '€1,560', hodnotenie: 4.8, rezervacie: 7 },
    { name: 'Apartmán Nové Mesto', adresa: 'Račianska 44, Bratislava', obsadenost: 71, prijem: '€1,280', hodnotenie: 4.6, rezervacie: 5 },
  ];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 300, fontFamily: fontHeading }}>Airbnb <span style={{ color: T.gold, fontWeight: 600 }}>Správa</span></h1>
          <p style={{ color: T.textMuted, fontSize: 13, marginTop: 4 }}>{mesiac} — {objekty.length} objekty</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Celkový príjem', value: `€${objekty.reduce((s, o) => s + parseInt(o.prijem.replace(/[€,]/g, '')), 0).toLocaleString()}`, color: T.gold },
          { label: 'Priem. obsadenosť', value: `${Math.round(objekty.reduce((s, o) => s + o.obsadenost, 0) / objekty.length)}%`, color: T.green },
          { label: 'Celkom rezervácií', value: objekty.reduce((s, o) => s + o.rezervacie, 0).toString(), color: T.blue },
          { label: 'Priem. hodnotenie', value: (objekty.reduce((s, o) => s + o.hodnotenie, 0) / objekty.length).toFixed(1) + ' ★', color: T.orange },
        ].map(s => (
          <div key={s.label} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {objekty.map((o, i) => (
          <div key={i} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 4 }}>{o.name}</h3>
            <p style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>{o.adresa}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
              <div><span style={{ color: T.textMuted }}>Obsadenosť:</span> <span style={{ color: o.obsadenost > 75 ? T.green : T.orange, fontWeight: 600 }}>{o.obsadenost}%</span></div>
              <div><span style={{ color: T.textMuted }}>Príjem:</span> <span style={{ color: T.gold, fontWeight: 600 }}>{o.prijem}</span></div>
              <div><span style={{ color: T.textMuted }}>Hodnotenie:</span> <span style={{ color: T.orange }}>{o.hodnotenie} ★</span></div>
              <div><span style={{ color: T.textMuted }}>Rezervácie:</span> <span style={{ color: T.textSoft }}>{o.rezervacie}</span></div>
            </div>
            <div style={{ marginTop: 16, height: 6, borderRadius: 3, background: T.bg }}>
              <div style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight})`, width: `${o.obsadenost}%`, transition: 'width 0.5s' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VCTepovanieView() {
  const zakazky = [
    { klient: 'Hotel Devín', typ: 'Koberce — lobby + chodby', stav: 'Naplánované', datum: '22.3.2026', cena: '€480' },
    { klient: 'Airbnb Staré Mesto', typ: 'Sedačka + matrac', stav: 'Dnes', datum: '20.3.2026', cena: '€85' },
    { klient: 'Kancelária TechCorp', typ: 'Koberce — open space', stav: 'Hotové', datum: '18.3.2026', cena: '€320' },
    { klient: 'Rodinný dom — Kramáre', typ: 'Sedačka + kreslo', stav: 'Naplánované', datum: '25.3.2026', cena: '€120' },
    { klient: 'Bytový dom Nivy', typ: 'Spoločné priestory', stav: 'Hotové', datum: '15.3.2026', cena: '€560' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 300, fontFamily: fontHeading }}>Tepovanie <span style={{ color: T.gold, fontWeight: 600 }}>&amp; Čistenie</span></h1>
        <button style={{ padding: '10px 20px', borderRadius: 10, background: `linear-gradient(135deg, ${T.goldLight}, ${T.gold}, ${T.goldDark})`, color: T.bg, fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer' }}>+ Nová zákazka</button>
      </div>
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: `1px solid ${T.border}`, fontSize: 11, color: T.textMuted, fontWeight: 600, letterSpacing: '0.05em' }}>
          <span>KLIENT</span><span>POPIS</span><span>STAV</span><span>DÁTUM</span><span>CENA</span>
        </div>
        {zakazky.map((z, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1fr', padding: '14px 20px', borderBottom: i < zakazky.length - 1 ? `1px solid ${T.border}` : 'none', fontSize: 13, alignItems: 'center' }}>
            <span style={{ fontWeight: 500, color: T.text }}>{z.klient}</span>
            <span style={{ color: T.textMuted }}>{z.typ}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: z.stav === 'Hotové' ? T.green : z.stav === 'Dnes' ? T.orange : T.blue, background: `${z.stav === 'Hotové' ? T.green : z.stav === 'Dnes' ? T.orange : T.blue}15`, padding: '3px 10px', borderRadius: 8, textAlign: 'center' }}>{z.stav}</span>
            <span style={{ color: T.textMuted }}>{z.datum}</span>
            <span style={{ fontWeight: 600, color: T.gold }}>{z.cena}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VCKlientiView() {
  const klienti = [
    { name: 'TechCorp s.r.o.', kontakt: 'Ing. Marek Horváth', email: 'marek@techcorp.sk', zmluva: 'Premium SLA', mesacne: '€1,850' },
    { name: 'DataSoft a.s.', kontakt: 'PhDr. Lucia Nováková', email: 'lucia@datasoft.sk', zmluva: 'Enterprise SLA', mesacne: '€3,200' },
    { name: 'FreshMarket', kontakt: 'Tomáš Kováč', email: 'tomas@freshmarket.sk', zmluva: 'Štandard SLA', mesacne: '€800' },
    { name: 'Správa BD Staré Mesto', kontakt: 'Ing. Jana Molnárová', email: 'sprava@bdstm.sk', zmluva: 'Správa BD', mesacne: '€1,200' },
    { name: 'Hotel Devín', kontakt: 'Mgr. Peter Szabó', email: 'peter@hoteldevin.sk', zmluva: 'Ad-hoc', mesacne: '—' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 300, fontFamily: fontHeading }}>Klienti <span style={{ color: T.gold, fontWeight: 600 }}>Vass &amp; Co.</span></h1>
        <button style={{ padding: '10px 20px', borderRadius: 10, background: `linear-gradient(135deg, ${T.goldLight}, ${T.gold}, ${T.goldDark})`, color: T.bg, fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer' }}>+ Pridať klienta</button>
      </div>
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden' }}>
        {klienti.map((k, i) => (
          <div key={i} style={{ padding: '16px 20px', borderBottom: i < klienti.length - 1 ? `1px solid ${T.border}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'background 0.15s' }} onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 2 }}>{k.name}</div>
              <div style={{ fontSize: 12, color: T.textMuted }}>{k.kontakt} — {k.email}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: T.textMuted }}>{k.zmluva}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.gold }}>{k.mesacne}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VCDokumentyView() {
  const docs = [
    { name: 'Zmluva o nájme kancelárie', typ: 'PDF', datum: '01/2026', velkost: '1.7 MB' },
    { name: 'CP1 — Facility Paušál', typ: 'PDF', datum: '03/2026', velkost: '140 KB' },
    { name: 'CP2 — Office Refresh', typ: 'PDF', datum: '03/2026', velkost: '150 KB' },
    { name: 'SLA šablóna — Premium', typ: 'DOCX', datum: '02/2026', velkost: '220 KB' },
    { name: 'Ponukový list — Tepovanie', typ: 'DOCX', datum: '03/2026', velkost: '215 KB' },
    { name: 'Ponukový list — Airbnb', typ: 'DOCX', datum: '03/2026', velkost: '210 KB' },
  ];
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 300, fontFamily: fontHeading, marginBottom: 24 }}>Dokumenty <span style={{ color: T.gold, fontWeight: 600 }}>Vass &amp; Co.</span></h1>
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden' }}>
        {docs.map((d, i) => (
          <div key={i} style={{ padding: '14px 20px', borderBottom: i < docs.length - 1 ? `1px solid ${T.border}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'background 0.15s' }} onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: d.typ === 'PDF' ? T.red : T.blue, background: `${d.typ === 'PDF' ? T.red : T.blue}15`, padding: '4px 8px', borderRadius: 6 }}>{d.typ}</span>
              <span style={{ fontSize: 13, color: T.text }}>{d.name}</span>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: T.textMuted }}>
              <span>{d.datum}</span><span>{d.velkost}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VCNastaveniaView() {
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 300, fontFamily: fontHeading, marginBottom: 24 }}>Nastavenia <span style={{ color: T.gold, fontWeight: 600 }}>Vass &amp; Co.</span></h1>
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: T.gold, marginBottom: 16 }}>Firemné údaje</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 13 }}>
          {([
            ['Názov', 'VVD s. r. o. (Vass & Co.)'],
            ['IČO', '56921021'],
            ['DIČ', '2122765432'],
            ['Adresa', 'Bratislava, Slovensko'],
            ['Email', 'info@vassco.sk'],
            ['Telefón', '+421 918 668 728'],
            ['Konateľ', 'Richard Vass'],
            ['Web', 'vassco.sk'],
          ] as [string, string][]).map(([k, v]) => (
            <div key={k} style={{ padding: '12px 0', borderBottom: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>{k}</div>
              <div style={{ color: T.textSoft }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MÔJ SYSTÉM — OHEŇ / VLNA / ĽAD
// ═══════════════════════════════════════════════════════════════
function MojSystemView() {
  const [ohen, setOhen] = useState<string[]>(['', '', '']);
  const [vlna, setVlna] = useState<string[]>(['', '', '', '', '']);
  const [lad, setLad] = useState<string[]>(['', '', '', '', '']);
  const [ohenChecked, setOhenChecked] = useState<boolean[]>([false, false, false]);
  const [vlnaChecked, setVlnaChecked] = useState<boolean[]>([false, false, false, false, false]);

  const updateItem = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, idx: number, val: string) => {
    const next = [...arr]; next[idx] = val; setArr(next);
  };
  const toggleCheck = (arr: boolean[], setArr: React.Dispatch<React.SetStateAction<boolean[]>>, idx: number) => {
    const next = [...arr]; next[idx] = !next[idx]; setArr(next);
  };

  const sectionStyle: React.CSSProperties = { marginBottom: 32 };
  const headerStyle = (color: string): React.CSSProperties => ({
    fontSize: 18, fontWeight: 700, color, marginBottom: 4, fontFamily: fontHeading, display: 'flex', alignItems: 'center', gap: 10,
  });

  return (
    <div style={{ padding: '32px 24px', maxWidth: 900 }}>
      <h1 style={{ fontSize: 24, fontWeight: 300, color: T.text, marginBottom: 4, fontFamily: fontHeading }}>
        Môj <span style={{ color: T.gold, fontWeight: 600 }}>Systém</span>
      </h1>
      <p style={{ color: T.textMuted, fontSize: 13, marginBottom: 32 }}>Prioritizácia podľa OHEŇ / VLNA / ĽAD — vždy vieš čo robiť</p>

      {/* OHEŇ */}
      <div style={sectionStyle}>
        <div style={headerStyle(T.red)}>
          <Icon d={icons.fire} size={22} color={T.red} /> OHEŇ — DNES (max 3)
        </div>
        <p style={{ color: T.textMuted, fontSize: 12, marginBottom: 16 }}>Ak nespraviš dnes, spôsobí reálnu škodu.</p>
        {ohen.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <button onClick={() => toggleCheck(ohenChecked, setOhenChecked, i)} style={{
              width: 24, height: 24, borderRadius: 6, border: `2px solid ${ohenChecked[i] ? T.green : T.red}`,
              background: ohenChecked[i] ? `${T.green}20` : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {ohenChecked[i] && <Icon d={icons.check} size={14} color={T.green} />}
            </button>
            <input value={item} onChange={e => updateItem(ohen, setOhen, i, e.target.value)}
              placeholder={`Priorita ${i + 1}`}
              style={{
                flex: 1, padding: '10px 14px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10,
                color: ohenChecked[i] ? T.textMuted : T.text, fontSize: 14, fontFamily: font, outline: 'none',
                textDecoration: ohenChecked[i] ? 'line-through' : 'none',
              }} />
          </div>
        ))}
      </div>

      {/* VLNA */}
      <div style={sectionStyle}>
        <div style={headerStyle(T.blue)}>
          <Icon d={icons.workflow} size={22} color={T.blue} /> VLNA — TENTO TÝŽDEŇ
        </div>
        <p style={{ color: T.textMuted, fontSize: 12, marginBottom: 16 }}>Dôležité, ale bez dnešného deadlinu. Aspoň 1h denne.</p>
        {vlna.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <button onClick={() => toggleCheck(vlnaChecked, setVlnaChecked, i)} style={{
              width: 24, height: 24, borderRadius: 6, border: `2px solid ${vlnaChecked[i] ? T.green : T.blue}`,
              background: vlnaChecked[i] ? `${T.green}20` : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {vlnaChecked[i] && <Icon d={icons.check} size={14} color={T.green} />}
            </button>
            <input value={item} onChange={e => updateItem(vlna, setVlna, i, e.target.value)}
              placeholder={`Úloha ${i + 1}`}
              style={{
                flex: 1, padding: '10px 14px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10,
                color: vlnaChecked[i] ? T.textMuted : T.text, fontSize: 14, fontFamily: font, outline: 'none',
                textDecoration: vlnaChecked[i] ? 'line-through' : 'none',
              }} />
          </div>
        ))}
      </div>

      {/* ĽAD */}
      <div style={sectionStyle}>
        <div style={headerStyle(T.textMuted)}>
          <Icon d={icons.cloud} size={22} color={T.textMuted} /> ĽAD — POČKÁ
        </div>
        <p style={{ color: T.textMuted, fontSize: 12, marginBottom: 16 }}>Zapíš, ulož, nerieš. Raz týždenne skontroluj.</p>
        {lad.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${T.border}`, background: 'transparent', flexShrink: 0 }} />
            <input value={item} onChange={e => updateItem(lad, setLad, i, e.target.value)}
              placeholder={`Neskôr ${i + 1}`}
              style={{
                flex: 1, padding: '10px 14px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10,
                color: T.textSoft, fontSize: 14, fontFamily: font, outline: 'none',
              }} />
          </div>
        ))}
      </div>

      {/* Núdzový reset */}
      <Card style={{ borderColor: `${T.gold}30`, background: `${T.gold}08` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Icon d={icons.zap} size={20} color={T.gold} />
          <span style={{ fontSize: 14, fontWeight: 600, color: T.gold }}>Núdzový Reset</span>
        </div>
        <p style={{ color: T.textSoft, fontSize: 13, lineHeight: 1.7, marginBottom: 8 }}>
          Keď máš bordel v hlave — 60-90 minút:
        </p>
        <ol style={{ color: T.textSoft, fontSize: 13, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
          <li>Fyzický reset (10 min) — voda, čerstvý vzduch</li>
          <li>Brain dump (15 min) — všetko na papier</li>
          <li>Triedenie (15 min) — O / V / L pri každej položke</li>
          <li>Súbory a stôl (20 min) — 3 priečinky, čistý stôl</li>
          <li>Dva zoznamy (10 min) — OHEŇ a VLNA papier</li>
          <li>Prvá úloha — najmenšia vec z OHEŇ, teraz</li>
        </ol>
        <p style={{ color: T.textMuted, fontSize: 12, fontStyle: 'italic', marginTop: 12 }}>
          &ldquo;Nemusíš vidieť celý rebrík. Stačí vidieť nasledujúci schod.&rdquo;
        </p>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DENNÝ CHECKLIST
// ═══════════════════════════════════════════════════════════════
function ChecklistView() {
  const today = new Date().toLocaleDateString('sk-SK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const dayName = new Date().toLocaleDateString('sk-SK', { weekday: 'long' }).toUpperCase();

  const sections = [
    {
      title: 'RÁNO + TRÉNING',
      color: T.orange,
      items: [
        'Vstal som o 05:30, voda, suplementy',
        'Žiadny telefón prvých 30 min',
        '10 min bike warm-up + mobilita',
        'Tréning podľa splitu (zapísať do logu)',
        'Strečing po tréningu',
        'Raňajky + proteín',
        'Napísal som 3 veci (vďačnosť / firma / ja)',
        'Pozrel som OHEŇ úlohy — viem čo riešim',
      ],
    },
    {
      title: 'PRÁCA',
      color: T.blue,
      items: [
        'Hlboká práca #1 (08:15–10:30)',
        'Hlboká práca #2 (10:45–12:30)',
        'Komunikačný blok — emaily, správy, telefóny',
        'Hlboká práca #3 (13:30–15:00)',
        'Admin + CRM update (obe firmy)',
      ],
    },
    {
      title: 'FIRMY',
      color: T.gold,
      items: [
        'Vass & Co. — dnes som urobil:',
        'Vassweb — dnes som urobil:',
      ],
    },
    {
      title: 'ZDRAVIE',
      color: T.green,
      items: [
        'Dostatočný príjem bielkovín',
        'Voda minimálne 2,5 l',
        'Všetky suplementy (ráno + večer)',
      ],
    },
    {
      title: 'VEČER',
      color: T.purple,
      items: [
        '3 veci čo sa dnes podarili',
        'Pripravený checklist + OHEŇ na zajtrajšok',
        'Telefón preč od 22:00',
        'V posteli do 22:00',
      ],
    },
  ];

  const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0);
  const [checked, setChecked] = useState<boolean[]>(new Array(totalItems).fill(false));
  const [notes, setNotes] = useState<Record<number, string>>({});
  const doneCount = checked.filter(Boolean).length;

  const toggle = (globalIdx: number) => {
    const next = [...checked]; next[globalIdx] = !next[globalIdx]; setChecked(next);
  };

  let globalIdx = 0;

  return (
    <div style={{ padding: '32px 24px', maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 300, color: T.text, marginBottom: 4, fontFamily: fontHeading }}>
            Denný <span style={{ color: T.gold, fontWeight: 600 }}>Checklist</span>
          </h1>
          <p style={{ color: T.textMuted, fontSize: 13 }}>{today} — {dayName}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: doneCount === totalItems ? T.green : T.gold, fontFamily: fontHeading }}>
            {doneCount} / {totalItems}
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, letterSpacing: '0.05em' }}>DNEŠNÉ SKÓRE</div>
        </div>
      </div>

      <ProgressBar value={(doneCount / totalItems) * 100} color={doneCount === totalItems ? T.green : T.gold} />

      <div style={{ marginTop: 32 }}>
        {sections.map((section) => {
          const sectionStart = globalIdx;
          const sectionItems = section.items.map((item, i) => {
            const idx = sectionStart + i;
            globalIdx++;
            const isCompany = section.title === 'FIRMY';
            return (
              <div key={idx} style={{ display: 'flex', alignItems: isCompany ? 'flex-start' : 'center', gap: 12, marginBottom: isCompany ? 12 : 8 }}>
                <button onClick={() => toggle(idx)} style={{
                  width: 22, height: 22, borderRadius: 6, border: `2px solid ${checked[idx] ? T.green : section.color}`,
                  background: checked[idx] ? `${T.green}20` : 'transparent', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: isCompany ? 2 : 0,
                }}>
                  {checked[idx] && <Icon d={icons.check} size={12} color={T.green} />}
                </button>
                <div style={{ flex: 1 }}>
                  <span style={{
                    color: checked[idx] ? T.textMuted : T.textSoft, fontSize: 13,
                    textDecoration: checked[idx] ? 'line-through' : 'none',
                  }}>{item}</span>
                  {isCompany && (
                    <input value={notes[idx] || ''} onChange={e => setNotes(prev => ({ ...prev, [idx]: e.target.value }))}
                      placeholder="Čo som urobil..."
                      style={{
                        display: 'block', marginTop: 6, width: '100%', padding: '8px 12px', background: T.bg,
                        border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 12, fontFamily: font, outline: 'none',
                      }} />
                  )}
                </div>
              </div>
            );
          });

          return (
            <div key={section.title} style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: section.color, letterSpacing: '0.1em', marginBottom: 12 }}>
                {section.title}
              </div>
              {sectionItems}
            </div>
          );
        })}
      </div>

      {/* Večerné 3 veci */}
      <Card style={{ marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.gold, marginBottom: 12 }}>3 veci čo sa dnes podarili</div>
        {[1, 2, 3].map(i => (
          <input key={i} placeholder={`${i}.`}
            style={{
              display: 'block', width: '100%', padding: '10px 14px', marginBottom: 8,
              background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10,
              color: T.text, fontSize: 13, fontFamily: font, outline: 'none',
            }} />
        ))}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TRÉNING
// ═══════════════════════════════════════════════════════════════
function TreningView() {
  const dayOfWeek = new Date().getDay(); // 0=Sun, 1=Mon...
  const schedule: { day: string; type: string; focus: string; color: string }[] = [
    { day: 'PONDELOK', type: 'PUSH', focus: 'Hrudník, ramená, triceps', color: T.red },
    { day: 'UTOROK', type: 'LEGS', focus: 'Leg press, leg curl, leg ext, lýtka', color: T.blue },
    { day: 'STREDA', type: 'ZONE 2', focus: '30–45 min nízka intenzita (bike / chôdza)', color: T.green },
    { day: 'ŠTVRTOK', type: 'PULL', focus: 'Chrbát, biceps, zadné ramená', color: T.orange },
    { day: 'PIATOK', type: 'ZONE 2', focus: '30–45 min nízka intenzita', color: T.green },
    { day: 'SOBOTA', type: 'ACCESSORY', focus: 'Slabé partie, core, mobilita', color: T.purple },
    { day: 'NEDEĽA', type: 'OFF', focus: 'Oddych, regenerácia, nedeľný review', color: T.textMuted },
  ];

  const todayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const todaySchedule = schedule[todayIdx];

  const [warmup, setWarmup] = useState([false, false, false]);
  const [exercises, setExercises] = useState<{ name: string; sets: { weight: string; reps: string; rir: string; done: boolean }[] }[]>([]);

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: [{ weight: '', reps: '', rir: '', done: false }, { weight: '', reps: '', rir: '', done: false }, { weight: '', reps: '', rir: '', done: false }] }]);
  };

  const toggleWarmup = (i: number) => { const next = [...warmup]; next[i] = !next[i]; setWarmup(next); };

  return (
    <div style={{ padding: '32px 24px', maxWidth: 900 }}>
      <h1 style={{ fontSize: 24, fontWeight: 300, color: T.text, marginBottom: 4, fontFamily: fontHeading }}>
        Tréningový <span style={{ color: T.gold, fontWeight: 600 }}>Log</span>
      </h1>
      <p style={{ color: T.textMuted, fontSize: 13, marginBottom: 32 }}>PPL split — bezpečný pre chrbát (L5/S1), strojový</p>

      {/* Dnešný tréning */}
      <Card style={{ marginBottom: 24, borderColor: `${todaySchedule.color}40` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Badge label={todaySchedule.type} color={todaySchedule.color} />
            <div style={{ fontSize: 18, fontWeight: 600, color: T.text, marginTop: 8, fontFamily: fontHeading }}>{todaySchedule.day} — Dnes</div>
            <div style={{ color: T.textMuted, fontSize: 13, marginTop: 4 }}>{todaySchedule.focus}</div>
          </div>
          <div style={{ fontSize: 48, fontWeight: 200, color: `${todaySchedule.color}40`, fontFamily: fontHeading }}>
            {todaySchedule.type}
          </div>
        </div>
      </Card>

      {/* Warm-up */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.orange, letterSpacing: '0.1em', marginBottom: 12 }}>WARM-UP (Povinné)</div>
        {['10 min bike warm-up', 'Mobilita / dynamický strečing', 'RAMP-up sety (ľahké → ťažké)'].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <button onClick={() => toggleWarmup(i)} style={{
              width: 22, height: 22, borderRadius: 6, border: `2px solid ${warmup[i] ? T.green : T.orange}`,
              background: warmup[i] ? `${T.green}20` : 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {warmup[i] && <Icon d={icons.check} size={12} color={T.green} />}
            </button>
            <span style={{ color: warmup[i] ? T.textMuted : T.textSoft, fontSize: 13, textDecoration: warmup[i] ? 'line-through' : 'none' }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Cvičenia */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.gold, letterSpacing: '0.1em' }}>CVIČENIA</div>
          <Btn onClick={addExercise} variant="ghost" style={{ padding: '6px 12px', fontSize: 12 }}>
            <Icon d={icons.plus} size={14} /> Pridať cvičenie
          </Btn>
        </div>
        {exercises.length === 0 && (
          <Card>
            <div style={{ textAlign: 'center', padding: '24px 0', color: T.textMuted }}>
              <Icon d={icons.dumbbell} size={32} color={T.textMuted} />
              <p style={{ marginTop: 8, fontSize: 13 }}>Pridaj prvé cvičenie</p>
            </div>
          </Card>
        )}
        {exercises.map((ex, ei) => (
          <Card key={ei} style={{ marginBottom: 12 }}>
            <input value={ex.name} placeholder="Názov cvičenia (napr. Chest Press Machine)"
              onChange={e => {
                const next = [...exercises]; next[ei] = { ...next[ei], name: e.target.value }; setExercises(next);
              }}
              style={{
                width: '100%', padding: '8px 12px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8,
                color: T.text, fontSize: 14, fontWeight: 600, fontFamily: font, outline: 'none', marginBottom: 12,
              }} />
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr 40px', gap: 6, fontSize: 10, color: T.textMuted, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 6, padding: '0 4px' }}>
              <span>SET</span><span>KG</span><span>REPS</span><span>RIR</span><span></span>
            </div>
            {ex.sets.map((set, si) => (
              <div key={si} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr 40px', gap: 6, marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: T.textMuted, fontWeight: 600 }}>{si + 1}</div>
                <input value={set.weight} placeholder="0" onChange={e => {
                  const next = [...exercises]; next[ei].sets[si] = { ...set, weight: e.target.value }; setExercises(next);
                }} style={{ padding: '8px 10px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 13, fontFamily: font, outline: 'none', textAlign: 'center' }} />
                <input value={set.reps} placeholder="0" onChange={e => {
                  const next = [...exercises]; next[ei].sets[si] = { ...set, reps: e.target.value }; setExercises(next);
                }} style={{ padding: '8px 10px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 13, fontFamily: font, outline: 'none', textAlign: 'center' }} />
                <input value={set.rir} placeholder="RIR" onChange={e => {
                  const next = [...exercises]; next[ei].sets[si] = { ...set, rir: e.target.value }; setExercises(next);
                }} style={{ padding: '8px 10px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 13, fontFamily: font, outline: 'none', textAlign: 'center' }} />
                <button onClick={() => {
                  const next = [...exercises]; next[ei].sets[si] = { ...set, done: !set.done }; setExercises(next);
                }} style={{
                  width: 32, height: 32, borderRadius: 6, border: `2px solid ${set.done ? T.green : T.border}`,
                  background: set.done ? `${T.green}20` : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {set.done && <Icon d={icons.check} size={12} color={T.green} />}
                </button>
              </div>
            ))}
            <button onClick={() => {
              const next = [...exercises]; next[ei].sets.push({ weight: '', reps: '', rir: '', done: false }); setExercises(next);
            }} style={{ marginTop: 8, background: 'none', border: 'none', color: T.textMuted, cursor: 'pointer', fontSize: 12, fontFamily: font }}>
              + Pridať set
            </button>
          </Card>
        ))}
      </div>

      {/* Týždenný split */}
      <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: '0.1em', marginBottom: 12 }}>TÝŽDENNÝ SPLIT</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
        {schedule.map((day, i) => (
          <Card key={i} style={{
            padding: 12, textAlign: 'center',
            borderColor: i === todayIdx ? day.color : T.border,
            background: i === todayIdx ? `${day.color}10` : T.bgCard,
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: T.textMuted, letterSpacing: '0.06em', marginBottom: 4 }}>{day.day.slice(0, 3)}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: day.color }}>{day.type}</div>
          </Card>
        ))}
      </div>

      {/* Pravidlá */}
      <Card style={{ marginTop: 24, borderColor: `${T.red}30` }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.red, marginBottom: 8 }}>Povinné pravidlá</div>
        <ul style={{ color: T.textSoft, fontSize: 12, lineHeight: 1.8, paddingLeft: 16, margin: 0 }}>
          <li>Warm-up pred KAŽDÝM tréningom — nenegociovateľné</li>
          <li>Žiadne voľné drepy, žiadne mŕtve ťahy — len stroje s oporou</li>
          <li>STOP pri bolesti &gt; 3/10</li>
          <li>Strečing po KAŽDOM tréningu (min 5-10 min)</li>
          <li>Nikdy nevynechaj 2x za sebou</li>
        </ul>
        <p style={{ color: T.textMuted, fontSize: 12, fontStyle: 'italic', marginTop: 12 }}>
          &ldquo;Tréning nie je luxus. Je to liek. Najlepší tréning je ten, ktorý spraviš.&rdquo;
        </p>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TÝŽDENNÝ PREHĽAD + NEDEĽNÝ REVIEW
// ═══════════════════════════════════════════════════════════════
function TyzdennyPrehladView() {
  const [goals, setGoals] = useState(['', '', '']);
  const [tab, setTab] = useState<'tyzdenny' | 'review'>('tyzdenny');
  const days = ['PONDELOK', 'UTOROK', 'STREDA', 'ŠTVRTOK', 'PIATOK', 'SOBOTA', 'NEDEĽA'];
  const [dayData, setDayData] = useState<{ ohen: string; vlna: string; trening: string; skore: string }[]>(
    days.map(() => ({ ohen: '', vlna: '', trening: '', skore: '' }))
  );
  const [review, setReview] = useState({ podarilo: '', nefungovalo: '', upravim: '', energia: '', mentalne: '', produktivita: '', celkovo: '', hrdost: '' });

  const getWeekRange = () => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return `${monday.toLocaleDateString('sk-SK')} — ${sunday.toLocaleDateString('sk-SK')}`;
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: 900 }}>
      <h1 style={{ fontSize: 24, fontWeight: 300, color: T.text, marginBottom: 4, fontFamily: fontHeading }}>
        Týždenný <span style={{ color: T.gold, fontWeight: 600 }}>Prehľad</span>
      </h1>
      <p style={{ color: T.textMuted, fontSize: 13, marginBottom: 24 }}>{getWeekRange()}</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: T.bgCard, borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {[{ key: 'tyzdenny' as const, label: 'Týždenný plán' }, { key: 'review' as const, label: 'Nedeľný review' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: font,
            background: tab === t.key ? `${T.gold}20` : 'transparent',
            color: tab === t.key ? T.gold : T.textMuted,
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'tyzdenny' && (
        <>
          {/* 3 Ciele */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.gold, letterSpacing: '0.1em', marginBottom: 12 }}>CIELE TÝŽDŇA (max 3)</div>
            {goals.map((g, i) => (
              <input key={i} value={g} onChange={e => { const next = [...goals]; next[i] = e.target.value; setGoals(next); }}
                placeholder={`Cieľ ${i + 1}`}
                style={{
                  display: 'block', width: '100%', padding: '10px 14px', marginBottom: 8,
                  background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10,
                  color: T.text, fontSize: 14, fontFamily: font, outline: 'none',
                }} />
            ))}
          </div>

          {/* Dni */}
          {days.map((day, i) => (
            <Card key={day} style={{ marginBottom: 8, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.gold, letterSpacing: '0.06em', marginBottom: 10 }}>{day}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input value={dayData[i].ohen} onChange={e => { const next = [...dayData]; next[i] = { ...next[i], ohen: e.target.value }; setDayData(next); }}
                  placeholder="OHEŇ" style={{ padding: '8px 12px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 12, fontFamily: font, outline: 'none' }} />
                <input value={dayData[i].vlna} onChange={e => { const next = [...dayData]; next[i] = { ...next[i], vlna: e.target.value }; setDayData(next); }}
                  placeholder="VLNA" style={{ padding: '8px 12px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 12, fontFamily: font, outline: 'none' }} />
                <input value={dayData[i].trening} onChange={e => { const next = [...dayData]; next[i] = { ...next[i], trening: e.target.value }; setDayData(next); }}
                  placeholder="Tréning" style={{ padding: '8px 12px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 12, fontFamily: font, outline: 'none' }} />
                <input value={dayData[i].skore} onChange={e => { const next = [...dayData]; next[i] = { ...next[i], skore: e.target.value }; setDayData(next); }}
                  placeholder="Skóre __/24" style={{ padding: '8px 12px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 12, fontFamily: font, outline: 'none' }} />
              </div>
            </Card>
          ))}
        </>
      )}

      {tab === 'review' && (
        <>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.green, marginBottom: 12 }}>Čo sa tento týždeň podarilo?</div>
            <TextArea value={review.podarilo} onChange={v => setReview(r => ({ ...r, podarilo: v }))} placeholder="Úspechy, pokroky, malé víťazstvá..." rows={4} />
          </Card>

          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.red, marginBottom: 12 }}>Čo nefungovalo a prečo?</div>
            <TextArea value={review.nefungovalo} onChange={v => setReview(r => ({ ...r, nefungovalo: v }))} placeholder="Čo ťa brzdilo, kde si strácal čas..." rows={4} />
          </Card>

          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.blue, marginBottom: 12 }}>Čo upravím budúci týždeň?</div>
            <TextArea value={review.upravim} onChange={v => setReview(r => ({ ...r, upravim: v }))} placeholder="Konkrétne zmeny, nové prístupy..." rows={4} />
          </Card>

          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.gold, marginBottom: 12 }}>Ako som sa cítil? (1–10)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              {[
                { key: 'energia' as const, label: 'Energia' },
                { key: 'mentalne' as const, label: 'Mentálne' },
                { key: 'produktivita' as const, label: 'Produktivita' },
                { key: 'celkovo' as const, label: 'Celkovo' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 500, color: T.textMuted, marginBottom: 4, letterSpacing: '0.05em' }}>{f.label}</label>
                  <input value={review[f.key]} onChange={e => setReview(r => ({ ...r, [f.key]: e.target.value }))}
                    placeholder="—" type="number" min="1" max="10"
                    style={{ width: '100%', padding: '10px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, color: T.gold, fontSize: 20, fontWeight: 700, fontFamily: font, outline: 'none', textAlign: 'center' }} />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.purple, marginBottom: 12 }}>Jedna vec, na ktorú som hrdý</div>
            <TextArea value={review.hrdost} onChange={v => setReview(r => ({ ...r, hrdost: v }))} placeholder="Tá jedna vec..." rows={2} />
          </Card>

          <p style={{ color: T.textMuted, fontSize: 12, fontStyle: 'italic', marginTop: 24, textAlign: 'center' }}>
            &ldquo;Každá akcia je hlas za typ človeka, ktorým sa chceš stať.&rdquo; — James Clear
          </p>
        </>
      )}
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
  const [company, setCompany] = useState({
    name: 'VVD s. r. o. (Vassweb)', email: 'info@vassweb.sk', phone: '+421 918 668 728',
    address: 'Bratislava, Slovenská republika', ico: '56921021', dic: '2122501524',
    ic_dph: 'SK2122501524', iban: 'SK11 0900 0000 0052 3252 7162',
    invoice_prefix: 'VW', invoice_next_number: invoices.length + 1,
  });
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) { setSettingsLoaded(true); return; }
    db.settings.get().then(res => {
      if (res.data) {
        setCompany(c => ({
          ...c,
          name: res.data!.company_name || c.name,
          email: res.data!.company_email || c.email,
          phone: res.data!.company_phone || c.phone,
          address: res.data!.company_address || c.address,
          ico: res.data!.company_ico || c.ico,
          dic: res.data!.company_dic || c.dic,
          ic_dph: res.data!.company_ic_dph || c.ic_dph,
          iban: res.data!.company_iban || c.iban,
          invoice_prefix: res.data!.invoice_prefix || c.invoice_prefix,
          invoice_next_number: res.data!.invoice_next_number || c.invoice_next_number,
        }));
      }
      setSettingsLoaded(true);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveSettings = async () => {
    if (isSupabaseConfigured()) {
      await db.settings.upsert({
        company_name: company.name, company_email: company.email, company_phone: company.phone,
        company_address: company.address, company_ico: company.ico, company_dic: company.dic,
        company_ic_dph: company.ic_dph, company_iban: company.iban,
        invoice_prefix: company.invoice_prefix, invoice_next_number: company.invoice_next_number,
      });
    }
    setMsg('Nastavenia uložené!'); setTimeout(() => setMsg(''), 3000);
  };

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

      {/* Company Settings */}
      {settingsLoaded && (
        <Card style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.gold, marginBottom: 14 }}>Firemné údaje</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 }}>
            <FormField label="Názov firmy"><Input value={company.name} onChange={v => setCompany(c => ({ ...c, name: v }))} /></FormField>
            <FormField label="E-mail"><Input value={company.email} onChange={v => setCompany(c => ({ ...c, email: v }))} type="email" /></FormField>
            <FormField label="Telefón"><Input value={company.phone} onChange={v => setCompany(c => ({ ...c, phone: v }))} /></FormField>
            <FormField label="Adresa"><Input value={company.address} onChange={v => setCompany(c => ({ ...c, address: v }))} /></FormField>
            <FormField label="IČO"><Input value={company.ico} onChange={v => setCompany(c => ({ ...c, ico: v }))} /></FormField>
            <FormField label="DIČ"><Input value={company.dic} onChange={v => setCompany(c => ({ ...c, dic: v }))} /></FormField>
            <FormField label="IČ DPH"><Input value={company.ic_dph} onChange={v => setCompany(c => ({ ...c, ic_dph: v }))} /></FormField>
            <FormField label="IBAN"><Input value={company.iban} onChange={v => setCompany(c => ({ ...c, iban: v }))} /></FormField>
            <FormField label="Prefix faktúr"><Input value={company.invoice_prefix} onChange={v => setCompany(c => ({ ...c, invoice_prefix: v }))} /></FormField>
            <FormField label="Ďalšie číslo faktúry"><Input value={String(company.invoice_next_number)} onChange={v => setCompany(c => ({ ...c, invoice_next_number: parseInt(v) || 1 }))} type="number" /></FormField>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            <Btn onClick={saveSettings}><Icon d={icons.check} size={16} /> Uložiť nastavenia</Btn>
          </div>
        </Card>
      )}

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
            { l: 'Obrat', v: fmt(invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0)) },
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
