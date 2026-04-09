'use client';

import { useState, useRef, useEffect } from 'react';

// ─── COLORS ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#0d1117',
  sidebar: '#111827',
  card: '#161d2b',
  cardHover: '#1c2535',
  border: '#1f2d3d',
  borderLight: '#263347',
  accent: '#10b981',
  accentDark: '#059669',
  accentGlow: 'rgba(16,185,129,0.15)',
  accentGlow2: 'rgba(16,185,129,0.08)',
  text: '#f0f6fc',
  textMuted: '#8b949e',
  textDim: '#4a5568',
  yellow: '#f59e0b',
  red: '#ef4444',
  blue: '#3b82f6',
  purple: '#8b5cf6',
};

// ─── FAKE DATA ────────────────────────────────────────────────────────────────
const workOrders = [
  { id: 'ZK-2024-0412', car: 'Škoda Octavia', year: 2019, spz: 'BA123AB', customer: 'Klient #1', service: 'Výmena oleja + filter', cost: 89, status: 'Hotová', mechanic: 'Mechanik A', date: '7.4.2026' },
  { id: 'ZK-2024-0413', car: 'Volkswagen Passat', year: 2017, spz: 'TT456CD', customer: 'Klient #2', service: 'Brzdové platničky predné', cost: 245, status: 'V procese', mechanic: 'Mechanik B', date: '7.4.2026' },
  { id: 'ZK-2024-0414', car: 'BMW 320d', year: 2020, spz: 'NR789EF', customer: 'Klient #3', service: 'Diagnostika + chyba motora', cost: 120, status: 'Čaká', mechanic: 'Mechanik A', date: '7.4.2026' },
  { id: 'ZK-2024-0415', car: 'Toyota Corolla', year: 2021, spz: 'BA321GH', customer: 'Klient #4', service: 'Klimatizácia - doplnenie chladiva', cost: 180, status: 'V procese', mechanic: 'Mechanik C', date: '7.4.2026' },
  { id: 'ZK-2024-0416', car: 'Ford Focus', year: 2016, spz: 'TT654IJ', customer: 'Klient #5', service: 'Tlmiče predné — výmena', cost: 380, status: 'Čaká', mechanic: 'Mechanik B', date: '8.4.2026' },
  { id: 'ZK-2024-0417', car: 'Audi A4', year: 2018, spz: 'NR987KL', customer: 'Klient #6', service: 'STK príprava + doplnenie tekutín', cost: 65, status: 'Hotová', mechanic: 'Mechanik C', date: '8.4.2026' },
  { id: 'ZK-2024-0418', car: 'Mercedes C220', year: 2022, spz: 'BA654MN', customer: 'Klient #7', service: 'Výmena pneumatík (4ks) + vyváženie', cost: 520, status: 'V procese', mechanic: 'Mechanik A', date: '8.4.2026' },
  { id: 'ZK-2024-0419', car: 'Peugeot 308', year: 2015, spz: 'TT111OP', customer: 'Klient #8', service: 'Rozvodový remeň + vodná pumpa', cost: 620, status: 'Čaká', mechanic: 'Mechanik B', date: '9.4.2026' },
  { id: 'ZK-2024-0420', car: 'Hyundai Tucson', year: 2023, spz: 'NR222QR', customer: 'Klient #9', service: 'Prehliadka 30 000 km', cost: 145, status: 'Hotová', mechanic: 'Mechanik C', date: '9.4.2026' },
  { id: 'ZK-2024-0421', car: 'Renault Megane', year: 2014, spz: 'BA999ST', customer: 'Klient #10', service: 'Výfuk — oprava trhliny', cost: 290, status: 'Čaká', mechanic: 'Mechanik A', date: '9.4.2026' },
];

const todayOrders = workOrders.slice(0, 6);

const customers = [
  { id: 1, name: 'Klient #1', phone: '+421 *** *** ***', email: 'k*****@***.sk', cars: 'Škoda Octavia 2019', visits: 8, lastVisit: '7.4.2026', totalSpent: 1240 },
  { id: 2, name: 'Klient #2', phone: '+421 *** *** ***', email: 'k*****@***.sk', cars: 'VW Passat 2017', visits: 5, lastVisit: '7.4.2026', totalSpent: 890 },
  { id: 3, name: 'Klient #3', phone: '+421 *** *** ***', email: 'k*****@***.sk', cars: 'BMW 320d 2020', visits: 12, lastVisit: '7.4.2026', totalSpent: 3450 },
  { id: 4, name: 'Klient #4', phone: '+421 *** *** ***', email: 'k*****@***.sk', cars: 'Toyota Corolla 2021', visits: 3, lastVisit: '7.4.2026', totalSpent: 540 },
  { id: 5, name: 'Klient #5', phone: '+421 *** *** ***', email: 'k*****@***.sk', cars: 'Ford Focus 2016', visits: 7, lastVisit: '6.4.2026', totalSpent: 1680 },
  { id: 6, name: 'Klient #6', phone: '+421 *** *** ***', email: 'k*****@***.sk', cars: 'Audi A4 2018', visits: 9, lastVisit: '8.4.2026', totalSpent: 2210 },
  { id: 7, name: 'Klient #7', phone: '+421 *** *** ***', email: 'k*****@***.sk', cars: 'Mercedes C220 2022', visits: 2, lastVisit: '8.4.2026', totalSpent: 720 },
  { id: 8, name: 'Klient #8', phone: '+421 *** *** ***', email: 'k*****@***.sk', cars: 'Peugeot 308 2015', visits: 15, lastVisit: '5.4.2026', totalSpent: 4120 },
];

const mechanics = [
  { name: 'Mechanik A', role: 'Vedúci mechanik', load: 85, orders: 4, color: C.accent },
  { name: 'Mechanik B', role: 'Mechanik', load: 70, orders: 3, color: C.blue },
  { name: 'Mechanik C', role: 'Mechanik', load: 55, orders: 3, color: C.purple },
  { name: 'Mechanik D', role: 'Elektrikár / Diagnostik', load: 40, orders: 2, color: C.yellow },
];

const initialMessages = [
  { role: 'assistant', text: 'Dobrý deň! Som AI asistent AutoServis Centrum. Čím vám môžem pomôcť? Môžem diagnostikovať poruchy, navrhnúť opravy alebo odhadnúť náklady.' },
  { role: 'user', text: 'Zákazník prišiel so Škodou Octavia 2018, svieti mu kontrolka motora — P0420. Čo to môže byť?' },
  { role: 'assistant', text: 'Chybový kód P0420 — "Catalyst System Efficiency Below Threshold (Bank 1)" — znamená, že katalyzátor nedosahuje požadovanú účinnosť.\n\n**Možné príčiny:**\n• Opotrebovaný alebo poškodený katalyzátor\n• Chybný lambda senzor (pred alebo za katalyzátorom)\n• Úniky výfukových plynov pred katalyzátorom\n• Bohatá/chudobná zmes — problém so vstrekovaním\n\n**Odporúčaný postup:**\n1. Skontrolovať oba lambda senzory (odpor, napätie)\n2. Vizuálna kontrola výfukového potrubia na prasklinách\n3. Ak senzory OK → pravdepodobne výmena katalyzátora\n\n**Odhadované náklady:**\n• Lambda senzor: 80–150 €\n• Katalyzátor Octavia 1.6 TDI: 280–450 € (diel + práca)' },
  { role: 'user', text: 'Díky! Koľko trvá výmena katalyzátora priemerne?' },
  { role: 'assistant', text: 'Na Škode Octavia (1.4 TSI / 1.6 TDI, generácia 2013–2020) výmena katalyzátora trvá **1,5 až 2,5 hodiny** pracovného času.\n\nAk sú skrutky zahrdzavené alebo zvarené, môže to trvať až 3 hodiny. Odporúčam pred zákazníkom počítať s **2 hodinami** — tak nepríde sklamanie.\n\nChcete, aby som vytvoril zákazku pre toto vozidlo?' },
];

// ─── ICONS ────────────────────────────────────────────────────────────────────
function Icon({ name, size = 18, color = 'currentColor' }: { name: string; size?: number; color?: string }) {
  const icons: Record<string, string> = {
    dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    orders: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    car: 'M8 17a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4zM5 17H3v-6l2-4h14l2 4v6h-2',
    customers: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    inventory: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    ai: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    send: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8',
    search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    bell: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    plus: 'M12 4v16m8-8H4',
    chevron: 'M9 5l7 7-7 7',
    wrench: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    sparkle: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={icons[name]} />
    </svg>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; dot: string }> = {
    'Hotová': { bg: 'rgba(16,185,129,0.12)', color: '#10b981', dot: '#10b981' },
    'V procese': { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', dot: '#3b82f6' },
    'Čaká': { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', dot: '#f59e0b' },
  };
  const s = map[status] || map['Čaká'];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, display: 'inline-block', flexShrink: 0 }} />
      {status}
    </span>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AutoServisCRM() {
  const [activeView, setActiveView] = useState<'dashboard' | 'orders' | 'vehicles' | 'customers' | 'inventory' | 'ai'>('dashboard');
  const [sidebarHover, setSidebarHover] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'orders', label: 'Zákazky', icon: 'orders' },
    { id: 'vehicles', label: 'Vozidlá', icon: 'car' },
    { id: 'customers', label: 'Zákazníci', icon: 'customers' },
    { id: 'inventory', label: 'Sklad', icon: 'inventory' },
    { id: 'ai', label: 'AI Asistent', icon: 'ai' },
  ] as const;

  function sendMessage() {
    const text = chatInput.trim();
    if (!text) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setChatInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Rozumiem. Prebehnem diagnostiku a navrhnem riešenie...\n\n**Analýza dokončená.** Podľa dostupných dát odporúčam:\n• Skontrolovať OBD kódy pomocou VCDS alebo ODIS\n• Overiť stav príslušných senzorov multimetrom\n• V prípade potreby objednať diel cez náš skladový systém\n\nChcete, aby som vytvoril zákazku alebo vyhľadal diel na sklade?'
      }]);
    }, 1800);
  }

  const filteredOrders = workOrders.filter(o =>
    searchQuery === '' ||
    o.car.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.spz.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCustomers = customers.filter(c =>
    searchQuery === '' ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.cars.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── LAYOUT ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', height: '100vh', background: C.bg, fontFamily: "'Inter', -apple-system, sans-serif", color: C.text, overflow: 'hidden' }}>

      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
      <aside style={{ width: 240, background: C.sidebar, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="wrench" size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>AutoServis</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.accent, lineHeight: 1.2, letterSpacing: '0.02em' }}>CENTRUM</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {navItems.map(item => {
            const isActive = activeView === item.id;
            const isHovered = sidebarHover === item.id && !isActive;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveView(item.id); setSearchQuery(''); }}
                onMouseEnter={() => setSidebarHover(item.id)}
                onMouseLeave={() => setSidebarHover(null)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: isActive ? C.accentGlow : isHovered ? 'rgba(255,255,255,0.04)' : 'transparent',
                  color: isActive ? C.accent : isHovered ? C.text : C.textMuted,
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.15s ease', textAlign: 'left', marginBottom: 2,
                  borderLeft: isActive ? `3px solid ${C.accent}` : '3px solid transparent',
                }}
              >
                <Icon name={item.icon} size={16} color={isActive ? C.accent : isHovered ? C.text : C.textMuted} />
                {item.label}
                {item.id === 'orders' && (
                  <span style={{ marginLeft: 'auto', background: C.accent, color: '#000', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10 }}>12</span>
                )}
                {item.id === 'ai' && (
                  <span style={{ marginLeft: 'auto', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 10 }}>AI</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Status indicator */}
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.accent, boxShadow: `0 0 6px ${C.accent}` }} />
            <span style={{ fontSize: 11, color: C.textMuted }}>Servis otvorený — 08:00–18:00</span>
          </div>

          {/* Powered by Vassweb */}
          <a
            href="https://vassweb.sk"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              padding: '7px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${C.border}`, textDecoration: 'none',
              transition: 'all 0.15s ease', cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = C.accent)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
          >
            <Icon name="sparkle" size={12} color={C.accent} />
            <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 500 }}>Powered by </span>
            <span style={{ fontSize: 10, color: C.accent, fontWeight: 700 }}>Vassweb</span>
          </a>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <header style={{ height: 58, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, background: C.sidebar, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>
              {navItems.find(n => n.id === activeView)?.label}
            </div>
            <div style={{ fontSize: 11, color: C.textMuted }}>Utorok, 7. apríl 2026</div>
          </div>

          {/* Search bar */}
          {(activeView === 'orders' || activeView === 'customers' || activeView === 'vehicles') && (
            <div style={{ position: 'relative', width: 280 }}>
              <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
                <Icon name="search" size={14} color={C.textMuted} />
              </div>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Hľadať zákazky, SPZ, zákazníka..."
                style={{
                  width: '100%', padding: '7px 12px 7px 32px', borderRadius: 8,
                  background: C.bg, border: `1px solid ${C.border}`, color: C.text,
                  fontSize: 12, outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = C.accent)}
                onBlur={e => (e.target.style.borderColor = C.border)}
              />
            </div>
          )}

          {/* New order button */}
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
              borderRadius: 8, background: C.accent, border: 'none', color: '#000',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = C.accentDark)}
            onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
          >
            <Icon name="plus" size={14} color="#000" />
            Nová zákazka
          </button>

          {/* Bell */}
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <Icon name="bell" size={18} color={C.textMuted} />
            <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: '50%', background: C.red, border: `2px solid ${C.sidebar}` }} />
          </div>

          {/* Avatar */}
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#000' }}>
            PH
          </div>
        </header>

        {/* ── VIEWS ──────────────────────────────────────────────────────────── */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

          {/* ── DISCLAIMER BANNER ──────────────────────────────────────────── */}
          <div style={{
            background: C.accentGlow2,
            border: `1px solid ${C.accentGlow}`,
            borderRadius: 8,
            padding: '8px 14px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.4 }}>
              Demo verzia — z dôvodu ochrany osobných údajov sú mená a kontaktné údaje zákazníkov anonymizované.
            </span>
          </div>

          {/* ===== DASHBOARD ===== */}
          {activeView === 'dashboard' && (
            <div>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Aktívne zákazky', value: '12', sub: '+3 dnes', icon: 'orders', color: C.accent },
                  { label: 'Vozidlá v servise', value: '8', sub: '2 čakajú na diely', icon: 'car', color: C.blue },
                  { label: 'Zákazníci', value: '340', sub: '+2 tento mesiac', icon: 'customers', color: C.purple },
                  { label: 'Tržby mesiac', value: '€15 200', sub: '+18% vs. minulý', icon: 'wrench', color: C.yellow },
                ].map((stat, i) => (
                  <div
                    key={i}
                    style={{
                      background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
                      padding: '18px 20px', cursor: 'default',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = stat.color; (e.currentTarget as HTMLElement).style.background = C.cardHover; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.background = C.card; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: `rgba(${stat.color === C.accent ? '16,185,129' : stat.color === C.blue ? '59,130,246' : stat.color === C.purple ? '139,92,246' : '245,158,11'},0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={stat.icon} size={18} color={stat.color} />
                      </div>
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: C.text, marginBottom: 4 }}>{stat.value}</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>{stat.label}</div>
                    <div style={{ fontSize: 11, color: stat.color, fontWeight: 500 }}>{stat.sub}</div>
                  </div>
                ))}
              </div>

              {/* Bottom row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>

                {/* Today's orders */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Dnešné zákazky</div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>7. apríl 2026</div>
                    </div>
                    <button
                      onClick={() => setActiveView('orders')}
                      style={{ fontSize: 11, color: C.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                    >
                      Zobraziť všetky →
                    </button>
                  </div>
                  <div style={{ padding: '8px 0' }}>
                    {todayOrders.map((order, i) => (
                      <div
                        key={order.id}
                        style={{
                          display: 'flex', alignItems: 'center', padding: '10px 20px', gap: 12,
                          borderBottom: i < todayOrders.length - 1 ? `1px solid ${C.border}` : 'none',
                          cursor: 'default', transition: 'background 0.15s',
                          background: hoveredRow === i ? C.cardHover : 'transparent',
                        }}
                        onMouseEnter={() => setHoveredRow(i)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: C.accentGlow2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon name="car" size={16} color={C.accent} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2 }}>{order.car} <span style={{ color: C.textMuted, fontWeight: 400 }}>({order.spz})</span></div>
                          <div style={{ fontSize: 11, color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.customer} · {order.service}</div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ marginBottom: 4 }}><StatusBadge status={order.status} /></div>
                          <div style={{ fontSize: 11, color: C.textMuted }}>€{order.cost}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mechanic workload */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Vyťaženosť mechanikov</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>Aktuálny stav</div>
                  </div>
                  <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {mechanics.map((m, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{m.name}</div>
                            <div style={{ fontSize: 11, color: C.textMuted }}>{m.role} · {m.orders} zákazky</div>
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.load}%</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 3, background: C.bg, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${m.load}%`, borderRadius: 3, background: `linear-gradient(90deg, ${m.color}, ${m.color}bb)`, transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick stats */}
                  <div style={{ margin: '0 16px 16px', padding: '12px 14px', borderRadius: 8, background: C.accentGlow2, border: `1px solid ${C.accentGlow}` }}>
                    <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>Dnešný výkon</div>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div><div style={{ fontSize: 18, fontWeight: 700, color: C.accent }}>3</div><div style={{ fontSize: 10, color: C.textMuted }}>Hotové</div></div>
                      <div><div style={{ fontSize: 18, fontWeight: 700, color: C.blue }}>3</div><div style={{ fontSize: 10, color: C.textMuted }}>V procese</div></div>
                      <div><div style={{ fontSize: 18, fontWeight: 700, color: C.yellow }}>6</div><div style={{ fontSize: 10, color: C.textMuted }}>Čakajú</div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== WORK ORDERS ===== */}
          {activeView === 'orders' && (
            <div>
              {/* Summary bar */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Všetky', count: workOrders.length, color: C.textMuted, active: true },
                  { label: 'Hotová', count: workOrders.filter(o => o.status === 'Hotová').length, color: C.accent, active: false },
                  { label: 'V procese', count: workOrders.filter(o => o.status === 'V procese').length, color: C.blue, active: false },
                  { label: 'Čaká', count: workOrders.filter(o => o.status === 'Čaká').length, color: C.yellow, active: false },
                ].map((tab, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, background: tab.active ? C.accentGlow2 : C.card, border: `1px solid ${tab.active ? C.accent : C.border}`, cursor: 'pointer', fontSize: 12, color: tab.active ? C.accent : C.textMuted, fontWeight: tab.active ? 600 : 400 }}>
                    {tab.label}
                    <span style={{ background: tab.active ? C.accentGlow : C.border, padding: '1px 6px', borderRadius: 10, fontSize: 11, color: tab.active ? C.accent : C.textMuted }}>{tab.count}</span>
                  </div>
                ))}
                <div style={{ marginLeft: 'auto', fontSize: 12, color: C.textMuted, display: 'flex', alignItems: 'center' }}>
                  {filteredOrders.length} zákazok
                </div>
              </div>

              {/* Table */}
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                        {['Zákazka', 'Vozidlo', 'SPZ', 'Zákazník', 'Typ servisu', 'Mechanik', 'Cena', 'Dátum', 'Stav'].map(h => (
                          <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order, i) => (
                        <tr
                          key={order.id}
                          style={{
                            borderBottom: i < filteredOrders.length - 1 ? `1px solid ${C.border}` : 'none',
                            background: hoveredRow === i + 100 ? C.cardHover : 'transparent',
                            transition: 'background 0.15s', cursor: 'pointer',
                          }}
                          onMouseEnter={() => setHoveredRow(i + 100)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontFamily: 'monospace', fontSize: 11, color: C.accent, background: C.accentGlow2, padding: '2px 7px', borderRadius: 5 }}>{order.id}</span>
                          </td>
                          <td style={{ padding: '12px 14px', color: C.text, fontWeight: 500, whiteSpace: 'nowrap' }}>
                            {order.car} <span style={{ color: C.textMuted, fontSize: 11, fontWeight: 400 }}>({order.year})</span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontFamily: 'monospace', fontSize: 12, color: C.textMuted, background: 'rgba(255,255,255,0.05)', padding: '2px 7px', borderRadius: 5, letterSpacing: '0.05em' }}>{order.spz}</span>
                          </td>
                          <td style={{ padding: '12px 14px', color: C.text, whiteSpace: 'nowrap' }}>{order.customer}</td>
                          <td style={{ padding: '12px 14px', color: C.textMuted, maxWidth: 220 }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.service}</div>
                          </td>
                          <td style={{ padding: '12px 14px', color: C.textMuted, whiteSpace: 'nowrap', fontSize: 12 }}>{order.mechanic}</td>
                          <td style={{ padding: '12px 14px', color: C.text, fontWeight: 600, whiteSpace: 'nowrap' }}>€{order.cost}</td>
                          <td style={{ padding: '12px 14px', color: C.textMuted, fontSize: 12, whiteSpace: 'nowrap' }}>{order.date}</td>
                          <td style={{ padding: '12px 14px' }}><StatusBadge status={order.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredOrders.length === 0 && (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: C.textMuted }}>
                    Žiadne zákazky nezodpovedajú hľadaniu
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== VEHICLES ===== */}
          {activeView === 'vehicles' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                {workOrders.map((order, i) => (
                  <div
                    key={order.id}
                    style={{
                      background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.accent; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 10, background: C.accentGlow2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon name="car" size={20} color={C.accent} />
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{order.car}</div>
                          <div style={{ fontSize: 11, color: C.textMuted }}>{order.year}</div>
                        </div>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 12, fontFamily: 'monospace', color: C.accent, background: C.accentGlow2, padding: '3px 9px', borderRadius: 6, letterSpacing: '0.08em', fontWeight: 700 }}>{order.spz}</span>
                    </div>
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, color: C.textMuted }}>Zákazník</span>
                        <span style={{ fontSize: 11, color: C.text, fontWeight: 500 }}>{order.customer}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, color: C.textMuted }}>Servis</span>
                        <span style={{ fontSize: 11, color: C.text, maxWidth: 160, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.service}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, color: C.textMuted }}>Mechanik</span>
                        <span style={{ fontSize: 11, color: C.textMuted }}>{order.mechanic}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, color: C.textMuted }}>Cena</span>
                        <span style={{ fontSize: 12, color: C.accent, fontWeight: 700 }}>€{order.cost}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== CUSTOMERS ===== */}
          {activeView === 'customers' && (
            <div>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Databáza zákazníkov</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{filteredCustomers.length} zákazníkov</div>
                  </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                        {['#', 'Zákazník', 'Kontakt', 'Vozidlo', 'Návštevy', 'Posledná návšteva', 'Celk. útrata', 'Akcia'].map(h => (
                          <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((c, i) => (
                        <tr
                          key={c.id}
                          style={{
                            borderBottom: i < filteredCustomers.length - 1 ? `1px solid ${C.border}` : 'none',
                            background: hoveredRow === i + 200 ? C.cardHover : 'transparent',
                            transition: 'background 0.15s', cursor: 'pointer',
                          }}
                          onMouseEnter={() => setHoveredRow(i + 200)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td style={{ padding: '13px 16px', color: C.textDim, fontFamily: 'monospace', fontSize: 11 }}>#{String(c.id).padStart(3, '0')}</td>
                          <td style={{ padding: '13px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${C.accent}33, ${C.accentDark}33)`, border: `1px solid ${C.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: C.accent, flexShrink: 0 }}>
                                {c.name.replace('Klient #', 'K').slice(0, 2)}
                              </div>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{c.name}</div>
                                <div style={{ fontSize: 11, color: C.textMuted }}>{c.email}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '13px 16px', color: C.textMuted, fontSize: 12, whiteSpace: 'nowrap' }}>{c.phone}</td>
                          <td style={{ padding: '13px 16px', color: C.text, fontSize: 12 }}>{c.cars}</td>
                          <td style={{ padding: '13px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{c.visits}×</div>
                              <div style={{ height: 4, width: Math.min(c.visits * 5, 60), borderRadius: 2, background: C.accent, opacity: 0.6 }} />
                            </div>
                          </td>
                          <td style={{ padding: '13px 16px', color: C.textMuted, fontSize: 12, whiteSpace: 'nowrap' }}>{c.lastVisit}</td>
                          <td style={{ padding: '13px 16px', color: C.accent, fontWeight: 700, fontSize: 13 }}>€{c.totalSpent.toLocaleString()}</td>
                          <td style={{ padding: '13px 16px' }}>
                            <button
                              style={{ padding: '5px 12px', borderRadius: 6, background: C.accentGlow2, border: `1px solid ${C.accent}33`, color: C.accent, fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                              onMouseEnter={e => { (e.currentTarget).style.background = C.accentGlow; }}
                              onMouseLeave={e => { (e.currentTarget).style.background = C.accentGlow2; }}
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== INVENTORY ===== */}
          {activeView === 'inventory' && (
            <div>
              {/* Summary cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                {[
                  { label: 'Položky na sklade', value: '1 248', icon: 'inventory', color: C.accent },
                  { label: 'Nízky stav (< 5 ks)', value: '14', icon: 'orders', color: C.yellow },
                  { label: 'Objednané', value: '7', icon: 'car', color: C.blue },
                  { label: 'Hodnota skladu', value: '€42 800', icon: 'wrench', color: C.purple },
                ].map((s, i) => (
                  <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Inventory table */}
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Skladové položky — Rýchloobrátkový tovar</div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                      {['Kód', 'Názov položky', 'Kategória', 'Počet (ks)', 'Cena/ks', 'Min. stav', 'Stav'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { code: 'OIL-5W30', name: 'Motorový olej 5W-30 (5L)', cat: 'Oleje', qty: 48, price: 34, min: 10 },
                      { code: 'FLT-OIL01', name: 'Olejový filter BOSCH', cat: 'Filtre', qty: 35, price: 12, min: 15 },
                      { code: 'FLT-AIR02', name: 'Vzduchový filter MANN', cat: 'Filtre', qty: 22, price: 18, min: 10 },
                      { code: 'BRK-PAD-F', name: 'Brzdové platničky predné BREMBO', cat: 'Brzdy', qty: 8, price: 68, min: 5 },
                      { code: 'BRK-DSC-F', name: 'Brzdový kotúč predný', cat: 'Brzdy', qty: 4, price: 95, min: 4 },
                      { code: 'SPK-NGK01', name: 'Sviečky NGK (sada 4ks)', cat: 'Zapaľovanie', qty: 18, price: 32, min: 8 },
                      { code: 'TIM-SKF01', name: 'Rozvodový remeň SKF (kit)', cat: 'Rozvod', qty: 6, price: 145, min: 3 },
                      { code: 'COL-GLY01', name: 'Chladiaца kvapalina 1L', cat: 'Kvapaliny', qty: 3, price: 8, min: 10 },
                      { code: 'WPU-BOSCH', name: 'Vodná pumpa BOSCH', cat: 'Chladenie', qty: 5, price: 72, min: 3 },
                      { code: 'ACF-134A', name: 'Chladivo AC R134a 500g', cat: 'Klimatizácia', qty: 12, price: 22, min: 6 },
                    ].map((item, i) => {
                      const isLow = item.qty <= item.min;
                      return (
                        <tr key={i} style={{ borderBottom: i < 9 ? `1px solid ${C.border}` : 'none', background: hoveredRow === i + 300 ? C.cardHover : 'transparent', transition: 'background 0.15s', cursor: 'pointer' }}
                          onMouseEnter={() => setHoveredRow(i + 300)}
                          onMouseLeave={() => setHoveredRow(null)}>
                          <td style={{ padding: '11px 16px', fontFamily: 'monospace', fontSize: 11, color: C.textMuted }}>{item.code}</td>
                          <td style={{ padding: '11px 16px', color: C.text, fontWeight: 500 }}>{item.name}</td>
                          <td style={{ padding: '11px 16px' }}><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: 'rgba(139,92,246,0.1)', color: C.purple }}>{item.cat}</span></td>
                          <td style={{ padding: '11px 16px', color: isLow ? C.yellow : C.text, fontWeight: 600 }}>{item.qty} ks</td>
                          <td style={{ padding: '11px 16px', color: C.textMuted }}>€{item.price}</td>
                          <td style={{ padding: '11px 16px', color: C.textMuted, fontSize: 12 }}>{item.min} ks</td>
                          <td style={{ padding: '11px 16px' }}>
                            {isLow
                              ? <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: 'rgba(245,158,11,0.12)', color: C.yellow, fontWeight: 600 }}>Nízky stav</span>
                              : <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: 'rgba(16,185,129,0.1)', color: C.accent, fontWeight: 600 }}>OK</span>
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== AI ASISTENT ===== */}
          {activeView === 'ai' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 58px - 48px)', maxHeight: 700 }}>

              {/* AI header */}
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="ai" size={22} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>AI Mechanik Asistent</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>Diagnostika porúch · Odhad nákladov · Tvorba zákaziek · Vyhľadávanie v sklade</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.accent, animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: 12, color: C.accent }}>Online</span>
                </div>
              </div>

              {/* Capability chips */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {['Diagnostika OBD kódov', 'Odhad nákladov opravy', 'Vytvorenie zákazky', 'Vyhľadávanie v sklade', 'História vozidla'].map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => setChatInput(chip)}
                    style={{ padding: '5px 12px', borderRadius: 20, background: C.card, border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 11, cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget).style.borderColor = C.accent; (e.currentTarget).style.color = C.accent; }}
                    onMouseLeave={e => { (e.currentTarget).style.borderColor = C.border; (e.currentTarget).style.color = C.textMuted; }}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Chat messages */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16, paddingRight: 4 }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 10 }}>
                    {msg.role === 'assistant' && (
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                        <Icon name="sparkle" size={14} color="#fff" />
                      </div>
                    )}
                    <div style={{
                      maxWidth: '72%',
                      padding: '10px 14px',
                      borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                      background: msg.role === 'user' ? `linear-gradient(135deg, ${C.accent}, ${C.accentDark})` : C.card,
                      border: msg.role === 'user' ? 'none' : `1px solid ${C.border}`,
                      color: msg.role === 'user' ? '#000' : C.text,
                      fontSize: 13,
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                    }}>
                      {msg.text.split('\n').map((line, li) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <div key={li} style={{ fontWeight: 700, color: msg.role === 'user' ? '#000' : C.accent, marginBottom: 4 }}>{line.replace(/\*\*/g, '')}</div>;
                        }
                        if (line.startsWith('• ')) {
                          return <div key={li} style={{ paddingLeft: 8, marginBottom: 2, color: msg.role === 'user' ? '#000' : C.text }}>• {line.slice(2)}</div>;
                        }
                        if (/^\d+\./.test(line)) {
                          return <div key={li} style={{ paddingLeft: 8, marginBottom: 2 }}>{line}</div>;
                        }
                        return line ? <div key={li} style={{ marginBottom: 2 }}>{line}</div> : <div key={li} style={{ height: 4 }} />;
                      })}
                    </div>
                    {msg.role === 'user' && (
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, fontSize: 11, fontWeight: 700, color: '#000' }}>
                        PH
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name="sparkle" size={14} color="#fff" />
                    </div>
                    <div style={{ padding: '12px 16px', background: C.card, border: `1px solid ${C.border}`, borderRadius: '12px 12px 12px 4px', display: 'flex', gap: 5, alignItems: 'center' }}>
                      {[0, 1, 2].map(d => (
                        <div key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, opacity: 0.6, animation: `bounce${d} 1.2s ease-in-out infinite`, animationDelay: `${d * 0.2}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Napíšte otázku... (napr. 'OBD kód P0300', 'Odhad výmeny spojky Octavia 2017')"
                  style={{
                    flex: 1, padding: '12px 16px', borderRadius: 10,
                    background: C.card, border: `1px solid ${C.border}`, color: C.text,
                    fontSize: 13, outline: 'none', transition: 'border-color 0.15s',
                  }}
                  onFocus={e => (e.target.style.borderColor = C.accent)}
                  onBlur={e => (e.target.style.borderColor = C.border)}
                />
                <button
                  onClick={sendMessage}
                  disabled={!chatInput.trim() || isTyping}
                  style={{
                    padding: '12px 20px', borderRadius: 10,
                    background: chatInput.trim() && !isTyping ? C.accent : C.card,
                    border: `1px solid ${chatInput.trim() && !isTyping ? C.accent : C.border}`,
                    color: chatInput.trim() && !isTyping ? '#000' : C.textDim,
                    cursor: chatInput.trim() && !isTyping ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600,
                  }}
                >
                  <Icon name="send" size={15} color={chatInput.trim() && !isTyping ? '#000' : C.textDim} />
                  Odoslať
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes bounce0 { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
        @keyframes bounce1 { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
        @keyframes bounce2 { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1f2d3d; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #10b981; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
