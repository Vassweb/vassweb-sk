'use client';
import { useState, useMemo } from 'react';
import { DemoProvider, ThemeSwitcher, PoweredByVassweb, useTheme } from '@/components/DemoTheme';

/* ── Demo Data ──────────────────────────────────────────────── */
const clients = [
  { id: 1, name: 'Martin Kovac', company: 'TechNova s.r.o.', email: 'martin@technova.sk', value: 1200, status: 'Aktívny', lastActivity: '2 hodiny', phone: '+421 907 123 456', note: 'Zaujíma sa o redesign e-shopu.' },
  { id: 2, name: 'Jana Horváthová', company: 'GreenLeaf a.s.', email: 'jana@greenleaf.sk', value: 850, status: 'Aktívny', lastActivity: '1 deň', phone: '+421 918 234 567', note: 'Potrebuje CRM integráciu.' },
  { id: 3, name: 'Peter Nemec', company: 'BlueStar s.r.o.', email: 'peter@bluestar.sk', value: 2100, status: 'Aktívny', lastActivity: '3 hodiny', phone: '+421 903 345 678', note: 'Veľký projekt, 3 fázy.' },
  { id: 4, name: 'Eva Miklošová', company: 'PixelForge s.r.o.', email: 'eva@pixelforge.sk', value: 600, status: 'Neaktívny', lastActivity: '5 dní', phone: '+421 911 456 789', note: 'Čaká na schválenie rozpočtu.' },
  { id: 5, name: 'Tomáš Baran', company: 'DataFlow a.s.', email: 'tomas@dataflow.sk', value: 1750, status: 'Aktívny', lastActivity: '6 hodín', phone: '+421 905 567 890', note: 'Automatizácia procesov.' },
  { id: 6, name: 'Lucia Kráľová', company: 'SkyNet Solutions', email: 'lucia@skynet.sk', value: 950, status: 'Aktívny', lastActivity: '1 hodina', phone: '+421 917 678 901', note: 'Web + mobilná appka.' },
  { id: 7, name: 'Michal Štefan', company: 'IronWorks s.r.o.', email: 'michal@ironworks.sk', value: 400, status: 'Neaktívny', lastActivity: '2 týždne', phone: '+421 902 789 012', note: 'Vizitka a logo.' },
  { id: 8, name: 'Zuzana Vlčková', company: 'MedTech a.s.', email: 'zuzana@medtech.sk', value: 3200, status: 'Aktívny', lastActivity: '30 minút', phone: '+421 914 890 123', note: 'Zdravotnícky portál, priorita.' },
];

const deals = [
  { id: 1, clientId: 1, company: 'TechNova s.r.o.', contact: 'Martin Kovac', value: 1200, stage: 'Nový lead', days: 2 },
  { id: 2, clientId: 2, company: 'GreenLeaf a.s.', contact: 'Jana Horváthová', value: 850, stage: 'Nový lead', days: 5 },
  { id: 3, clientId: 3, company: 'BlueStar s.r.o.', contact: 'Peter Nemec', value: 2100, stage: 'Kvalifikovaný', days: 8 },
  { id: 4, clientId: 5, company: 'DataFlow a.s.', contact: 'Tomáš Baran', value: 1750, stage: 'Kvalifikovaný', days: 3 },
  { id: 5, clientId: 6, company: 'SkyNet Solutions', contact: 'Lucia Kráľová', value: 950, stage: 'Ponuka odoslaná', days: 4 },
  { id: 6, clientId: 4, company: 'PixelForge s.r.o.', contact: 'Eva Miklošová', value: 600, stage: 'Ponuka odoslaná', days: 12 },
  { id: 7, clientId: 8, company: 'MedTech a.s.', contact: 'Zuzana Vlčková', value: 3200, stage: 'Uzavretý', days: 1 },
  { id: 8, clientId: 7, company: 'IronWorks s.r.o.', contact: 'Michal Štefan', value: 400, stage: 'Ponuka odoslaná', days: 7 },
];

const activities = [
  { id: 1, type: 'deal', title: 'Deal uzavretý', desc: 'MedTech a.s. — 3 200 €', time: 'Dnes, 14:32' },
  { id: 2, type: 'email', title: 'Email odoslaný', desc: 'Cenová ponuka pre SkyNet Solutions', time: 'Dnes, 13:15' },
  { id: 3, type: 'call', title: 'Hovor s klientom', desc: 'Tomáš Baran — follow-up DataFlow', time: 'Dnes, 11:40' },
  { id: 4, type: 'client', title: 'Nový klient', desc: 'TechNova s.r.o. pridaný do systému', time: 'Dnes, 10:05' },
  { id: 5, type: 'note', title: 'Poznámka pridaná', desc: 'BlueStar — upresniť požiadavky', time: 'Dnes, 09:22' },
  { id: 6, type: 'email', title: 'Email odoslaný', desc: 'Zmluva pre IronWorks s.r.o.', time: 'Včera, 16:48' },
  { id: 7, type: 'call', title: 'Hovor s klientom', desc: 'Lucia Kráľová — demo prezentácia', time: 'Včera, 14:20' },
  { id: 8, type: 'deal', title: 'Deal posunutý', desc: 'PixelForge → Ponuka odoslaná', time: 'Včera, 11:30' },
  { id: 9, type: 'client', title: 'Nový klient', desc: 'GreenLeaf a.s. pridaný do systému', time: 'Pred 2 dňami' },
  { id: 10, type: 'note', title: 'Poznámka pridaná', desc: 'DataFlow — preferuje agilný prístup', time: 'Pred 2 dňami' },
];

const revenueData = [
  { month: 'Okt', value: 2800 },
  { month: 'Nov', value: 3200 },
  { month: 'Dec', value: 2950 },
  { month: 'Jan', value: 3800 },
  { month: 'Feb', value: 4100 },
  { month: 'Mar', value: 4750 },
];

const stages = ['Nový lead', 'Kvalifikovaný', 'Ponuka odoslaná', 'Uzavretý'] as const;

const activityIcon: Record<string, string> = {
  deal: '🤝', email: '✉️', call: '📞', client: '👤', note: '📝',
};

/* ── SVG Chart ──────────────────────────────────────────────── */
function RevenueChart({ accent, accentLight, border, textMuted }: { accent: string; accentLight: string; border: string; textMuted: string }) {
  const w = 500, h = 180, px = 50, py = 20;
  const max = Math.max(...revenueData.map(d => d.value));
  const pts = revenueData.map((d, i) => ({
    x: px + i * ((w - px * 2) / (revenueData.length - 1)),
    y: py + (1 - d.value / max) * (h - py * 2),
  }));
  const line = pts.map(p => `${p.x},${p.y}`).join(' ');
  const area = `${pts[0].x},${h - py} ${line} ${pts[pts.length - 1].x},${h - py}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map(f => {
        const y = py + f * (h - py * 2);
        return <line key={f} x1={px} x2={w - px} y1={y} y2={y} stroke={border} strokeWidth={1} />;
      })}
      <polygon points={area} fill="url(#areaGrad)" />
      <polyline points={line} fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill={accent} stroke={accentLight} strokeWidth={2} />
          <text x={p.x} y={h - 2} textAnchor="middle" fill={textMuted} fontSize={11} fontFamily="Inter,system-ui,sans-serif">{revenueData[i].month}</text>
          <text x={p.x} y={p.y - 10} textAnchor="middle" fill={accentLight} fontSize={10} fontFamily="Inter,system-ui,sans-serif" fontWeight={600}>{revenueData[i].value}€</text>
        </g>
      ))}
    </svg>
  );
}

/* ── Modal ──────────────────────────────────────────────────── */
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  const { t } = useTheme();
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', animation: 'crmFade 0.2s ease' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: 28, maxWidth: 460, width: '90%', boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${t.border}`, animation: 'crmSlideUp 0.25s ease' }}>
        {children}
        <button onClick={onClose} style={{ marginTop: 20, width: '100%', padding: '10px 0', background: t.accent, color: t.isLight ? '#fff' : t.bg, border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter,system-ui,sans-serif' }}>Zavrieť</button>
      </div>
    </div>
  );
}

/* ── Main CRM ───────────────────────────────────────────────── */
const tabs = ['Dashboard', 'Pipeline', 'Klienti', 'Aktivita'] as const;
type Tab = typeof tabs[number];

function CRMInner() {
  const { t } = useTheme();
  const [tab, setTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [actFilter, setActFilter] = useState('Všetky');
  const [modalDeal, setModalDeal] = useState<typeof deals[0] | null>(null);
  const [modalClient, setModalClient] = useState<typeof clients[0] | null>(null);

  const filteredClients = useMemo(() => {
    const q = search.toLowerCase();
    return clients.filter(c => !q || c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }, [search]);

  const filteredActivities = useMemo(() => {
    if (actFilter === 'Všetky') return activities;
    const map: Record<string, string> = { 'Hovory': 'call', 'Emaily': 'email', 'Dealy': 'deal' };
    return activities.filter(a => a.type === map[actFilter]);
  }, [actFilter]);

  const pipelineColumns = useMemo(() => stages.map(s => {
    const d = deals.filter(deal => deal.stage === s);
    return { stage: s, deals: d, total: d.reduce((a, b) => a + b.value, 0) };
  }), []);

  const topDeals = useMemo(() => [...deals].sort((a, b) => b.value - a.value).slice(0, 3), []);

  const s = {
    font: 'Inter, system-ui, sans-serif' as const,
    card: { background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 20 } as React.CSSProperties,
  };

  return (
    <div style={{ minHeight: '100vh', background: t.bg, color: t.text, fontFamily: s.font, transition: 'background 0.4s, color 0.4s' }}>
      <ThemeSwitcher />

      {/* Header */}
      <header style={{ padding: '20px 24px 0', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, color: t.isLight ? '#fff' : t.bg }}>CRM</div>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Vassweb CRM</span>
        </div>
        <nav style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${t.border}`, paddingBottom: 0 }}>
          {tabs.map(tb => (
            <button key={tb} onClick={() => setTab(tb)} style={{
              padding: '10px 18px', background: 'none', border: 'none', cursor: 'pointer',
              color: tab === tb ? t.accent : t.textMuted, fontWeight: tab === tb ? 600 : 400,
              fontSize: 14, fontFamily: s.font, borderBottom: tab === tb ? `2px solid ${t.accent}` : '2px solid transparent',
              transition: 'all 0.2s', marginBottom: -1,
            }}>{tb}</button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 0' }}>

        {/* ── DASHBOARD ── */}
        {tab === 'Dashboard' && (
          <div style={{ animation: 'crmFade 0.3s ease' }}>
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Klienti', val: '12', icon: '👥' },
                { label: 'Aktívne dealy', val: '8', icon: '📊' },
                { label: 'Príjem tento mesiac', val: '4 750 €', icon: '💰' },
                { label: 'Konverzný pomer', val: '34%', icon: '🎯' },
              ].map(st => (
                <div key={st.label} style={{ ...s.card, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${t.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{st.icon}</div>
                  <div>
                    <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 2 }}>{st.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: t.text }}>{st.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart + top deals */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
              <div style={s.card}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Mesačný príjem</div>
                <RevenueChart accent={t.accent} accentLight={t.accentLight} border={t.border} textMuted={t.textMuted} />
              </div>
              <div style={s.card}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Top dealy</div>
                {topDeals.map((d, i) => (
                  <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 2 ? `1px solid ${t.border}` : 'none' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{d.company}</div>
                      <div style={{ fontSize: 11, color: t.textMuted }}>{d.contact}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: t.accent }}>{d.value.toLocaleString()} €</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activities */}
            <div style={s.card}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Posledná aktivita</div>
              {activities.slice(0, 5).map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${t.border}` }}>
                  <span style={{ fontSize: 18 }}>{activityIcon[a.type]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: t.textMuted }}>{a.desc}</div>
                  </div>
                  <div style={{ fontSize: 11, color: t.textMuted, whiteSpace: 'nowrap' }}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PIPELINE ── */}
        {tab === 'Pipeline' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, animation: 'crmFade 0.3s ease', overflowX: 'auto' }}>
            {pipelineColumns.map(col => (
              <div key={col.stage} style={{ ...s.card, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{col.stage}</div>
                    <div style={{ fontSize: 11, color: t.textMuted }}>{col.deals.length} dealov</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.accent }}>{col.total.toLocaleString()} €</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.deals.map(deal => (
                    <div key={deal.id} onClick={() => setModalDeal(deal)} style={{
                      padding: 14, borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                      background: t.isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${t.border}`,
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = t.accent; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = t.border; }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{deal.company}</div>
                      <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 6 }}>{deal.contact}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: t.accent }}>{deal.value.toLocaleString()} €</span>
                        <span style={{ fontSize: 10, color: t.textMuted, background: `${t.accent}12`, padding: '2px 8px', borderRadius: 20 }}>{deal.days} dní</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── KLIENTI ── */}
        {tab === 'Klienti' && (
          <div style={{ animation: 'crmFade 0.3s ease' }}>
            <input
              type="text" placeholder="Hľadať klienta..." value={search} onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', marginBottom: 18, borderRadius: 10, fontSize: 14,
                background: t.bgCard, border: `1px solid ${t.border}`, color: t.text, outline: 'none',
                fontFamily: s.font, boxSizing: 'border-box', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = t.accent}
              onBlur={e => e.currentTarget.style.borderColor = t.border}
            />
            <div style={{ ...s.card, padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                    {['Meno', 'Firma', 'Email', 'Hodnota', 'Stav', 'Posledná aktivita'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '12px 14px', color: t.textMuted, fontWeight: 500, fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map(c => (
                    <tr key={c.id} onClick={() => setModalClient(c)} style={{ borderBottom: `1px solid ${t.border}`, cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = `${t.accent}08`)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>{c.name}</td>
                      <td style={{ padding: '12px 14px' }}>{c.company}</td>
                      <td style={{ padding: '12px 14px', color: t.textMuted }}>{c.email}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: t.accent }}>{c.value.toLocaleString()} €</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                          background: c.status === 'Aktívny' ? `${t.accent}20` : `${t.textMuted}20`,
                          color: c.status === 'Aktívny' ? t.accent : t.textMuted,
                        }}>{c.status}</span>
                      </td>
                      <td style={{ padding: '12px 14px', color: t.textMuted, fontSize: 12 }}>{c.lastActivity}</td>
                    </tr>
                  ))}
                  {filteredClients.length === 0 && (
                    <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: t.textMuted }}>Žiadni klienti nenájdení.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── AKTIVITA ── */}
        {tab === 'Aktivita' && (
          <div style={{ animation: 'crmFade 0.3s ease' }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
              {['Všetky', 'Hovory', 'Emaily', 'Dealy'].map(f => (
                <button key={f} onClick={() => setActFilter(f)} style={{
                  padding: '8px 16px', borderRadius: 20, border: `1px solid ${actFilter === f ? t.accent : t.border}`,
                  background: actFilter === f ? `${t.accent}18` : 'transparent',
                  color: actFilter === f ? t.accent : t.textMuted, cursor: 'pointer', fontSize: 13,
                  fontWeight: actFilter === f ? 600 : 400, fontFamily: s.font, transition: 'all 0.2s',
                }}>{f}</button>
              ))}
            </div>
            <div style={{ ...s.card, padding: 0 }}>
              {filteredActivities.map((a, i) => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px', borderBottom: i < filteredActivities.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${t.accent}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {activityIcon[a.type]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: t.textMuted }}>{a.desc}</div>
                  </div>
                  <div style={{ fontSize: 11, color: t.textMuted, whiteSpace: 'nowrap', paddingTop: 2 }}>{a.time}</div>
                </div>
              ))}
              {filteredActivities.length === 0 && (
                <div style={{ padding: 32, textAlign: 'center', color: t.textMuted }}>Žiadne aktivity v tejto kategórii.</div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Deal Modal */}
      <Modal open={!!modalDeal} onClose={() => setModalDeal(null)}>
        {modalDeal && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{modalDeal.company}</div>
            <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 16 }}>Kontakt: {modalDeal.contact}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 14, borderRadius: 10, background: `${t.accent}10`, border: `1px solid ${t.border}` }}>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 2 }}>Hodnota</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: t.accent }}>{modalDeal.value.toLocaleString()} €</div>
              </div>
              <div style={{ padding: 14, borderRadius: 10, background: `${t.accent}10`, border: `1px solid ${t.border}` }}>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 2 }}>Fáza</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{modalDeal.stage}</div>
              </div>
            </div>
            <div style={{ marginTop: 14, padding: 14, borderRadius: 10, background: `${t.accent}08`, border: `1px solid ${t.border}`, fontSize: 13, color: t.textMuted }}>
              V tejto fáze: <strong style={{ color: t.text }}>{modalDeal.days} dní</strong>
            </div>
          </div>
        )}
      </Modal>

      {/* Client Modal */}
      <Modal open={!!modalClient} onClose={() => setModalClient(null)}>
        {modalClient && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>{modalClient.name}</div>
            <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 16 }}>{modalClient.company}</div>
            {[
              { label: 'Email', val: modalClient.email },
              { label: 'Telefón', val: modalClient.phone },
              { label: 'Hodnota dealov', val: `${modalClient.value.toLocaleString()} €` },
              { label: 'Stav', val: modalClient.status },
              { label: 'Posledná aktivita', val: modalClient.lastActivity },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${t.border}`, fontSize: 13 }}>
                <span style={{ color: t.textMuted }}>{r.label}</span>
                <span style={{ fontWeight: 500 }}>{r.val}</span>
              </div>
            ))}
            <div style={{ marginTop: 14, padding: 14, borderRadius: 10, background: `${t.accent}08`, border: `1px solid ${t.border}`, fontSize: 13, color: t.textMuted }}>
              <strong style={{ color: t.text }}>Poznámka:</strong> {modalClient.note}
            </div>
          </div>
        )}
      </Modal>

      <div style={{ marginTop: 48 }}>
        <PoweredByVassweb />
      </div>

      <style>{`
        @keyframes crmFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes crmSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          main > div > div[style*="grid-template-columns: 2fr"] { grid-template-columns: 1fr !important; }
          main > div > div[style*="repeat(4"] { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          main > div > div[style*="repeat(4"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default function CRMPage() {
  return (
    <DemoProvider>
      <CRMInner />
    </DemoProvider>
  );
}
