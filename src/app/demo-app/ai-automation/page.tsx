'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DemoProvider, ThemeSwitcher, PoweredByVassweb, BackToVassweb, useTheme } from '@/components/DemoTheme';

/* ═══ HELPERS ═══ */
const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

/* ═══ SECTION WRAPPER ═══ */
function Section({ title, desc, children, id }: { title: string; desc: string; children: React.ReactNode; id: string }) {
  const { t } = useTheme();
  return (
    <section id={id} style={{ padding: '64px 24px', borderBottom: `1px solid ${t.border}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-heading), Playfair Display, serif', fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400, color: t.text, marginBottom: 8 }}>{title}</h2>
          <p style={{ fontSize: 14, color: t.textMuted, maxWidth: 600 }}>{desc}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   1. AI CHATBOT DEMO
   ═══════════════════════════════════════════════════════════════ */
const chatScenarios: Record<string, string> = {
  'cenová ponuka': 'Na základe vašich požiadaviek navrhujem balík **Business** za 3 500 €. Zahŕňa:\n\n• Responzívny web (do 15 podstránok)\n• CMS systém pre správu obsahu\n• SEO optimalizáciu\n• AI chatbot integráciu\n• 3 mesiace bezplatnej podpory\n\nMôžem vám poslať detailnú ponuku na email?',
  'otváracie hodiny': 'Naše konzultačné hodiny sú:\n\n🕐 **Pondelok – Piatok:** 9:00 – 17:00\n🕐 **Sobota:** 10:00 – 14:00 (len online)\n🕐 **Nedeľa:** Zatvorené\n\nOnline konzultáciu vieme dohodnúť aj mimo pracovných hodín. Chcete si rezervovať termín?',
  'rezervácia': 'Samozrejme! Najbližšie voľné termíny na konzultáciu:\n\n📅 **Utorok 18.3.** o 10:00\n📅 **Streda 19.3.** o 14:00\n📅 **Štvrtok 20.3.** o 9:00\n\nKtorý termín vám vyhovuje? Konzultácia je bezplatná a trvá 30 minút.',
  'default': 'Ďakujem za váš záujem! Rád vám pomôžem. Špecializujeme sa na tvorbu webov, AI riešenia a automatizácie pre firmy.\n\nMôžem vám pomôcť s:\n• Cenovou ponukou pre váš projekt\n• Informáciami o našich službách\n• Rezerváciou bezplatnej konzultácie\n\nČo vás zaujíma?',
};

function ChatbotDemo() {
  const { t } = useTheme();
  const [msgs, setMsgs] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [running, setRunning] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef(false);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typedText]);

  const typeText = useCallback(async (text: string) => {
    setTyping(true);
    setTypedText('');
    for (let i = 0; i <= text.length; i++) {
      if (cancelRef.current) break;
      setTypedText(text.slice(0, i));
      await wait(12 + Math.random() * 18);
    }
    setTyping(false);
    return text;
  }, []);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || typing) return;
    setInput('');
    setMsgs(prev => [...prev, { role: 'user', text: msg }]);
    await wait(400);
    const key = Object.keys(chatScenarios).find(k => k !== 'default' && msg.toLowerCase().includes(k)) || 'default';
    const reply = chatScenarios[key];
    const typed = await typeText(reply);
    setMsgs(prev => [...prev, { role: 'ai', text: typed }]);
    setTypedText('');
  };

  const runDemo = async () => {
    cancelRef.current = false;
    setRunning(true);
    setMsgs([]);
    const demos = ['Dobrý deň, zaujíma ma cenová ponuka pre firemný web', 'Aké sú otváracie hodiny?', 'Chcel by som si rezervovať konzultáciu'];
    for (const q of demos) {
      if (cancelRef.current) break;
      await sendMessage(q);
      await wait(1500);
    }
    setRunning(false);
  };

  const quickQ = ['Cenová ponuka', 'Otváracie hodiny', 'Rezervácia termínu'];

  return (
    <Section id="chatbot" title="AI Chatbot" desc="Inteligentný asistent, ktorý odpovie na otázky zákazníkov 24/7.">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20, alignItems: 'start' }}>
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, overflow: 'hidden', maxHeight: 480 }}>
          {/* Header */}
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4ade80' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: t.accent }}>Vassweb AI Asistent</span>
            <span style={{ fontSize: 11, color: t.textMuted, marginLeft: 'auto' }}>Online</span>
          </div>
          {/* Messages */}
          <div style={{ height: 320, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {msgs.length === 0 && !typing && (
              <div style={{ textAlign: 'center', padding: 40, color: t.textMuted, fontSize: 13 }}>
                Kliknite &quot;Spustiť demo&quot; alebo napíšte otázku...
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: 12,
                  background: m.role === 'user' ? `${t.accent}20` : t.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${m.role === 'user' ? `${t.accent}30` : t.border}`,
                  fontSize: 13, lineHeight: 1.6, color: t.text, whiteSpace: 'pre-wrap',
                }}>{m.text}</div>
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: 12,
                  background: t.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${t.border}`, fontSize: 13, lineHeight: 1.6, color: t.text, whiteSpace: 'pre-wrap',
                }}>
                  {typedText}<span style={{ animation: 'blink 1s infinite', color: t.accent }}>▋</span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: `1px solid ${t.border}`, display: 'flex', gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              placeholder="Napíšte správu..." disabled={typing}
              style={{ flex: 1, padding: '8px 14px', background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: 'Inter, system-ui, sans-serif', outline: 'none' }} />
            <button onClick={() => sendMessage()} disabled={typing || !input.trim()}
              style={{ padding: '8px 16px', background: t.accent, color: t.isLight ? '#fff' : t.bg, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, opacity: typing || !input.trim() ? 0.4 : 1 }}>
              Odoslať
            </button>
          </div>
        </div>
        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={runDemo} disabled={running || typing}
            style={{ padding: '14px 20px', background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`, color: t.isLight ? '#fff' : t.bg, border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14, opacity: running ? 0.5 : 1, transition: 'all 0.2s' }}>
            ▶ Spustiť demo
          </button>
          <div style={{ fontSize: 11, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 8 }}>Rýchle otázky</div>
          {quickQ.map(q => (
            <button key={q} onClick={() => sendMessage(q)} disabled={typing}
              style={{ padding: '10px 14px', background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text, cursor: 'pointer', fontSize: 12, textAlign: 'left', transition: 'all 0.2s' }}>
              {q}
            </button>
          ))}
          <button onClick={() => { cancelRef.current = true; setRunning(false); setTyping(false); setMsgs([]); setTypedText(''); }}
            style={{ padding: '8px 14px', background: 'transparent', border: `1px solid ${t.border}`, borderRadius: 8, color: t.textMuted, cursor: 'pointer', fontSize: 11, marginTop: 8 }}>
            Vyčistiť chat
          </button>
        </div>
      </div>
      <style>{`@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }`}</style>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. EMAIL AUTOMATION DEMO
   ═══════════════════════════════════════════════════════════════ */
const emailSteps = [
  { icon: '📩', label: 'Nový lead', desc: 'Zákazník vyplnil formulár na webe' },
  { icon: '🤖', label: 'AI Analýza', desc: 'AI analyzuje potreby a segment klienta' },
  { icon: '✉️', label: 'Personalizovaný email', desc: 'Automaticky vytvorený na mieru' },
  { icon: '📊', label: 'Follow-up plán', desc: 'Naplánované 3 follow-up emaily' },
  { icon: '🔔', label: 'Notifikácia', desc: 'Obchodník dostane upozornenie' },
];

function EmailAutomationDemo() {
  const { t } = useTheme();
  const [activeStep, setActiveStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [emailPreview, setEmailPreview] = useState(false);
  const cancelRef = useRef(false);

  const runDemo = async () => {
    cancelRef.current = false;
    setRunning(true);
    setEmailPreview(false);
    for (let i = 0; i < emailSteps.length; i++) {
      if (cancelRef.current) break;
      setActiveStep(i);
      await wait(1200);
      if (i === 2) setEmailPreview(true);
    }
    setRunning(false);
  };

  const reset = () => { cancelRef.current = true; setRunning(false); setActiveStep(-1); setEmailPreview(false); };

  return (
    <Section id="email" title="Email Automatizácia" desc="Od nového leadu po personalizovaný email — plne automaticky.">
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Flow */}
        <div style={{ flex: '1 1 400px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {emailSteps.map((step, i) => {
              const active = i <= activeStep;
              const current = i === activeStep;
              return (
                <div key={i}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                    background: current ? `${t.accent}12` : 'transparent',
                    border: `1px solid ${current ? t.accent : 'transparent'}`,
                    borderRadius: 12, transition: 'all 0.4s',
                    opacity: active ? 1 : 0.3,
                    transform: current ? 'scale(1.02)' : 'scale(1)',
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, fontSize: 20,
                      background: active ? `${t.accent}20` : t.bgCard,
                      border: `1px solid ${active ? t.accent : t.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.4s',
                    }}>{step.icon}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: active ? t.text : t.textMuted }}>{step.label}</div>
                      <div style={{ fontSize: 12, color: t.textMuted }}>{step.desc}</div>
                    </div>
                    {active && i < activeStep && <span style={{ marginLeft: 'auto', color: '#4ade80', fontSize: 16 }}>✓</span>}
                    {current && running && <span style={{ marginLeft: 'auto', color: t.accent, fontSize: 11, animation: 'pulse 1.5s infinite' }}>Spracovávam...</span>}
                  </div>
                  {i < emailSteps.length - 1 && (
                    <div style={{ marginLeft: 40, width: 2, height: 16, background: i < activeStep ? t.accent : t.border, transition: 'background 0.4s' }} />
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button onClick={runDemo} disabled={running}
              style={{ padding: '12px 24px', background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`, color: t.isLight ? '#fff' : t.bg, border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13, opacity: running ? 0.5 : 1 }}>
              ▶ Spustiť demo
            </button>
            <button onClick={reset}
              style={{ padding: '12px 24px', background: 'transparent', border: `1px solid ${t.border}`, borderRadius: 10, color: t.textMuted, cursor: 'pointer', fontSize: 13 }}>
              Reset
            </button>
          </div>
        </div>
        {/* Email preview */}
        {emailPreview && (
          <div style={{
            flex: '1 1 360px', background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14,
            overflow: 'hidden', animation: 'fadeSlideIn 0.5s ease',
          }}>
            <div style={{ padding: '12px 20px', borderBottom: `1px solid ${t.border}`, background: `${t.accent}08` }}>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Vygenerovaný email</div>
            </div>
            <div style={{ padding: 20, fontSize: 13, lineHeight: 1.7, color: t.text }}>
              <div style={{ marginBottom: 12 }}>
                <span style={{ color: t.textMuted, fontSize: 11 }}>Komu:</span> <span>jan.novak@firma.sk</span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <span style={{ color: t.textMuted, fontSize: 11 }}>Predmet:</span> <strong> Vaša digitalizácia — personalizovaný návrh</strong>
              </div>
              <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 16, color: t.text }}>
                Dobrý deň Ján,<br /><br />
                ďakujeme za váš záujem o naše služby. Na základe vašich potrieb sme pripravili návrh riešenia, ktoré zahŕňa <strong style={{ color: t.accent }}>responzívny web s AI chatbotom</strong>.<br /><br />
                Radi by sme vám ho predstavili na 30-minútovej konzultácii. Dáme vám vedieť o ďalších krokoch.<br /><br />
                S pozdravom,<br />
                <strong>Vassweb tím</strong>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. INVOICE AUTOMATION DEMO
   ═══════════════════════════════════════════════════════════════ */
function InvoiceDemo() {
  const { t } = useTheme();
  const [client, setClient] = useState('TechStart s.r.o.');
  const [service, setService] = useState('Tvorba webstránky');
  const [amount, setAmount] = useState('3500');
  const [generated, setGenerated] = useState(false);
  const [animating, setAnimating] = useState(false);

  const generate = async () => {
    setAnimating(true);
    setGenerated(false);
    await wait(800);
    setGenerated(true);
    setAnimating(false);
  };

  const num = `VW-2026-${String(Math.floor(Math.random() * 900 + 100))}`;
  const today = new Date().toLocaleDateString('sk-SK');
  const due = new Date(Date.now() + 14 * 86400000).toLocaleDateString('sk-SK');
  const amt = parseFloat(amount) || 0;

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: 'Inter, system-ui, sans-serif', outline: 'none' };

  return (
    <Section id="invoice" title="Faktúra Automatizácia" desc="Vyplňte 3 polia a AI vygeneruje kompletnú faktúru za sekundy.">
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6, letterSpacing: '0.05em' }}>KLIENT</label>
            <input value={client} onChange={e => setClient(e.target.value)} style={inp} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6, letterSpacing: '0.05em' }}>SLUŽBA</label>
            <input value={service} onChange={e => setService(e.target.value)} style={inp} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6, letterSpacing: '0.05em' }}>SUMA (€)</label>
            <input value={amount} onChange={e => setAmount(e.target.value)} type="number" style={inp} />
          </div>
          <button onClick={generate} disabled={animating}
            style={{ padding: '14px 24px', background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`, color: t.isLight ? '#fff' : t.bg, border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14, marginTop: 8, opacity: animating ? 0.5 : 1 }}>
            {animating ? '⚙ Generujem...' : '▶ Vygenerovať faktúru'}
          </button>
        </div>
        {/* Invoice preview */}
        <div style={{
          background: t.isLight ? '#fff' : t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, overflow: 'hidden',
          opacity: generated ? 1 : 0.3, transition: 'opacity 0.5s', minHeight: 400,
        }}>
          {/* Header */}
          <div style={{ background: t.isLight ? '#111' : '#0a0908', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 300, color: '#fff', letterSpacing: '0.1em' }}>FAKTÚRA</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#d4a843', border: '2px solid #d4a843', padding: '4px 12px', borderRadius: 6 }}>VW</div>
          </div>
          {/* Meta */}
          <div style={{ padding: '20px 28px', display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${t.border}` }}>
            <div>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Faktúra</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.accent }}>{num}</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>Vystavená: {today}</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>Splatnosť: {due}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Odberateľ</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{client || '—'}</div>
            </div>
          </div>
          {/* Items */}
          <div style={{ padding: '16px 28px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Popis', 'Mn.', 'Cena', 'Spolu'].map(h => (
                    <th key={h} style={{ textAlign: h === 'Popis' ? 'left' : 'right', padding: '8px 4px', fontSize: 10, color: t.textMuted, borderBottom: `2px solid ${t.accent}`, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '12px 4px', fontSize: 13, color: t.text }}>{service || '—'}</td>
                  <td style={{ padding: '12px 4px', fontSize: 13, color: t.text, textAlign: 'right' }}>1</td>
                  <td style={{ padding: '12px 4px', fontSize: 13, color: t.text, textAlign: 'right' }}>{amt.toLocaleString('sk-SK')} €</td>
                  <td style={{ padding: '12px 4px', fontSize: 13, color: t.text, textAlign: 'right', fontWeight: 600 }}>{amt.toLocaleString('sk-SK')} €</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px 4px', fontSize: 13, color: t.textMuted }}>DPH 20%</td>
                  <td style={{ padding: '12px 4px', textAlign: 'right' }} />
                  <td style={{ padding: '12px 4px', textAlign: 'right' }} />
                  <td style={{ padding: '12px 4px', fontSize: 13, color: t.textMuted, textAlign: 'right' }}>{(amt * 0.2).toLocaleString('sk-SK')} €</td>
                </tr>
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 4px 0', borderTop: `1px solid ${t.border}`, marginTop: 8 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>CELKOM S DPH</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: t.accent }}>{(amt * 1.2).toLocaleString('sk-SK')} €</div>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div style={{ padding: '12px 28px', borderTop: `1px solid ${t.border}`, textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: t.textMuted }}>Vassweb s.r.o. — vassweb.sk — IČO: 12345678</span>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. DATA ANALYTICS DEMO
   ═══════════════════════════════════════════════════════════════ */
function AnalyticsDemo() {
  const { t } = useTheme();
  const [data, setData] = useState({ visits: 2847, conversions: 234, revenue: 18450, bounce: 32 });
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const barData = [
    { label: 'Po', value: 320 }, { label: 'Ut', value: 450 }, { label: 'St', value: 380 },
    { label: 'Št', value: 520 }, { label: 'Pi', value: 610 }, { label: 'So', value: 280 }, { label: 'Ne', value: 190 },
  ];
  const [bars, setBars] = useState(barData);

  const linePoints = [180, 220, 195, 260, 310, 280, 350, 320, 390, 360, 420, 450];
  const [line, setLine] = useState(linePoints);

  const pieData = [
    { label: 'Organický', pct: 45, color: '#4ade80' },
    { label: 'Priamy', pct: 25, color: t.accent },
    { label: 'Sociálne siete', pct: 20, color: '#60a5fa' },
    { label: 'Referral', pct: 10, color: '#c084fc' },
  ];

  const toggleRealtime = () => {
    if (running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRunning(false);
    } else {
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setData(d => ({
          visits: d.visits + Math.floor(Math.random() * 20 - 5),
          conversions: d.conversions + Math.floor(Math.random() * 4 - 1),
          revenue: d.revenue + Math.floor(Math.random() * 200 - 50),
          bounce: Math.max(15, Math.min(55, d.bounce + Math.floor(Math.random() * 6 - 3))),
        }));
        setBars(prev => prev.map(b => ({ ...b, value: Math.max(100, b.value + Math.floor(Math.random() * 80 - 40)) })));
        setLine(prev => [...prev.slice(1), prev[prev.length - 1] + Math.floor(Math.random() * 60 - 25)]);
      }, 1500);
    }
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const maxBar = Math.max(...bars.map(b => b.value));
  const maxLine = Math.max(...line);
  const stats = [
    { label: 'Návštevnosť', value: data.visits.toLocaleString('sk-SK'), color: '#4ade80' },
    { label: 'Konverzie', value: String(data.conversions), color: t.accent },
    { label: 'Príjmy', value: `${data.revenue.toLocaleString('sk-SK')} €`, color: '#60a5fa' },
    { label: 'Bounce rate', value: `${data.bounce}%`, color: '#fb923c' },
  ];

  const W = 480, H = 160, pad = 40;

  return (
    <Section id="analytics" title="Data Analytics" desc="Interaktívny dashboard s real-time dátami a vizualizáciami.">
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={toggleRealtime}
          style={{ padding: '12px 24px', background: running ? 'rgba(248,113,113,0.15)' : `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`, color: running ? '#f87171' : (t.isLight ? '#fff' : t.bg), border: running ? '1px solid rgba(248,113,113,0.3)' : 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
          {running ? '⏸ Zastaviť' : '▶ Spustiť real-time'}
        </button>
        {running && <span style={{ fontSize: 12, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', animation: 'pulse 1s infinite' }} /> Live</span>}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, transition: 'all 0.3s' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {/* Bar chart */}
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.accent, marginBottom: 16 }}>Návštevnosť (týždeň)</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
            {bars.map((b, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  height: `${Math.max(8, (b.value / maxBar) * 120)}px`,
                  background: `linear-gradient(180deg, ${t.accent}, ${t.accentLight}40)`,
                  borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease',
                  marginBottom: 6,
                }} />
                <div style={{ fontSize: 10, color: t.textMuted }}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Line chart */}
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.accent, marginBottom: 16 }}>Konverzie (trend)</div>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
            <defs>
              <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={t.accent} stopOpacity="0.3" />
                <stop offset="100%" stopColor={t.accent} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid */}
            {[0, 1, 2, 3].map(i => (
              <line key={i} x1={pad} y1={10 + (H - 30) * i / 3} x2={W - 10} y2={10 + (H - 30) * i / 3} stroke={t.border} strokeWidth={0.5} />
            ))}
            {/* Fill area */}
            <path d={`M${pad},${H - 20 - ((line[0] / maxLine) * (H - 40))} ${line.map((v, i) => `L${pad + i * ((W - pad - 10) / (line.length - 1))},${H - 20 - ((v / maxLine) * (H - 40))}`).join(' ')} L${W - 10},${H - 20} L${pad},${H - 20} Z`}
              fill="url(#lineFill)" />
            {/* Line */}
            <polyline
              points={line.map((v, i) => `${pad + i * ((W - pad - 10) / (line.length - 1))},${H - 20 - ((v / maxLine) * (H - 40))}`).join(' ')}
              fill="none" stroke={t.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: 'all 0.5s' }} />
            {/* Dots */}
            {line.map((v, i) => (
              <circle key={i} cx={pad + i * ((W - pad - 10) / (line.length - 1))} cy={H - 20 - ((v / maxLine) * (H - 40))}
                r={3} fill={t.accent} style={{ transition: 'all 0.5s' }} />
            ))}
          </svg>
        </div>

        {/* Pie chart */}
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.accent, marginBottom: 16 }}>Zdroje návštevnosti</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <svg width={120} height={120} viewBox="0 0 120 120">
              {(() => {
                let offset = 0;
                return pieData.map((slice, i) => {
                  const dashArray = `${(slice.pct / 100) * 314} 314`;
                  const dashOffset = -offset * 314 / 100;
                  offset += slice.pct;
                  return <circle key={i} cx={60} cy={60} r={50} fill="none" stroke={slice.color} strokeWidth={18}
                    strokeDasharray={dashArray} strokeDashoffset={dashOffset}
                    transform="rotate(-90 60 60)" style={{ transition: 'all 0.5s' }} />;
                });
              })()}
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pieData.map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: t.text }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
                  {s.label} <span style={{ color: t.textMuted }}>({s.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
function PageContent() {
  const { t } = useTheme();
  const sections = [
    { id: 'chatbot', label: 'AI Chatbot' },
    { id: 'email', label: 'Email' },
    { id: 'invoice', label: 'Faktúry' },
    { id: 'analytics', label: 'Analytika' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: t.bg, color: t.text, fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Hero */}
      <section style={{
        padding: '120px 24px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 500, height: 500, borderRadius: '50%',
          background: `radial-gradient(circle, ${t.accent}10, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: t.accent, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>
            Interaktívne ukážky
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading), Playfair Display, serif', fontWeight: 400,
            fontSize: 'clamp(32px, 5vw, 52px)', marginBottom: 16, lineHeight: 1.15,
          }}>
            AI & Automatizácia <span style={{ color: t.accent }}>v akcii</span>
          </h1>
          <p style={{ fontSize: 16, color: t.textMuted, maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Pozrite si naživo, ako AI a automatizácia šetria čas a zarábajú peniaze. Každá ukážka je interaktívna — skúste si to.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`}
                style={{
                  padding: '10px 20px', borderRadius: 8, textDecoration: 'none',
                  background: t.bgCard, border: `1px solid ${t.border}`,
                  color: t.text, fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
                }}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <ChatbotDemo />
      <EmailAutomationDemo />
      <InvoiceDemo />
      <AnalyticsDemo />

      <style>{`
        @media (max-width: 768px) {
          section > div > div[style*="grid-template-columns: 1fr 260px"],
          section > div > div[style*="grid-template-columns: 300px 1fr"] {
            display: flex !important;
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function AIAutomationPage() {
  return (
    <DemoProvider>
      <BackToVassweb />
      <ThemeSwitcher />
      <PageContent />
      <PoweredByVassweb />
    </DemoProvider>
  );
}
