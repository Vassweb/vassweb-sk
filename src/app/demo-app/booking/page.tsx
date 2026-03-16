'use client';
import { useState, useMemo } from 'react';
import { DemoProvider, ThemeSwitcher, PoweredByVassweb, useTheme } from '@/components/DemoTheme';

/* ── Types ── */
interface Service { id: string; name: string; duration: string; price: number; priceLabel: string; icon: string; desc: string }
interface Booking { id: string; name: string; email: string; phone: string; service: string; date: string; time: string; status: 'potvrdené' | 'čakajúce'; price: number; notes: string }

const SERVICES: Service[] = [
  { id: 'consult', name: 'Konzultácia', duration: '30 min', price: 0, priceLabel: 'Zadarmo', icon: '💬', desc: 'Úvodný rozhovor o vašom projekte' },
  { id: 'audit', name: 'Web Audit', duration: '60 min', price: 49, priceLabel: '49 €', icon: '🔍', desc: 'Kompletná analýza vášho webu' },
  { id: 'design', name: 'Dizajn Workshop', duration: '90 min', price: 99, priceLabel: '99 €', icon: '🎨', desc: 'Interaktívny dizajnový workshop' },
  { id: 'strategy', name: 'Full Strategy', duration: '120 min', price: 199, priceLabel: '199 €', icon: '🚀', desc: 'Celková digitálna stratégia' },
];

const TIMES = ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
const STEPS = ['Služba', 'Dátum', 'Čas', 'Údaje', 'Hotovo'];
const MONTHS_SK = ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December'];
const DAYS_SK = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

function seedRandom(seed: number) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

function getTakenSlots(dateStr: string): Set<string> {
  const seed = dateStr.split('-').reduce((a, b) => a + parseInt(b), 0) * 7;
  const rng = seedRandom(seed);
  const taken = new Set<string>();
  TIMES.forEach(t => { if (rng() < 0.3) taken.add(t); });
  return taken;
}

const DEMO_BOOKINGS: Booking[] = [
  { id: 'b1', name: 'Ján Kováč', email: 'jan@firma.sk', phone: '+421 901 234 567', service: 'Web Audit', date: '2026-03-16', time: '10:00', status: 'potvrdené', price: 49, notes: '' },
  { id: 'b2', name: 'Mária Nováková', email: 'maria@email.sk', phone: '+421 902 345 678', service: 'Full Strategy', date: '2026-03-17', time: '14:00', status: 'potvrdené', price: 199, notes: 'Záujem o e-shop' },
  { id: 'b3', name: 'Peter Horváth', email: 'peter@startup.sk', phone: '+421 903 456 789', service: 'Konzultácia', date: '2026-03-18', time: '9:00', status: 'čakajúce', price: 0, notes: '' },
  { id: 'b4', name: 'Eva Szabóová', email: 'eva@design.sk', phone: '+421 904 567 890', service: 'Dizajn Workshop', date: '2026-03-19', time: '13:00', status: 'potvrdené', price: 99, notes: 'Rebranding' },
  { id: 'b5', name: 'Tomáš Baláž', email: 'tomas@corp.sk', phone: '+421 905 678 901', service: 'Web Audit', date: '2026-03-20', time: '15:00', status: 'čakajúce', price: 49, notes: '' },
];

/* ── Main Wrapper ── */
export default function BookingPage() {
  return (
    <DemoProvider defaultTheme="elegance">
      <BookingApp />
    </DemoProvider>
  );
}

function BookingApp() {
  const { t } = useTheme();
  const [adminView, setAdminView] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [bookings, setBookings] = useState<Booking[]>(DEMO_BOOKINGS);
  const [adminFilter, setAdminFilter] = useState<string>('všetky');

  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const takenSlots = useMemo(() => selectedDate ? getTakenSlots(selectedDate) : new Set<string>(), [selectedDate]);

  const canNext = step === 0 ? !!selectedService : step === 1 ? !!selectedDate : step === 2 ? !!selectedTime : step === 3 ? (form.name && form.email) : true;

  function handleSubmit() {
    const svc = SERVICES.find(s => s.id === selectedService)!;
    const newBooking: Booking = {
      id: `b${Date.now()}`, name: form.name, email: form.email, phone: form.phone,
      service: svc.name, date: selectedDate!, time: selectedTime!, status: 'čakajúce',
      price: svc.price, notes: form.notes,
    };
    setBookings(prev => [...prev, newBooking]);
    setStep(4);
  }

  function resetWizard() {
    setStep(0); setSelectedService(null); setSelectedDate(null); setSelectedTime(null);
    setForm({ name: '', email: '', phone: '', notes: '' });
  }

  const font = 'Inter, system-ui, -apple-system, sans-serif';
  const trans = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';

  /* ── Shared Styles ── */
  const btnBase = (primary?: boolean): React.CSSProperties => ({
    padding: '12px 28px', borderRadius: 12, border: primary ? 'none' : `1px solid ${t.border}`,
    background: primary ? t.accent : 'transparent', color: primary ? (t.isLight ? '#fff' : '#000') : t.text,
    fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: trans, fontFamily: font,
    opacity: primary && !canNext ? 0.4 : 1, pointerEvents: primary && !canNext ? 'none' : 'auto',
  });

  /* ── Calendar helpers ── */
  function calendarDays() {
    const first = new Date(calYear, calMonth, 1);
    const lastDay = new Date(calYear, calMonth + 1, 0).getDate();
    let startDay = first.getDay() - 1; if (startDay < 0) startDay = 6;
    const days: (number | null)[] = Array(startDay).fill(null);
    for (let i = 1; i <= lastDay; i++) days.push(i);
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }

  function dateStr(day: number) {
    return `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function isPast(day: number) {
    const d = new Date(calYear, calMonth, day); d.setHours(0, 0, 0, 0);
    return d < today;
  }

  function isWeekend(day: number) {
    const d = new Date(calYear, calMonth, day).getDay();
    return d === 0 || d === 6;
  }

  /* ── Admin Stats ── */
  const filteredBookings = adminFilter === 'všetky' ? bookings : bookings.filter(b => b.status === adminFilter);
  const totalRevenue = bookings.reduce((s, b) => s + b.price, 0);
  const todayBookings = bookings.filter(b => b.date === today.toISOString().split('T')[0]).length;

  return (
    <div style={{ minHeight: '100vh', background: t.bg, color: t.text, fontFamily: font, transition: trans }}>
      <ThemeSwitcher />

      {/* ── Header ── */}
      <div style={{ padding: '40px 24px 0', maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            <span style={{ color: t.accent }}>Vassweb</span> Booking
          </h1>
          <p style={{ margin: '4px 0 0', color: t.textMuted, fontSize: 14 }}>Rezervačný systém</p>
        </div>
        <button onClick={() => { setAdminView(!adminView); }} style={{
          padding: '10px 20px', borderRadius: 10, border: `1px solid ${t.border}`,
          background: adminView ? t.accent : 'transparent',
          color: adminView ? (t.isLight ? '#fff' : '#000') : t.textMuted,
          fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: trans, fontFamily: font,
        }}>
          {adminView ? '← Späť na booking' : 'Admin pohľad'}
        </button>
      </div>

      {adminView ? (
        /* ════════ ADMIN VIEW ════════ */
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 60px' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
            {[
              { label: 'Celkové rezervácie', value: bookings.length },
              { label: 'Dnešné rezervácie', value: todayBookings },
              { label: 'Celkový príjem', value: `${totalRevenue} €` },
            ].map(s => (
              <div key={s.label} style={{
                background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: '24px',
                transition: trans,
              }}>
                <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: t.accent }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {['všetky', 'potvrdené', 'čakajúce'].map(f => (
              <button key={f} onClick={() => setAdminFilter(f)} style={{
                padding: '8px 18px', borderRadius: 8, border: `1px solid ${adminFilter === f ? t.accent : t.border}`,
                background: adminFilter === f ? `${t.accent}18` : 'transparent',
                color: adminFilter === f ? t.accent : t.textMuted,
                fontWeight: 500, fontSize: 13, cursor: 'pointer', transition: trans, fontFamily: font,
                textTransform: 'capitalize',
              }}>
                {f}
              </button>
            ))}
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto', borderRadius: 16, border: `1px solid ${t.border}`, background: t.bgCard }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Meno', 'Služba', 'Dátum', 'Čas', 'Cena', 'Stav'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: t.textMuted, fontWeight: 500, borderBottom: `1px solid ${t.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(b => (
                  <tr key={b.id} style={{ transition: trans }}>
                    <td style={{ padding: '14px 16px', borderBottom: `1px solid ${t.border}` }}>
                      <div style={{ fontWeight: 600 }}>{b.name}</div>
                      <div style={{ color: t.textMuted, fontSize: 12 }}>{b.email}</div>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: `1px solid ${t.border}` }}>{b.service}</td>
                    <td style={{ padding: '14px 16px', borderBottom: `1px solid ${t.border}`, whiteSpace: 'nowrap' }}>{b.date}</td>
                    <td style={{ padding: '14px 16px', borderBottom: `1px solid ${t.border}` }}>{b.time}</td>
                    <td style={{ padding: '14px 16px', borderBottom: `1px solid ${t.border}`, fontWeight: 600 }}>{b.price === 0 ? 'Zadarmo' : `${b.price} €`}</td>
                    <td style={{ padding: '14px 16px', borderBottom: `1px solid ${t.border}` }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        background: b.status === 'potvrdené' ? `${t.accent}20` : `${t.textMuted}15`,
                        color: b.status === 'potvrdené' ? t.accent : t.textMuted,
                      }}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ════════ BOOKING WIZARD ════════ */
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 60px' }}>
          {/* Step Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40, flexWrap: 'wrap' }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10, background: i === step ? `${t.accent}18` : 'transparent', transition: trans }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, transition: trans,
                    background: i < step ? t.accent : i === step ? t.accent : 'transparent',
                    color: i <= step ? (t.isLight ? '#fff' : '#000') : t.textMuted,
                    border: i > step ? `2px solid ${t.border}` : 'none',
                  }}>
                    {i < step ? '✓' : i === 4 ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: i === step ? 600 : 400, color: i === step ? t.text : t.textMuted, transition: trans, display: 'block' }}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 24, height: 2, background: i < step ? t.accent : t.border, transition: trans, flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div style={{ minHeight: 360 }}>

            {/* ── Step 0: Service ── */}
            {step === 0 && (
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Vyberte službu</h2>
                <p style={{ color: t.textMuted, fontSize: 14, marginBottom: 24 }}>Zvoľte typ konzultácie, ktorý vám vyhovuje.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                  {SERVICES.map(svc => {
                    const sel = selectedService === svc.id;
                    return (
                      <div key={svc.id} onClick={() => setSelectedService(svc.id)} style={{
                        background: t.bgCard, border: `2px solid ${sel ? t.accent : t.border}`,
                        borderRadius: 16, padding: '24px 20px', cursor: 'pointer', transition: trans,
                        boxShadow: sel ? `0 0 0 4px ${t.accent}15` : 'none',
                        transform: sel ? 'translateY(-2px)' : 'none',
                      }}>
                        <div style={{ fontSize: 32, marginBottom: 12 }}>{svc.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{svc.name}</div>
                        <div style={{ color: t.textMuted, fontSize: 13, marginBottom: 12 }}>{svc.desc}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 12, color: t.textMuted }}>{svc.duration}</span>
                          <span style={{ fontWeight: 700, color: t.accent, fontSize: 15 }}>{svc.priceLabel}</span>
                        </div>
                        {sel && <div style={{ width: 20, height: 20, borderRadius: '50%', background: t.accent, color: t.isLight ? '#fff' : '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, position: 'absolute' as const, top: 12, right: 12 }}>✓</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Step 1: Calendar ── */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Vyberte dátum</h2>
                <p style={{ color: t.textMuted, fontSize: 14, marginBottom: 24 }}>Zvoľte si deň, ktorý vám vyhovuje.</p>
                <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 20, padding: 28, maxWidth: 420, margin: '0 auto' }}>
                  {/* Month nav */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.border}`, background: 'transparent', color: t.text, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: trans, fontFamily: font }}>‹</button>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{MONTHS_SK[calMonth]} {calYear}</span>
                    <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.border}`, background: 'transparent', color: t.text, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: trans, fontFamily: font }}>›</button>
                  </div>
                  {/* Day headers */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
                    {DAYS_SK.map(d => (
                      <div key={d} style={{ textAlign: 'center', fontSize: 12, color: t.textMuted, fontWeight: 600, padding: '4px 0' }}>{d}</div>
                    ))}
                  </div>
                  {/* Days */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                    {calendarDays().map((day, i) => {
                      if (day === null) return <div key={`e${i}`} />;
                      const ds = dateStr(day);
                      const past = isPast(day);
                      const weekend = isWeekend(day);
                      const disabled = past || weekend;
                      const sel = selectedDate === ds;
                      const isToday = ds === today.toISOString().split('T')[0];
                      return (
                        <button key={i} disabled={disabled} onClick={() => { setSelectedDate(ds); setSelectedTime(null); }}
                          style={{
                            width: '100%', aspectRatio: '1', borderRadius: 10, border: 'none',
                            background: sel ? t.accent : isToday ? `${t.accent}18` : 'transparent',
                            color: sel ? (t.isLight ? '#fff' : '#000') : disabled ? `${t.textMuted}60` : t.text,
                            fontWeight: sel || isToday ? 700 : 400, fontSize: 14, cursor: disabled ? 'default' : 'pointer',
                            transition: trans, fontFamily: font, opacity: disabled ? 0.35 : 1,
                          }}>
                          {day}
                        </button>
                      );
                    })}
                  </div>
                  {selectedDate && (
                    <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: t.accent, fontWeight: 600 }}>
                      Vybrané: {selectedDate}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Step 2: Time Slots ── */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Vyberte čas</h2>
                <p style={{ color: t.textMuted, fontSize: 14, marginBottom: 24 }}>Dostupné termíny pre {selectedDate}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12, maxWidth: 540, margin: '0 auto' }}>
                  {TIMES.map(time => {
                    const taken = takenSlots.has(time);
                    const sel = selectedTime === time;
                    return (
                      <button key={time} disabled={taken} onClick={() => setSelectedTime(time)}
                        style={{
                          padding: '18px 16px', borderRadius: 14,
                          border: `2px solid ${sel ? t.accent : taken ? 'transparent' : t.border}`,
                          background: sel ? t.accent : taken ? `${t.textMuted}08` : t.bgCard,
                          color: sel ? (t.isLight ? '#fff' : '#000') : taken ? `${t.textMuted}50` : t.text,
                          fontWeight: 700, fontSize: 16, cursor: taken ? 'not-allowed' : 'pointer',
                          transition: trans, fontFamily: font, opacity: taken ? 0.35 : 1,
                          textDecoration: taken ? 'line-through' : 'none',
                          boxShadow: sel ? `0 0 0 4px ${t.accent}15` : 'none',
                        }}>
                        {time}
                        <div style={{ fontSize: 11, fontWeight: 400, marginTop: 4, color: sel ? (t.isLight ? '#fff' : '#000') : taken ? t.textMuted : t.textMuted }}>
                          {taken ? 'Obsadené' : 'Voľné'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Step 3: Form ── */}
            {step === 3 && (
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Vaše údaje</h2>
                <p style={{ color: t.textMuted, fontSize: 14, marginBottom: 24 }}>Vyplňte kontaktné informácie na dokončenie rezervácie.</p>
                <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Booking summary mini */}
                  <div style={{ background: `${t.accent}08`, border: `1px solid ${t.accent}25`, borderRadius: 14, padding: '16px 20px', display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, marginBottom: 8 }}>
                    <div><span style={{ color: t.textMuted }}>Služba:</span> <strong>{SERVICES.find(s => s.id === selectedService)?.name}</strong></div>
                    <div><span style={{ color: t.textMuted }}>Dátum:</span> <strong>{selectedDate}</strong></div>
                    <div><span style={{ color: t.textMuted }}>Čas:</span> <strong>{selectedTime}</strong></div>
                  </div>
                  {[
                    { key: 'name', label: 'Meno a priezvisko', type: 'text', placeholder: 'Ján Kováč', required: true },
                    { key: 'email', label: 'E-mail', type: 'email', placeholder: 'jan@email.sk', required: true },
                    { key: 'phone', label: 'Telefón', type: 'tel', placeholder: '+421 9XX XXX XXX', required: false },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: t.text }}>
                        {f.label} {f.required && <span style={{ color: t.accent }}>*</span>}
                      </label>
                      <input
                        type={f.type} placeholder={f.placeholder}
                        value={(form as Record<string, string>)[f.key]}
                        onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        style={{
                          width: '100%', padding: '14px 16px', borderRadius: 12, fontSize: 14,
                          border: `1px solid ${t.border}`, background: t.bgCard, color: t.text,
                          fontFamily: font, transition: trans, outline: 'none', boxSizing: 'border-box',
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = t.accent; }}
                        onBlur={e => { e.currentTarget.style.borderColor = t.border; }}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: t.text }}>Poznámky</label>
                    <textarea
                      placeholder="Voliteľné poznámky..."
                      value={form.notes}
                      onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      style={{
                        width: '100%', padding: '14px 16px', borderRadius: 12, fontSize: 14,
                        border: `1px solid ${t.border}`, background: t.bgCard, color: t.text,
                        fontFamily: font, transition: trans, outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = t.accent; }}
                      onBlur={e => { e.currentTarget.style.borderColor = t.border; }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 4: Success ── */}
            {step === 4 && (
              <div style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%', background: `${t.accent}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                  fontSize: 36, border: `3px solid ${t.accent}`,
                }}>
                  ✓
                </div>
                <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Rezervácia odoslaná!</h2>
                <p style={{ color: t.textMuted, fontSize: 14, marginBottom: 32 }}>Ďakujeme, {form.name}. Potvrdenie bude zaslané na {form.email}.</p>
                <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 18, padding: 28, textAlign: 'left' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: t.accent }}>Zhrnutie rezervácie</h3>
                  {[
                    { label: 'Služba', value: SERVICES.find(s => s.id === selectedService)?.name },
                    { label: 'Dátum', value: selectedDate },
                    { label: 'Čas', value: selectedTime },
                    { label: 'Trvanie', value: SERVICES.find(s => s.id === selectedService)?.duration },
                    { label: 'Cena', value: SERVICES.find(s => s.id === selectedService)?.priceLabel },
                    { label: 'Meno', value: form.name },
                    { label: 'E-mail', value: form.email },
                    ...(form.phone ? [{ label: 'Telefón', value: form.phone }] : []),
                    ...(form.notes ? [{ label: 'Poznámky', value: form.notes }] : []),
                  ].map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 7 ? `1px solid ${t.border}` : 'none', fontSize: 14 }}>
                      <span style={{ color: t.textMuted }}>{r.label}</span>
                      <span style={{ fontWeight: 600 }}>{r.value}</span>
                    </div>
                  ))}
                </div>
                <button onClick={resetWizard} style={{ ...btnBase(true), marginTop: 28 }}>
                  Nová rezervácia
                </button>
              </div>
            )}
          </div>

          {/* Navigation */}
          {step < 4 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, gap: 12 }}>
              {step > 0 ? (
                <button onClick={() => setStep(s => s - 1)} style={btnBase()}>← Späť</button>
              ) : <div />}
              {step < 3 ? (
                <button onClick={() => { if (canNext) setStep(s => s + 1); }} style={btnBase(true)}>
                  Ďalej →
                </button>
              ) : step === 3 ? (
                <button onClick={() => { if (canNext) handleSubmit(); }} style={btnBase(true)}>
                  Odoslať rezerváciu
                </button>
              ) : null}
            </div>
          )}
        </div>
      )}

      <PoweredByVassweb />

      <style>{`
        @keyframes demoFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; }
        input::placeholder, textarea::placeholder { color: ${t.textMuted}; }
        button:hover { filter: brightness(1.08); }
        @media (max-width: 600px) {
          h1 { font-size: 22px !important; }
          h2 { font-size: 18px !important; }
        }
      `}</style>
    </div>
  );
}
