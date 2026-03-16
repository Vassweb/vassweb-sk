'use client';

import { useState } from 'react';
import { DemoProvider, ThemeSwitcher, PoweredByVassweb, BackToVassweb, useTheme } from '@/components/DemoTheme';

const font = 'Inter, system-ui, sans-serif';

const schedule = [
  { time: '07:00', po: 'Yoga', ut: 'Spinning', st: 'Pilates', stv: 'CrossFit', pi: 'Yoga' },
  { time: '09:00', po: 'CrossFit', ut: 'Box', st: 'Yoga', stv: 'Spinning', pi: 'Pilates' },
  { time: '11:00', po: 'Pilates', ut: 'Yoga', st: 'CrossFit', stv: 'Box', pi: 'Spinning' },
  { time: '16:00', po: 'Spinning', ut: 'CrossFit', st: 'Box', stv: 'Yoga', pi: 'CrossFit' },
  { time: '18:00', po: 'Box', ut: 'Pilates', st: 'Spinning', stv: 'Pilates', pi: 'Box' },
  { time: '20:00', po: 'CrossFit', ut: 'Spinning', st: 'Yoga', stv: 'CrossFit', pi: 'Pilates' },
];

const days = ['Po', 'Ut', 'St', 'Štv', 'Pi'];
const dayKeys = ['po', 'ut', 'st', 'stv', 'pi'] as const;

const trainers = [
  { initials: 'MK', name: 'Marek Kováč', spec: 'CrossFit & Silový tréning', bio: 'Certifikovaný CrossFit tréner s 8-ročnými skúsenosťami. Pomáha klientom prekonávať limity.' },
  { initials: 'LN', name: 'Lucia Nováková', spec: 'Yoga & Pilates', bio: 'Inštruktorka s medzinárodnou certifikáciou. Špecializuje sa na regeneráciu a flexibilitu.' },
  { initials: 'TH', name: 'Tomáš Horváth', spec: 'Box & MMA', bio: 'Bývalý profesionálny boxer. Vedie skupinové aj individuálne tréningy pre všetky úrovne.' },
  { initials: 'AV', name: 'Anna Vargová', spec: 'Spinning & Cardio', bio: 'Energická trénerka, ktorá motivuje k maximálnemu výkonu. Jej lekcie sú vždy plné.' },
];

const plans = [
  { name: 'Základ', price: '29', features: ['Prístup k zariadeniam', 'Skupinové lekcie (3x/týždeň)', 'Šatňa a sprchy', 'Základný tréningový plán'], featured: false },
  { name: 'Premium', price: '49', features: ['Neobmedzený prístup', 'Všetky skupinové lekcie', 'Osobný tréner (1x/mes)', 'Sauna & wellness', 'Výživové poradenstvo'], featured: true },
  { name: 'VIP', price: '79', features: ['Všetko z Premium', 'Osobný tréner (4x/mes)', 'Privátna šatňa', 'Masáže (2x/mes)', 'Prioritné rezervácie', 'VIP zóna'], featured: false },
];

const features = [
  { icon: '⚡', title: 'Moderné vybavenie', desc: 'Najnovšie stroje a náradie od popredných značiek pre efektívny tréning.' },
  { icon: '🎯', title: 'Osobný prístup', desc: 'Individuálne tréningové plány prispôsobené vašim cieľom a kondícii.' },
  { icon: '👥', title: 'Skupinové lekcie', desc: 'Viac ako 30 lekcií týždenne — od jogy po intenzívny CrossFit.' },
  { icon: '🧖', title: 'Wellness & Sauna', desc: 'Relaxačná zóna so saunou, parnou kúpeľou a odpočinkovou miestnosťou.' },
];

function PageContent() {
  const { t } = useTheme();
  const [email, setEmail] = useState('');
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
  const [hoveredTrainer, setHoveredTrainer] = useState<number | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const section = (children: React.ReactNode, extra?: React.CSSProperties): React.CSSProperties => ({
    padding: '80px 24px',
    maxWidth: 1100,
    margin: '0 auto',
    ...extra,
  });

  return (
    <div style={{ background: t.bg, color: t.text, fontFamily: font, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @keyframes fitPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
        @keyframes fitSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fitGlow { 0%, 100% { box-shadow: 0 0 30px ${t.accent}33; } 50% { box-shadow: 0 0 60px ${t.accent}55; } }
      `}</style>

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 0%, ${t.accent}22 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, ${t.accent}11 0%, transparent 50%)`,
        }} />
        <div style={{ position: 'relative', zIndex: 1, animation: 'fitSlideUp 0.8s ease' }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 20px',
            borderRadius: 999,
            border: `1px solid ${t.border}`,
            background: `${t.accent}11`,
            color: t.accent,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.08em',
            marginBottom: 28,
            textTransform: 'uppercase',
          }}>
            Fitness & Wellness Studio
          </div>
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 800,
            margin: '0 0 20px',
            lineHeight: 1,
            background: `linear-gradient(135deg, ${t.text}, ${t.accent})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em',
          }}>
            FitZone
          </h1>
          <p style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
            color: t.textMuted,
            margin: '0 0 48px',
            maxWidth: 550,
            lineHeight: 1.6,
          }}>
            Tvoje telo. Tvoj cieľ. Naša energia.
          </p>
          <button style={{
            padding: '16px 48px',
            fontSize: 16,
            fontWeight: 700,
            borderRadius: 999,
            border: 'none',
            cursor: 'pointer',
            background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
            color: t.isLight ? '#fff' : '#000',
            letterSpacing: '0.04em',
            animation: 'fitGlow 3s ease infinite',
            transition: 'transform 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Skúsiť zadarmo
          </button>
        </div>
      </section>

      {/* Schedule */}
      <section style={section(null, { background: t.bgCard, borderRadius: 24, border: `1px solid ${t.border}`, padding: '60px 24px', marginBottom: 0 })}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
            Rozvrh lekcií
          </h2>
          <p style={{ textAlign: 'center', color: t.textMuted, marginBottom: 40, fontSize: 15 }}>
            Nájdi si lekciu, ktorá ti vyhovuje — pondelok až piatok
          </p>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '80px repeat(5, 1fr)',
              gap: 2,
              minWidth: 600,
            }}>
              {/* Header row */}
              <div style={{ padding: '12px 8px', fontWeight: 700, fontSize: 13, color: t.textMuted }} />
              {days.map(d => (
                <div key={d} style={{
                  padding: '12px 8px',
                  fontWeight: 700,
                  fontSize: 14,
                  textAlign: 'center',
                  color: t.accent,
                  background: `${t.accent}08`,
                  borderRadius: 8,
                }}>
                  {d}
                </div>
              ))}
              {/* Data rows */}
              {schedule.map((row, ri) => (
                <>
                  <div key={`t-${ri}`} style={{
                    padding: '14px 8px',
                    fontWeight: 600,
                    fontSize: 14,
                    color: t.accent,
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    {row.time}
                  </div>
                  {dayKeys.map((dk, di) => {
                    const cls = row[dk];
                    const colors: Record<string, string> = {
                      Yoga: '#10b981',
                      CrossFit: '#ef4444',
                      Box: '#f59e0b',
                      Spinning: '#06b6d4',
                      Pilates: '#a855f7',
                    };
                    return (
                      <div key={`${ri}-${di}`} style={{
                        padding: '14px 10px',
                        textAlign: 'center',
                        fontSize: 13,
                        fontWeight: 500,
                        borderRadius: 8,
                        background: `${colors[cls] || t.accent}12`,
                        border: `1px solid ${colors[cls] || t.accent}22`,
                        color: t.text,
                        transition: 'transform 0.15s, box-shadow 0.15s',
                      }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = `0 4px 20px ${colors[cls] || t.accent}33`;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {cls}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 }}>
            {['Yoga', 'CrossFit', 'Box', 'Spinning', 'Pilates'].map(cls => {
              const colors: Record<string, string> = { Yoga: '#10b981', CrossFit: '#ef4444', Box: '#f59e0b', Spinning: '#06b6d4', Pilates: '#a855f7' };
              return (
                <div key={cls} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: t.textMuted }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: colors[cls] }} />
                  {cls}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trainers */}
      <section style={section(null)}>
        <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
          Naši tréneri
        </h2>
        <p style={{ textAlign: 'center', color: t.textMuted, marginBottom: 48, fontSize: 15 }}>
          Profesionáli, ktorí ťa dovedú k výsledkom
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24,
        }}>
          {trainers.map((tr, i) => (
            <div key={i}
              onMouseEnter={() => setHoveredTrainer(i)}
              onMouseLeave={() => setHoveredTrainer(null)}
              style={{
                background: t.bgCard,
                border: `1px solid ${hoveredTrainer === i ? t.accent : t.border}`,
                borderRadius: 20,
                padding: '36px 24px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                transform: hoveredTrainer === i ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: hoveredTrainer === i ? `0 20px 40px ${t.accent}22` : 'none',
              }}
            >
              <div style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: 22,
                fontWeight: 800,
                color: t.isLight ? '#fff' : '#000',
                boxShadow: `0 8px 24px ${t.accent}44`,
              }}>
                {tr.initials}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px' }}>{tr.name}</h3>
              <p style={{ fontSize: 13, color: t.accent, fontWeight: 600, margin: '0 0 14px' }}>{tr.spec}</p>
              <p style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.6, margin: 0 }}>{tr.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={section(null)}>
        <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
          Cenník
        </h2>
        <p style={{ textAlign: 'center', color: t.textMuted, marginBottom: 48, fontSize: 15 }}>
          Vyber si plán, ktorý sedí tvojmu životnému štýlu
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          alignItems: 'stretch',
        }}>
          {plans.map((plan, i) => (
            <div key={i}
              onMouseEnter={() => setHoveredPlan(i)}
              onMouseLeave={() => setHoveredPlan(null)}
              style={{
                background: plan.featured ? `linear-gradient(160deg, ${t.accent}18, ${t.bgCard})` : t.bgCard,
                border: `${plan.featured ? 2 : 1}px solid ${plan.featured ? t.accent : hoveredPlan === i ? t.accent : t.border}`,
                borderRadius: 24,
                padding: '40px 28px',
                position: 'relative',
                transition: 'all 0.3s ease',
                transform: hoveredPlan === i ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: plan.featured ? `0 20px 50px ${t.accent}22` : hoveredPlan === i ? `0 16px 40px ${t.accent}15` : 'none',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {plan.featured && (
                <div style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
                  color: t.isLight ? '#fff' : '#000',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '5px 18px',
                  borderRadius: 999,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  Najpopulárnejší
                </div>
              )}
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>{plan.name}</h3>
              <div style={{ margin: '0 0 24px' }}>
                <span style={{
                  fontSize: 48,
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${t.text}, ${t.accent})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>{plan.price}€</span>
                <span style={{ fontSize: 14, color: t.textMuted }}>/mes</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', flex: 1 }}>
                {plan.features.map((f, fi) => (
                  <li key={fi} style={{
                    padding: '10px 0',
                    fontSize: 14,
                    color: t.textMuted,
                    borderBottom: fi < plan.features.length - 1 ? `1px solid ${t.border}` : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}>
                    <span style={{ color: t.accent, fontSize: 14, fontWeight: 700 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button style={{
                width: '100%',
                padding: '14px 24px',
                fontSize: 14,
                fontWeight: 700,
                borderRadius: 999,
                border: plan.featured ? 'none' : `1px solid ${t.accent}`,
                cursor: 'pointer',
                background: plan.featured ? `linear-gradient(135deg, ${t.accent}, ${t.accentLight})` : 'transparent',
                color: plan.featured ? (t.isLight ? '#fff' : '#000') : t.accent,
                transition: 'all 0.2s',
                letterSpacing: '0.02em',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                Vybrať plán
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={section(null)}>
        <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
          Prečo FitZone?
        </h2>
        <p style={{ textAlign: 'center', color: t.textMuted, marginBottom: 48, fontSize: 15 }}>
          Všetko, čo potrebuješ pod jednou strechou
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24,
        }}>
          {features.map((f, i) => (
            <div key={i}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{
                background: t.bgCard,
                border: `1px solid ${hoveredFeature === i ? t.accent : t.border}`,
                borderRadius: 20,
                padding: '32px 24px',
                transition: 'all 0.3s ease',
                transform: hoveredFeature === i ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hoveredFeature === i ? `0 16px 40px ${t.accent}18` : 'none',
              }}
            >
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: `${t.accent}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                marginBottom: 20,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 10px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 24px',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, ${t.accent}15 0%, transparent 70%)`,
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800,
            marginBottom: 16,
            background: `linear-gradient(135deg, ${t.text}, ${t.accent})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Prvá lekcia zadarmo
          </h2>
          <p style={{ color: t.textMuted, fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
            Zanechaj nám e-mail a my ti pošleme pozvánku na bezplatnú lekciu podľa tvojho výberu.
          </p>
          <div style={{
            display: 'flex',
            gap: 12,
            maxWidth: 460,
            margin: '0 auto',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tvoj@email.sk"
              style={{
                flex: '1 1 240px',
                padding: '14px 20px',
                fontSize: 15,
                borderRadius: 999,
                border: `1px solid ${t.border}`,
                background: t.bgCard,
                color: t.text,
                outline: 'none',
                fontFamily: font,
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = t.accent)}
              onBlur={e => (e.currentTarget.style.borderColor = t.border)}
            />
            <button style={{
              padding: '14px 36px',
              fontSize: 15,
              fontWeight: 700,
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
              color: t.isLight ? '#fff' : '#000',
              whiteSpace: 'nowrap',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Odoslať
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <DemoProvider>
      <BackToVassweb />
      <ThemeSwitcher />
      <PageContent />
      <PoweredByVassweb />
    </DemoProvider>
  );
}
