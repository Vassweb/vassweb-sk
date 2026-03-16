'use client';

import { useState, useEffect, useRef, CSSProperties } from 'react';
import { DemoProvider, ThemeSwitcher, PoweredByVassweb, useTheme } from '@/components/DemoTheme';

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        obs.disconnect();
      }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Section({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  const ref = useFadeIn();
  return <div ref={ref} style={style}>{children}</div>;
}

const categories = [
  { name: 'Damske', icon: '👗', count: 124 },
  { name: 'Panske', icon: '👔', count: 98 },
  { name: 'Doplnky', icon: '👜', count: 67 },
  { name: 'Novinky', icon: '✨', count: 32 },
];

const products = [
  { name: 'Kozena bunda', price: '149', category: 'Damske', tag: 'Bestseller' },
  { name: 'Bavlnene tricko', price: '29', category: 'Panske', tag: null },
  { name: 'Dzinsove nohavice', price: '69', category: 'Damske', tag: 'Novinka' },
  { name: 'Kosela Slim Fit', price: '45', category: 'Panske', tag: null },
  { name: 'Kozena kabelka', price: '89', category: 'Doplnky', tag: 'Bestseller' },
  { name: 'Zimny kabat', price: '199', category: 'Damske', tag: 'Zlavnene' },
  { name: 'Sportove tenisky', price: '79', category: 'Panske', tag: 'Novinka' },
  { name: 'Hodvabna satal', price: '39', category: 'Doplnky', tag: null },
];

const features = [
  { icon: '🚚', title: 'Doprava zadarmo', desc: 'Pri objednavkach nad 50 EUR dorucime zadarmo po celom Slovensku.' },
  { icon: '↩️', title: 'Vratenie do 30 dni', desc: 'Nie ste spokojni? Tovar mozete vratit bez udania dovodu.' },
  { icon: '🔒', title: 'Bezpecna platba', desc: 'Vsetky platby su zabezpecene sifrovanim SSL certifikatom.' },
  { icon: '💬', title: '24/7 Podpora', desc: 'Nas tym je tu pre vas nonstop — cez chat, email aj telefon.' },
];

function PageContent() {
  const { t } = useTheme();
  const [email, setEmail] = useState('');
  const [cart, setCart] = useState<string[]>([]);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);

  const heading: CSSProperties = {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: 800,
    color: t.text,
    margin: 0,
  };

  const addToCart = (name: string) => {
    setCart(prev => [...prev, name]);
    setTimeout(() => setCart(prev => { const i = prev.lastIndexOf(name); return [...prev.slice(0, i), ...prev.slice(i + 1)]; }), 1500);
  };

  return (
    <div style={{ background: t.bg, color: t.text, minHeight: '100vh' }}>
      <style>{`html { scroll-behavior: smooth; }`}</style>

      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 24px', position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg, ${t.bg}, ${t.bgCard})`,
      }}>
        <div style={{
          position: 'absolute', top: '10%', right: '10%', width: 300, height: 300,
          borderRadius: '50%', background: `${t.accent}08`, filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', left: '5%', width: 200, height: 200,
          borderRadius: '50%', background: `${t.accent}06`, filter: 'blur(60px)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block', padding: '6px 20px', fontSize: 12, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: t.accent, border: `1px solid ${t.accent}33`,
            borderRadius: 999, marginBottom: 32, fontWeight: 600,
          }}>
            Novy e-shop 2026
          </div>
          <h1 style={{ ...heading, fontSize: 'clamp(48px, 10vw, 88px)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Moda<span style={{ color: t.accent }}>Shop</span>
          </h1>
          <p style={{ fontSize: 'clamp(16px, 3vw, 20px)', color: t.textMuted, marginTop: 16, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Styl pre kazdy den. Objavte najnovsie trendy v mode za dostupne ceny.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
            <a href="#produkty" style={{
              padding: '16px 40px', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', textDecoration: 'none', borderRadius: 8,
              color: t.isLight ? '#fff' : t.bg, background: t.accent, transition: 'transform 0.2s',
            }}>
              Nakupovat
            </a>
            <a href="#kategorie" style={{
              padding: '16px 40px', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', textDecoration: 'none', borderRadius: 8,
              color: t.text, background: 'transparent', border: `2px solid ${t.border}`,
              transition: 'border-color 0.2s',
            }}>
              Kategorie
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="kategorie" style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px' }}>
        <Section>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: t.accent, marginBottom: 8, fontWeight: 600 }}>Prehladajte</p>
            <h2 style={{ ...heading, fontSize: 'clamp(28px, 5vw, 44px)' }}>Kategorie</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {categories.map((cat, i) => {
              const isHovered = hoveredCat === cat.name;
              return (
                <div
                  key={cat.name}
                  onMouseEnter={() => setHoveredCat(cat.name)}
                  onMouseLeave={() => setHoveredCat(null)}
                  style={{
                    padding: '40px 24px', borderRadius: 16, textAlign: 'center', cursor: 'pointer',
                    background: isHovered ? `${t.accent}12` : t.bgCard,
                    border: `1px solid ${isHovered ? t.accent + '40' : t.border}`,
                    transition: 'all 0.3s', transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: isHovered ? `0 16px 48px ${t.accent}15` : 'none',
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 16 }}>{cat.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 6 }}>{cat.name}</div>
                  <div style={{ fontSize: 13, color: t.textMuted }}>{cat.count} produktov</div>
                </div>
              );
            })}
          </div>
        </Section>
      </section>

      {/* Products */}
      <section id="produkty" style={{ background: t.bgCard, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px' }}>
          <Section>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: t.accent, marginBottom: 8, fontWeight: 600 }}>Najpredavanejsie</p>
              <h2 style={{ ...heading, fontSize: 'clamp(28px, 5vw, 44px)' }}>Produkty</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {products.map((prod, i) => {
                const isHovered = hoveredProduct === prod.name;
                const inCart = cart.includes(prod.name);
                return (
                  <div
                    key={prod.name}
                    onMouseEnter={() => setHoveredProduct(prod.name)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    style={{
                      borderRadius: 12, overflow: 'hidden',
                      background: t.bg, border: `1px solid ${t.border}`,
                      transition: 'all 0.3s', transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                      boxShadow: isHovered ? `0 12px 40px ${t.accent}12` : 'none',
                    }}
                  >
                    {/* Product image placeholder */}
                    <div style={{
                      aspectRatio: '1/1', position: 'relative', overflow: 'hidden',
                      background: `linear-gradient(${140 + i * 30}deg, ${t.accent}15, ${t.bgCard}, ${t.accent}08)`,
                    }}>
                      <div style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'transform 0.5s ease',
                        transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                      }}>
                        <div style={{
                          width: 64, height: 64, borderRadius: '50%',
                          border: `2px solid ${t.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, color: t.textMuted, letterSpacing: '0.05em',
                        }}>
                          Foto
                        </div>
                      </div>
                      {prod.tag && (
                        <span style={{
                          position: 'absolute', top: 12, left: 12, padding: '4px 12px',
                          fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                          borderRadius: 6, color: t.isLight ? '#fff' : t.bg, background: t.accent,
                        }}>
                          {prod.tag}
                        </span>
                      )}
                    </div>
                    {/* Product info */}
                    <div style={{ padding: '20px 20px 24px' }}>
                      <div style={{ fontSize: 11, color: t.accent, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 6 }}>
                        {prod.category}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 12 }}>
                        {prod.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <span style={{ fontSize: 20, fontWeight: 800, color: t.text }}>{prod.price} &euro;</span>
                        <button
                          onClick={() => addToCart(prod.name)}
                          style={{
                            padding: '10px 20px', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em',
                            textTransform: 'uppercase', cursor: 'pointer', borderRadius: 8, border: 'none',
                            color: inCart ? (t.isLight ? '#fff' : t.bg) : t.accent,
                            background: inCart ? t.accent : `${t.accent}15`,
                            transition: 'all 0.3s',
                          }}
                        >
                          {inCart ? 'Pridane ✓' : 'Do kosika'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>
      </section>

      {/* Features / USPs */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px' }}>
        <Section>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: t.accent, marginBottom: 8, fontWeight: 600 }}>Preco my</p>
            <h2 style={{ ...heading, fontSize: 'clamp(28px, 5vw, 44px)' }}>Preco nakupovat u nas</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {features.map((feat) => (
              <div key={feat.title} style={{
                padding: '36px 28px', borderRadius: 16, background: t.bgCard,
                border: `1px solid ${t.border}`, textAlign: 'center',
                transition: 'border-color 0.3s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = t.accent + '50'}
                onMouseLeave={e => e.currentTarget.style.borderColor = t.border}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{feat.icon}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: t.text, marginBottom: 10 }}>{feat.title}</div>
                <div style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.7 }}>{feat.desc}</div>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* Newsletter */}
      <section style={{ background: t.bgCard, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
          <Section>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', margin: '0 auto 24px',
              background: `${t.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28,
            }}>
              ✉
            </div>
            <h2 style={{ ...heading, fontSize: 'clamp(28px, 5vw, 40px)', marginBottom: 12 }}>
              Budte v obraze
            </h2>
            <p style={{ fontSize: 16, color: t.textMuted, lineHeight: 1.7, maxWidth: 440, margin: '0 auto 36px' }}>
              Prihlaste sa k odberu noviniek a ziskajte 10% zlavu na prvu objednavku. Ziaden spam, len moda.
            </p>
            <form onSubmit={e => e.preventDefault()} style={{
              display: 'flex', gap: 12, maxWidth: 460, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center',
            }}>
              <input
                type="email" placeholder="vas@email.sk" value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  flex: '1 1 240px', padding: '16px 20px', fontSize: 15, background: t.bg,
                  color: t.text, border: `1px solid ${t.border}`, borderRadius: 8, outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.currentTarget.style.borderColor = t.accent}
                onBlur={e => e.currentTarget.style.borderColor = t.border}
              />
              <button type="submit" style={{
                padding: '16px 32px', fontSize: 14, fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', cursor: 'pointer', borderRadius: 8, border: 'none',
                color: t.isLight ? '#fff' : t.bg, background: t.accent, transition: 'opacity 0.2s',
                whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Odoslat
              </button>
            </form>
            <p style={{ fontSize: 12, color: t.textMuted, marginTop: 16 }}>
              Odberom suhlasite so spracovanim vasho emailu. Kedykolvek sa mozete odhlasit.
            </p>
          </Section>
        </div>
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <DemoProvider>
      <ThemeSwitcher />
      <PageContent />
      <PoweredByVassweb />
    </DemoProvider>
  );
}
