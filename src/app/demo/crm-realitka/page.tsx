'use client';

import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type View = 'dashboard' | 'nehnutelnosti' | 'klienti' | 'obhliadky' | 'zmluvy' | 'ai';

interface Property {
  id: number;
  type: string;
  location: string;
  district: string;
  price: number;
  area: number;
  rooms: string;
  status: 'Aktívna' | 'Rezervovaná' | 'Predaná';
  floor?: string;
  listed: string;
  agent: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  interest: string;
  budget: string;
  status: 'Aktívny' | 'Pasívny' | 'VIP';
  since: string;
  lastContact: string;
}

interface Viewing {
  id: number;
  property: string;
  client: string;
  agent: string;
  date: string;
  time: string;
  status: 'Potvrdená' | 'Čaká sa' | 'Prebehla' | 'Zrušená';
  note: string;
}

interface Contract {
  id: number;
  property: string;
  buyer: string;
  seller: string;
  type: 'Rezervačná zmluva' | 'Kúpna zmluva' | 'Nájomná zmluva';
  value: number;
  date: string;
  status: 'Aktívna' | 'Podpísaná' | 'Ukončená';
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  time: string;
}

// ─── Fake Data ────────────────────────────────────────────────────────────────

const PROPERTIES: Property[] = [
  { id: 1, type: '3-izbový byt', location: 'Lokalita A', district: 'Okres 1', price: 189000, area: 74, rooms: '3+1', status: 'Aktívna', floor: '4/8', listed: '15.3.2026', agent: 'Agent 1' },
  { id: 2, type: 'Rodinný dom', location: 'Lokalita B', district: 'Okres 2', price: 485000, area: 210, rooms: '5+kk', status: 'Rezervovaná', listed: '2.2.2026', agent: 'Agent 2' },
  { id: 3, type: '2-izbový byt', location: 'Lokalita C', district: 'Okres 3', price: 162000, area: 52, rooms: '2+1', status: 'Aktívna', floor: '2/6', listed: '20.3.2026', agent: 'Agent 1' },
  { id: 4, type: 'Penthouse', location: 'Lokalita D', district: 'Okres 4', price: 890000, area: 185, rooms: '4+kk', status: 'Aktívna', floor: '8/8', listed: '10.1.2026', agent: 'Agent 3' },
  { id: 5, type: '1-izbový byt', location: 'Lokalita E', district: 'Okres 5', price: 115000, area: 38, rooms: '1+1', status: 'Predaná', floor: '3/9', listed: '5.1.2026', agent: 'Agent 4' },
  { id: 6, type: 'Komerčný priestor', location: 'Lokalita F', district: 'Okres 6', price: 320000, area: 95, rooms: 'kancelária', status: 'Aktívna', floor: '1/5', listed: '18.3.2026', agent: 'Agent 3' },
];

const CLIENTS: Client[] = [
  { id: 1, name: 'Klient #1', email: 'k*****@***.sk', phone: '+421 *** *** ***', interest: '3-izbový byt', budget: '160 000 – 200 000 €', status: 'VIP', since: 'jan 2026', lastContact: 'dnes' },
  { id: 2, name: 'Klient #2', email: 'k*****@***.sk', phone: '+421 *** *** ***', interest: 'Rodinný dom', budget: '350 000 – 500 000 €', status: 'Aktívny', since: 'feb 2026', lastContact: 'včera' },
  { id: 3, name: 'Klient #3', email: 'k*****@***.sk', phone: '+421 *** *** ***', interest: '2-izbový byt', budget: '140 000 – 170 000 €', status: 'Aktívny', since: 'mar 2026', lastContact: '3 dni' },
  { id: 4, name: 'Klient #4', email: 'k*****@***.sk', phone: '+421 *** *** ***', interest: 'Investičný byt', budget: '200 000 – 350 000 €', status: 'VIP', since: 'nov 2025', lastContact: 'dnes' },
  { id: 5, name: 'Klient #5', email: 'k*****@***.sk', phone: '+421 *** *** ***', interest: 'Kancelárie', budget: '280 000 – 400 000 €', status: 'Aktívny', since: 'mar 2026', lastContact: '1 týždeň' },
  { id: 6, name: 'Klient #6', email: 'k*****@***.sk', phone: '+421 *** *** ***', interest: 'Garsonka alebo 1-izbák', budget: '100 000 – 130 000 €', status: 'Pasívny', since: 'jan 2026', lastContact: '2 týždne' },
  { id: 7, name: 'Klient #7', email: 'k*****@***.sk', phone: '+421 *** *** ***', interest: 'Penthouse', budget: '700 000 – 1 000 000 €', status: 'VIP', since: 'dec 2025', lastContact: 'dnes' },
  { id: 8, name: 'Klient #8', email: 'k*****@***.sk', phone: '+421 *** *** ***', interest: 'Rodinný dom', budget: '400 000 – 600 000 €', status: 'Aktívny', since: 'feb 2026', lastContact: '4 dni' },
];

const VIEWINGS: Viewing[] = [
  { id: 1, property: '3-izb. byt, lokalita A', client: 'Klient #1', agent: 'Agent 1', date: '7.4.2026', time: '10:00', status: 'Potvrdená', note: 'Klient má záujem aj o susednú jednotku' },
  { id: 2, property: 'Rodinný dom, lokalita B', client: 'Klient #2', agent: 'Agent 2', date: '7.4.2026', time: '14:30', status: 'Potvrdená', note: 'Prísť 10 min skôr, záhrada' },
  { id: 3, property: 'Penthouse, lokalita D', client: 'Klient #7', agent: 'Agent 3', date: '8.4.2026', time: '11:00', status: 'Čaká sa', note: 'Čaká sa na potvrdenie klienta' },
  { id: 4, property: '2-izb. byt, lokalita C', client: 'Klient #3', agent: 'Agent 1', date: '9.4.2026', time: '16:00', status: 'Čaká sa', note: '' },
  { id: 5, property: 'Komerčný priestor, lokalita F', client: 'Klient #5', agent: 'Agent 3', date: '5.4.2026', time: '09:00', status: 'Prebehla', note: 'Klient má záujem, rokujeme o cene' },
  { id: 6, property: '1-izb. byt, lokalita E', client: 'Klient #6', agent: 'Agent 4', date: '3.4.2026', time: '13:00', status: 'Zrušená', note: 'Klient zrušil deň vopred' },
];

const CONTRACTS: Contract[] = [
  { id: 1, property: '1-izb. byt, lokalita E', buyer: 'Klient #6', seller: 'Predávajúci #1', type: 'Kúpna zmluva', value: 115000, date: '1.4.2026', status: 'Podpísaná' },
  { id: 2, property: 'Rodinný dom, lokalita B', buyer: 'Klient #2', seller: 'Spoločnosť #1', type: 'Rezervačná zmluva', value: 485000, date: '28.3.2026', status: 'Aktívna' },
  { id: 3, property: 'Kancelárie, lokalita C', buyer: 'Spoločnosť #2', seller: 'Predávajúci #2', type: 'Nájomná zmluva', value: 2800, date: '15.3.2026', status: 'Aktívna' },
  { id: 4, property: '4-izb. byt, lokalita A', buyer: 'Klient #9', seller: 'Predávajúci #3', type: 'Kúpna zmluva', value: 265000, date: '10.2.2026', status: 'Ukončená' },
];

const ACTIVITY = [
  { icon: '🏠', text: 'Nová obhliadka potvrdená — Klient #1, lokalita A', time: 'pred 12 min' },
  { icon: '👤', text: 'Nový klient registrovaný — Klient #8', time: 'pred 45 min' },
  { icon: '📄', text: 'Zmluva podpísaná — 1-izb. byt, lokalita E, 115 000 €', time: 'pred 2 hod' },
  { icon: '🏠', text: 'Nová nehnuteľnosť pridaná — 3-izb. byt, lokalita A', time: 'dnes 08:14' },
  { icon: '💬', text: 'Dopyt cez web — záujem o byty v lokalite C', time: 'včera 18:42' },
  { icon: '✅', text: 'Obhliadka prebehla úspešne — Komerčný priestor, lokalita F', time: 'včera 09:05' },
];

const MONTHLY_SALES = [
  { month: 'Okt', value: 45, amount: '€62k' },
  { month: 'Nov', value: 60, amount: '€81k' },
  { month: 'Dec', value: 38, amount: '€51k' },
  { month: 'Jan', value: 72, amount: '€97k' },
  { month: 'Feb', value: 55, amount: '€74k' },
  { month: 'Mar', value: 85, amount: '€114k' },
  { month: 'Apr', value: 66, amount: '€89k' },
];

const DEMO_CHAT: ChatMessage[] = [
  { role: 'user', text: 'Aké byty máme aktuálne dostupné v lokalite A do 200 000 €?', time: '10:02' },
  { role: 'ai', text: 'V lokalite A máme momentálne 2 dostupné byty do 200 000 €:\n\n**1. 3-izbový byt** (74 m², 4. poschodie)\n   Cena: **189 000 €** | Agent: Agent 1\n\n**2. 2-izbový byt** (61 m², 2. poschodie)\n   Cena: **168 000 €** | Agent: Agent 4\n\nObidva byty sú v stave Aktívna. Chcete, aby som naplánoval obhliadky?', time: '10:02' },
  { role: 'user', text: 'Áno, prosím naplánuj obhliadku pre Klienta #1 na najbližší možný termín.', time: '10:03' },
  { role: 'ai', text: 'Skontroloval som kalendár Agenta A aj dostupnosť Klienta #1.\n\nNajbližší voľný spoločný termín:\n**Pondelok 7. apríla 2026 o 10:00**\n\nObhliadka je naplánovaná a potvrdzovací email bol odoslaný klientovi. Udalosť pridaná do kalendára.\n\nChcete tiež poslať pripomienku 24 hodín pred obhliadkou?', time: '10:03' },
  { role: 'user', text: 'Výborne. Aký je celkový obrat za Q1 2026?', time: '10:05' },
  { role: 'ai', text: 'Za Q1 2026 (január – marec) dosiahla ProDom tieto výsledky:\n\n**Celkový obrat: 285 000 €**\n- Január: 97 000 € (4 transakcie)\n- Február: 74 000 € (3 transakcie)\n- Marec: 114 000 € (5 transakcií)\n\n**Medzikvartálny rast: +18 % oproti Q4 2025**\nPočet predaných nehnuteľností: 12\nPriemerná hodnota transakcie: 23 750 €\n\nNajúspešnejší agent: Agent 3 (4 predaje, 118 000 €)', time: '10:05' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  if (n < 10000) return `€${n.toLocaleString('sk-SK')}/mes`;
  return `€${n.toLocaleString('sk-SK')}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon, color }: { label: string; value: string; sub: string; icon: string; color: string }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? '#1e293b' : '#1a2234',
        border: `1px solid ${hover ? color : '#2a3a55'}`,
        borderRadius: 12,
        padding: '22px 24px',
        flex: 1,
        minWidth: 160,
        transition: 'all 0.2s ease',
        cursor: 'default',
        boxShadow: hover ? `0 4px 24px ${color}22` : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 8, fontWeight: 500 }}>{label}</div>
          <div style={{ color: '#f1f5f9', fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px' }}>{value}</div>
          <div style={{ color: color, fontSize: 12, marginTop: 6, fontWeight: 500 }}>{sub}</div>
        </div>
        <div style={{ background: `${color}1a`, borderRadius: 10, padding: '10px 12px', fontSize: 22 }}>{icon}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    'Aktívna': { bg: '#0f2a1a', color: '#22c55e' },
    'Aktívny': { bg: '#0f2a1a', color: '#22c55e' },
    'Rezervovaná': { bg: '#1a2a0f', color: '#eab308' },
    'Predaná': { bg: '#1a1a2e', color: '#8b5cf6' },
    'Podpísaná': { bg: '#0d2235', color: '#3b82f6' },
    'Ukončená': { bg: '#2a1a1a', color: '#f87171' },
    'Pasívny': { bg: '#1e2130', color: '#94a3b8' },
    'VIP': { bg: '#2a1a00', color: '#f59e0b' },
    'Potvrdená': { bg: '#0f2a1a', color: '#22c55e' },
    'Čaká sa': { bg: '#1a2a0f', color: '#eab308' },
    'Prebehla': { bg: '#1a1a2e', color: '#8b5cf6' },
    'Zrušená': { bg: '#2a1a1a', color: '#f87171' },
  };
  const s = map[status] ?? { bg: '#1e293b', color: '#94a3b8' };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
}

// ─── Views ────────────────────────────────────────────────────────────────────

function DashboardView() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, margin: 0 }}>Prehľad</h1>
        <p style={{ color: '#64748b', margin: '6px 0 0', fontSize: 14 }}>Pondelok, 7. apríl 2026</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
        <StatCard label="Aktívne ponuky" value="24" sub="+3 tento týždeň" icon="🏠" color="#3b82f6" />
        <StatCard label="Klienti" value="156" sub="+8 tento mesiac" icon="👥" color="#22c55e" />
        <StatCard label="Obhliadky / mesiac" value="18" sub="6 tento týždeň" icon="📅" color="#f59e0b" />
        <StatCard label="Tržby" value="€89 400" sub="↑ 18% vs. minulý mesiac" icon="💶" color="#8b5cf6" />
      </div>

      {/* Bottom grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Activity */}
        <div style={{ background: '#1a2234', borderRadius: 12, padding: 24, border: '1px solid #2a3a55' }}>
          <h3 style={{ color: '#f1f5f9', margin: '0 0 18px', fontSize: 15, fontWeight: 600 }}>Posledná aktivita</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.4 }}>{a.text}</div>
                  <div style={{ color: '#475569', fontSize: 11, marginTop: 3 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div style={{ background: '#1a2234', borderRadius: 12, padding: 24, border: '1px solid #2a3a55' }}>
          <h3 style={{ color: '#f1f5f9', margin: '0 0 6px', fontSize: 15, fontWeight: 600 }}>Mesačné tržby</h3>
          <p style={{ color: '#475569', fontSize: 12, margin: '0 0 24px' }}>Posledných 7 mesiacov</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140 }}>
            {MONTHLY_SALES.map((m, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ color: '#64748b', fontSize: 10 }}>{m.amount}</div>
                <div
                  style={{
                    width: '100%',
                    height: `${m.value}%`,
                    background: i === MONTHLY_SALES.length - 1
                      ? 'linear-gradient(to top, #1d4ed8, #3b82f6)'
                      : 'linear-gradient(to top, #1e3a5f, #2563eb55)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.4s ease',
                    minHeight: 4,
                    border: i === MONTHLY_SALES.length - 1 ? '1px solid #3b82f6' : '1px solid #1e3a5f',
                  }}
                />
                <div style={{ color: i === MONTHLY_SALES.length - 1 ? '#3b82f6' : '#475569', fontSize: 11, fontWeight: i === MONTHLY_SALES.length - 1 ? 700 : 400 }}>
                  {m.month}
                </div>
              </div>
            ))}
          </div>

          {/* Quick stats below chart */}
          <div style={{ display: 'flex', gap: 16, marginTop: 20, paddingTop: 20, borderTop: '1px solid #2a3a55' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ color: '#3b82f6', fontSize: 18, fontWeight: 700 }}>12</div>
              <div style={{ color: '#475569', fontSize: 11 }}>Predajov Q1</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ color: '#22c55e', fontSize: 18, fontWeight: 700 }}>+18%</div>
              <div style={{ color: '#475569', fontSize: 11 }}>Rast MoM</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ color: '#f59e0b', fontSize: 18, fontWeight: 700 }}>23d</div>
              <div style={{ color: '#475569', fontSize: 11 }}>Priem. predaj</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertiesView() {
  const [filter, setFilter] = useState<'Všetky' | 'Aktívna' | 'Rezervovaná' | 'Predaná'>('Všetky');
  const [search, setSearch] = useState('');

  const filtered = PROPERTIES.filter(p => {
    const matchFilter = filter === 'Všetky' || p.status === filter;
    const matchSearch = p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const filters: Array<'Všetky' | 'Aktívna' | 'Rezervovaná' | 'Predaná'> = ['Všetky', 'Aktívna', 'Rezervovaná', 'Predaná'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, margin: 0 }}>Nehnuteľnosti</h1>
          <p style={{ color: '#64748b', margin: '6px 0 0', fontSize: 14 }}>{PROPERTIES.length} nehnuteľností celkom</p>
        </div>
        <button style={{
          background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
          color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px',
          fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          + Pridať nehnuteľnosť
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? '#3b82f6' : '#1a2234',
              color: filter === f ? '#fff' : '#94a3b8',
              border: `1px solid ${filter === f ? '#3b82f6' : '#2a3a55'}`,
              borderRadius: 8, padding: '7px 16px', fontSize: 13,
              fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
            }}
          >{f}</button>
        ))}
        <input
          type="text"
          placeholder="Hľadať podľa lokality alebo typu..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: '#1a2234', border: '1px solid #2a3a55', borderRadius: 8,
            color: '#f1f5f9', padding: '7px 14px', fontSize: 13, outline: 'none',
            marginLeft: 'auto', width: 280,
          }}
        />
      </div>

      {/* Property grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
      </div>
    </div>
  );
}

function PropertyCard({ property: p }: { property: Property }) {
  const [hover, setHover] = useState(false);
  const colorMap: Record<Property['status'], string> = {
    'Aktívna': '#22c55e',
    'Rezervovaná': '#eab308',
    'Predaná': '#8b5cf6',
  };
  const typeIcons: Record<string, string> = {
    'Rodinný dom': '🏡',
    'Penthouse': '🏙️',
    'Komerčný priestor': '🏢',
  };
  const icon = typeIcons[p.type] ?? '🏠';

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? '#1e293b' : '#1a2234',
        border: `1px solid ${hover ? '#3b82f6' : '#2a3a55'}`,
        borderRadius: 12, overflow: 'hidden',
        transition: 'all 0.2s ease',
        boxShadow: hover ? '0 4px 24px rgba(59,130,246,0.15)' : 'none',
        cursor: 'pointer',
      }}
    >
      {/* Image placeholder */}
      <div style={{
        height: 140,
        background: `linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
      }}>
        <div style={{ fontSize: 48, opacity: 0.6 }}>{icon}</div>
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <StatusBadge status={p.status} />
        </div>
        <div style={{
          position: 'absolute', bottom: 10, left: 10,
          background: '#0008', borderRadius: 6, padding: '3px 8px',
          color: '#94a3b8', fontSize: 11,
        }}>
          Pridané: {p.listed}
        </div>
      </div>

      <div style={{ padding: 18 }}>
        <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>{p.type}</div>
        <div style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{p.location}</div>
        <div style={{ color: '#64748b', fontSize: 12, marginBottom: 14 }}>{p.district}</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ color: '#3b82f6', fontSize: 20, fontWeight: 700 }}>{formatPrice(p.price)}</div>
          <div style={{ color: '#64748b', fontSize: 13 }}>{p.area} m²</div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ background: '#0f172a', border: '1px solid #2a3a55', color: '#94a3b8', borderRadius: 6, padding: '3px 10px', fontSize: 11 }}>
            {p.rooms}
          </span>
          {p.floor && (
            <span style={{ background: '#0f172a', border: '1px solid #2a3a55', color: '#94a3b8', borderRadius: 6, padding: '3px 10px', fontSize: 11 }}>
              {p.floor} posch.
            </span>
          )}
          <span style={{ background: '#0f172a', border: '1px solid #2a3a55', color: '#64748b', borderRadius: 6, padding: '3px 10px', fontSize: 11, marginLeft: 'auto' }}>
            {p.agent.split(' ')[0]}
          </span>
        </div>
      </div>
    </div>
  );
}

function ClientsView() {
  const [search, setSearch] = useState('');
  const filtered = CLIENTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.interest.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, margin: 0 }}>Klienti</h1>
          <p style={{ color: '#64748b', margin: '6px 0 0', fontSize: 14 }}>{CLIENTS.length} klientov celkom</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            placeholder="Hľadať klienta..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: '#1a2234', border: '1px solid #2a3a55', borderRadius: 8,
              color: '#f1f5f9', padding: '9px 14px', fontSize: 13, outline: 'none', width: 220,
            }}
          />
          <button style={{
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
            color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            + Nový klient
          </button>
        </div>
      </div>

      <div style={{ background: '#1a2234', border: '1px solid #2a3a55', borderRadius: 12, overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 1fr 0.8fr',
          padding: '12px 20px',
          background: '#0f172a',
          borderBottom: '1px solid #2a3a55',
        }}>
          {['Meno', 'Záujem / rozpočet', 'Kontakt', 'Posledný kontakt', 'Od', 'Stav'].map(h => (
            <div key={h} style={{ color: '#475569', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((c, i) => <ClientRow key={c.id} client={c} isLast={i === filtered.length - 1} />)}
      </div>
    </div>
  );
}

function ClientRow({ client: c, isLast }: { client: Client; isLast: boolean }) {
  const [hover, setHover] = useState(false);
  const initials = c.name.split(' ').map(n => n[0]).join('').toUpperCase();
  const avatarColors = ['#1d4ed8', '#7c3aed', '#0f766e', '#b45309', '#9d174d'];
  const avatarColor = avatarColors[c.id % avatarColors.length];

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 1fr 0.8fr',
        padding: '14px 20px',
        borderBottom: isLast ? 'none' : '1px solid #1e2d45',
        background: hover ? '#1e293b' : 'transparent',
        transition: 'background 0.15s',
        cursor: 'pointer',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: avatarColor, display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0,
        }}>{initials}</div>
        <div>
          <div style={{ color: '#f1f5f9', fontSize: 13, fontWeight: 600 }}>{c.name}</div>
          <div style={{ color: '#475569', fontSize: 11 }}>{c.email}</div>
        </div>
      </div>
      <div>
        <div style={{ color: '#cbd5e1', fontSize: 12 }}>{c.interest}</div>
        <div style={{ color: '#3b82f6', fontSize: 12, marginTop: 2 }}>{c.budget}</div>
      </div>
      <div style={{ color: '#94a3b8', fontSize: 12 }}>{c.phone}</div>
      <div style={{ color: '#64748b', fontSize: 12 }}>{c.lastContact}</div>
      <div style={{ color: '#475569', fontSize: 12 }}>{c.since}</div>
      <div><StatusBadge status={c.status} /></div>
    </div>
  );
}

function ViewingsView() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, margin: 0 }}>Obhliadky</h1>
          <p style={{ color: '#64748b', margin: '6px 0 0', fontSize: 14 }}>Aktuálny mesiac • {VIEWINGS.length} obhliadok</p>
        </div>
        <button style={{
          background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
          color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          + Naplánovať obhliadku
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {VIEWINGS.map(v => <ViewingCard key={v.id} viewing={v} />)}
      </div>
    </div>
  );
}

function ViewingCard({ viewing: v }: { viewing: Viewing }) {
  const [hover, setHover] = useState(false);
  const statusColorMap: Record<Viewing['status'], string> = {
    'Potvrdená': '#22c55e',
    'Čaká sa': '#eab308',
    'Prebehla': '#8b5cf6',
    'Zrušená': '#f87171',
  };
  const accent = statusColorMap[v.status];

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? '#1e293b' : '#1a2234',
        border: `1px solid ${hover ? '#3b82f6' : '#2a3a55'}`,
        borderLeft: `3px solid ${accent}`,
        borderRadius: 10, padding: '16px 20px',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{v.property}</div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ color: '#94a3b8', fontSize: 12 }}>👤 {v.client}</span>
            <span style={{ color: '#94a3b8', fontSize: 12 }}>🤝 {v.agent}</span>
            <span style={{ color: '#3b82f6', fontSize: 12, fontWeight: 600 }}>📅 {v.date} o {v.time}</span>
          </div>
          {v.note && (
            <div style={{ color: '#475569', fontSize: 12, marginTop: 8, fontStyle: 'italic' }}>
              💬 {v.note}
            </div>
          )}
        </div>
        <StatusBadge status={v.status} />
      </div>
    </div>
  );
}

function ContractsView() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, margin: 0 }}>Zmluvy</h1>
          <p style={{ color: '#64748b', margin: '6px 0 0', fontSize: 14 }}>{CONTRACTS.length} zmlúv celkom</p>
        </div>
        <button style={{
          background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
          color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          + Nová zmluva
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CONTRACTS.map(c => <ContractCard key={c.id} contract={c} />)}
      </div>
    </div>
  );
}

function ContractCard({ contract: c }: { contract: Contract }) {
  const [hover, setHover] = useState(false);
  const typeIcons: Record<Contract['type'], string> = {
    'Rezervačná zmluva': '📋',
    'Kúpna zmluva': '📝',
    'Nájomná zmluva': '🔑',
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? '#1e293b' : '#1a2234',
        border: `1px solid ${hover ? '#3b82f6' : '#2a3a55'}`,
        borderRadius: 12, padding: '20px 24px',
        transition: 'all 0.2s ease', cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>{typeIcons[c.type]}</span>
            <span style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600 }}>{c.type}</span>
            <StatusBadge status={c.status} />
          </div>
          <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{c.property}</div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: '#475569', fontSize: 11, marginBottom: 2 }}>KUPUJÚCI / NÁJOMCA</div>
              <div style={{ color: '#cbd5e1', fontSize: 13 }}>{c.buyer}</div>
            </div>
            <div>
              <div style={{ color: '#475569', fontSize: 11, marginBottom: 2 }}>PREDÁVAJÚCI / PRENAJÍMATEĽ</div>
              <div style={{ color: '#cbd5e1', fontSize: 13 }}>{c.seller}</div>
            </div>
            <div>
              <div style={{ color: '#475569', fontSize: 11, marginBottom: 2 }}>DÁTUM</div>
              <div style={{ color: '#cbd5e1', fontSize: 13 }}>{c.date}</div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ color: '#3b82f6', fontSize: 22, fontWeight: 700 }}>{formatPrice(c.value)}</div>
          <div style={{ color: '#475569', fontSize: 11, marginTop: 4 }}>
            {c.value < 10000 ? 'mesačne' : 'hodnota zmluvy'}
          </div>
        </div>
      </div>
    </div>
  );
}

function AIView() {
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_CHAT);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const DEMO_REPLIES: Record<string, string> = {
    default: 'Rozumiem. Na základe aktuálnych dát v CRM môžem povedať, že máme 24 aktívnych ponúk a 156 klientov. Ako vám môžem ďalej pomôcť?',
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: input, time: new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        role: 'ai',
        text: DEMO_REPLIES[input.toLowerCase()] ?? DEMO_REPLIES.default,
        time: new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, margin: 0 }}>AI Asistent</h1>
        <p style={{ color: '#64748b', margin: '6px 0 0', fontSize: 14 }}>
          Spýtajte sa na klientov, nehnuteľnosti, štatistiky alebo nechajte AI vykonať akciu
        </p>
      </div>

      {/* Suggestions */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {['Súhrn dnešných obhliadok', 'Top klienti tento mesiac', 'Koľko máme voľných bytov v BA I?', 'Napíš správu klientovi'].map(s => (
          <button
            key={s}
            onClick={() => setInput(s)}
            style={{
              background: '#1a2234', border: '1px solid #2a3a55', borderRadius: 20,
              color: '#94a3b8', padding: '6px 14px', fontSize: 12,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = '#3b82f6'; (e.target as HTMLButtonElement).style.color = '#3b82f6'; }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = '#2a3a55'; (e.target as HTMLButtonElement).style.color = '#94a3b8'; }}
          >{s}</button>
        ))}
      </div>

      {/* Chat */}
      <div style={{
        flex: 1, background: '#1a2234', border: '1px solid #2a3a55', borderRadius: 12,
        display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 380,
      }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 10 }}>
              {m.role === 'ai' && (
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, marginTop: 2,
                }}>✦</div>
              )}
              <div style={{
                maxWidth: '72%',
                background: m.role === 'user' ? 'linear-gradient(135deg, #1d4ed8, #2563eb)' : '#0f172a',
                border: m.role === 'ai' ? '1px solid #2a3a55' : 'none',
                borderRadius: m.role === 'user' ? '12px 12px 4px 12px' : '4px 12px 12px 12px',
                padding: '10px 14px',
              }}>
                <div style={{
                  color: m.role === 'user' ? '#fff' : '#cbd5e1',
                  fontSize: 13, lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                }}>
                  {m.text.split('**').map((part, pi) =>
                    pi % 2 === 1
                      ? <strong key={pi} style={{ color: '#f1f5f9', fontWeight: 700 }}>{part}</strong>
                      : part
                  )}
                </div>
                <div style={{ color: m.role === 'user' ? '#93c5fd' : '#475569', fontSize: 10, marginTop: 4, textAlign: 'right' }}>{m.time}</div>
              </div>
              {m.role === 'user' && (
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: '#1e3a5f', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#3b82f6', fontSize: 13, fontWeight: 700, marginTop: 2,
                }}>M</div>
              )}
            </div>
          ))}
          {isTyping && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0,
              }}>✦</div>
              <div style={{ background: '#0f172a', border: '1px solid #2a3a55', borderRadius: '4px 12px 12px 12px', padding: '10px 16px', display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: '50%', background: '#3b82f6',
                    animation: 'pulse 1.2s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`,
                    opacity: 0.7,
                  }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #2a3a55', display: 'flex', gap: 10 }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Napíšte otázku alebo pokyn pre AI..."
            style={{
              flex: 1, background: '#0f172a', border: '1px solid #2a3a55',
              borderRadius: 8, color: '#f1f5f9', padding: '10px 14px',
              fontSize: 13, outline: 'none',
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              color: '#fff', border: 'none', borderRadius: 8,
              padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >Odoslať</button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_ITEMS: Array<{ id: View; label: string; icon: string; badge?: string }> = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'nehnutelnosti', label: 'Nehnuteľnosti', icon: '🏠', badge: '24' },
  { id: 'klienti', label: 'Klienti', icon: '👥', badge: '156' },
  { id: 'obhliadky', label: 'Obhliadky', icon: '📅', badge: '6' },
  { id: 'zmluvy', label: 'Zmluvy', icon: '📄', badge: '4' },
  { id: 'ai', label: 'AI Asistent', icon: '✦' },
];

function Sidebar({ active, onNavigate }: { active: View; onNavigate: (v: View) => void }) {
  return (
    <aside style={{
      width: 240,
      background: '#0d1526',
      borderRight: '1px solid #1e2d45',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100vh',
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #1e2d45' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 16,
          }}>P</div>
          <div>
            <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px' }}>ProDom</div>
            <div style={{ color: '#3b82f6', fontSize: 11, fontWeight: 500 }}>Realitná kancelária</div>
          </div>
        </div>
        <div style={{
          marginTop: 12, background: '#0f172a', border: '1px solid #1e3a5f',
          borderRadius: 8, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
          <span style={{ color: '#64748b', fontSize: 11 }}>Agent 1</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ color: '#334155', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, padding: '4px 10px 8px' }}>
          Navigácia
        </div>
        {NAV_ITEMS.map(item => (
          <NavItem key={item.id} item={item} active={active === item.id} onClick={() => onNavigate(item.id)} />
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #1e2d45' }}>
        <a
          href="https://vassweb.sk"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
            background: '#0f172a', border: '1px solid #1e3a5f', borderRadius: 8, padding: '8px 12px',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#3b82f6')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e3a5f')}
        >
          <div style={{
            width: 22, height: 22, borderRadius: 5,
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 10, fontWeight: 700, flexShrink: 0,
          }}>V</div>
          <div>
            <div style={{ color: '#64748b', fontSize: 10, lineHeight: 1 }}>Powered by</div>
            <div style={{ color: '#3b82f6', fontSize: 11, fontWeight: 700 }}>Vassweb.sk</div>
          </div>
        </a>
      </div>
    </aside>
  );
}

function NavItem({ item, active, onClick }: { item: typeof NAV_ITEMS[0]; active: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', borderRadius: 8, border: 'none',
        background: active ? 'linear-gradient(135deg, #1e3a5f, #1d4ed830)' : hover ? '#1a2234' : 'transparent',
        color: active ? '#3b82f6' : hover ? '#cbd5e1' : '#64748b',
        cursor: 'pointer', width: '100%', textAlign: 'left',
        transition: 'all 0.15s',
        borderLeft: active ? '2px solid #3b82f6' : '2px solid transparent',
      }}
    >
      <span style={{ fontSize: 15, width: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
      <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, flex: 1 }}>{item.label}</span>
      {item.badge && (
        <span style={{
          background: active ? '#3b82f6' : '#1e2d45',
          color: active ? '#fff' : '#475569',
          borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 600,
        }}>{item.badge}</span>
      )}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CRMRealitkaDemoPage() {
  const [activeView, setActiveView] = useState<View>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView />;
      case 'nehnutelnosti': return <PropertiesView />;
      case 'klienti': return <ClientsView />;
      case 'obhliadky': return <ViewingsView />;
      case 'zmluvy': return <ContractsView />;
      case 'ai': return <AIView />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0f172a',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <Sidebar active={activeView} onNavigate={setActiveView} />

      <main style={{ flex: 1, overflowY: 'auto', padding: '32px 36px', minWidth: 0 }}>
        {/* Demo banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1d4ed815, #3b82f615)',
          border: '1px solid #1e3a5f',
          borderRadius: 10, padding: '10px 16px', marginBottom: 28,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#3b82f6', fontSize: 14 }}>✦</span>
            <span style={{ color: '#94a3b8', fontSize: 13 }}>
              Toto je <strong style={{ color: '#f1f5f9' }}>demo ukážka CRM systému</strong> vytvoreného na mieru pre realitnú kanceláriu
            </span>
          </div>
          <a
            href="https://vassweb.sk"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              color: '#fff', textDecoration: 'none', borderRadius: 6,
              padding: '6px 14px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
            }}
          >
            Chcem vlastný CRM →
          </a>
        </div>

        {/* GDPR disclaimer */}
        <div style={{
          background: '#1a2234',
          border: '1px solid #2a3a55',
          borderRadius: 8, padding: '8px 14px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ color: '#3b82f6', fontSize: 13, flexShrink: 0 }}>ℹ</span>
          <span style={{ color: '#64748b', fontSize: 12, lineHeight: 1.4 }}>
            {'Demo verzia \u2014 z d\u00f4vodu ochrany osobn\u00fdch \u00fadajov s\u00fa men\u00e1 a kontaktn\u00e9 \u00fadaje z\u00e1kazn\u00edkov anonymizovan\u00e9.'}
          </span>
        </div>

        {renderView()}
      </main>
    </div>
  );
}
