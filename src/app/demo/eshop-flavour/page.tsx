'use client';

import { useState, useEffect } from 'react';

const COLORS = {
  offwhite: '#f5f0eb',
  charcoal: '#1a1a1a',
  coral: '#e85d4a',
  beige: '#d4c5b5',
  lightbeige: '#ede6dd',
  midgray: '#6b6b6b',
  white: '#ffffff',
};

const products = [
  { id: 1, name: 'Letné šaty Midi', price: 79, oldPrice: 119, badge: '-34%', category: 'zeny', color: '#c9a8a0', color2: '#b08878' },
  { id: 2, name: 'Oversized mikina', price: 49, oldPrice: null, badge: 'Nové', category: 'zeny', color: '#8ea0b4', color2: '#6e8099' },
  { id: 3, name: 'Kožené tenisky', price: 89, oldPrice: 129, badge: '-31%', category: 'muzi', color: '#c8c0b0', color2: '#a89e8e' },
  { id: 4, name: 'Kabelka Tote', price: 59, oldPrice: null, badge: 'Nové', category: 'doplnky', color: '#b8a090', color2: '#987060' },
  { id: 5, name: 'Slim chino nohavice', price: 65, oldPrice: 89, badge: '-27%', category: 'muzi', color: '#9aac8a', color2: '#7a8c6a' },
  { id: 6, name: 'Hodvábna blúzka', price: 72, oldPrice: null, badge: 'Nové', category: 'zeny', color: '#c4b8d4', color2: '#a498b4' },
  { id: 7, name: 'Pletený šál', price: 29, oldPrice: 42, badge: '-31%', category: 'doplnky', color: '#d4a870', color2: '#b48850' },
  { id: 8, name: 'Bomber bunda', price: 109, oldPrice: 149, badge: '-27%', category: 'muzi', color: '#787878', color2: '#585858' },
];

const categories = [
  { key: 'vsetko', label: 'Všetko' },
  { key: 'zeny', label: 'Ženy' },
  { key: 'muzi', label: 'Muži' },
  { key: 'doplnky', label: 'Doplnky' },
];

const reviews = [
  { initials: 'M.K.', text: 'Kvalita oblečenia je výnimočná. Šaty Midi sú presne také, ako vyzerajú na fotkách — materiál je luxusný.', stars: 5 },
  { initials: 'P.H.', text: 'Doprava bola rýchla, balenie krásne. Vrátil som jednu veľkosť a nebbol žiadny problém. Odporúčam!', stars: 5 },
  { initials: 'L.B.', text: 'Konečne slovenský brand s európskou kvalitou. Bomber bunda je na celú sezónu, kúpim znova.', stars: 4 },
];

export default function FlavourEshop() {
  const [cartCount, setCartCount] = useState(3);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState('vsetko');
  const [cartAnim, setCartAnim] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const addToCart = (id: number) => {
    setCartCount(c => c + 1);
    setCartAnim(true);
    setAddedId(id);
    setTimeout(() => { setCartAnim(false); setAddedId(null); }, 1200);
  };

  const filtered = activeFilter === 'vsetko' ? products : products.filter(p => p.category === activeFilter);

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", background: COLORS.offwhite, color: COLORS.charcoal, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* STICKY NAV */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? COLORS.charcoal : COLORS.offwhite,
        borderBottom: scrolled ? 'none' : `1px solid ${COLORS.beige}`,
        transition: 'background 0.3s, box-shadow 0.3s',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.15)' : 'none',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 6, color: scrolled ? COLORS.white : COLORS.charcoal, cursor: 'pointer' }}>
            FLAVOUR
          </div>

          {/* Nav links */}
          <nav style={{ display: 'flex', gap: 32 }}>
            {['Ženy', 'Muži', 'Doplnky', 'Výpredaj'].map(item => (
              <a key={item} href="#produkty" style={{
                fontSize: 12, fontWeight: 600, letterSpacing: 2, textDecoration: 'none',
                color: item === 'Výpredaj' ? COLORS.coral : (scrolled ? COLORS.white : COLORS.charcoal),
                transition: 'opacity 0.2s', cursor: 'pointer',
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >{item.toUpperCase()}</a>
            ))}
          </nav>

          {/* Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={scrolled ? COLORS.white : COLORS.charcoal} strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={scrolled ? COLORS.white : COLORS.charcoal} strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
            {/* Cart with badge */}
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={scrolled ? COLORS.white : COLORS.charcoal} strokeWidth="2"
                style={{ transform: cartAnim ? 'scale(1.3)' : 'scale(1)', transition: 'transform 0.3s' }}>
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <span style={{
                position: 'absolute', top: -8, right: -8,
                background: COLORS.coral, color: COLORS.white,
                borderRadius: '50%', width: 18, height: 18,
                fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: cartAnim ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.3s',
              }}>{cartCount}</span>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ position: 'relative', height: '90vh', minHeight: 520, overflow: 'hidden', background: COLORS.charcoal }}>
        {/* Background gradient blocks */}
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ background: 'linear-gradient(135deg, #2a1f1a 0%, #1a1a1a 100%)' }} />
          <div style={{ background: 'linear-gradient(135deg, #c9a8a0 0%, #8ea0b4 50%, #b8a090 100%)' }} />
        </div>
        {/* Overlay text */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 8%', maxWidth: 680,
        }}>
          <p style={{ color: COLORS.coral, fontSize: 11, fontWeight: 700, letterSpacing: 4, marginBottom: 16, textTransform: 'uppercase' }}>
            Nová kolekcia
          </p>
          <h1 style={{ color: COLORS.white, fontSize: 'clamp(42px, 6vw, 80px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, marginBottom: 24 }}>
            Jarná<br/>kolekcia<br/>2026
          </h1>
          <p style={{ color: COLORS.beige, fontSize: 16, lineHeight: 1.6, marginBottom: 40, maxWidth: 380 }}>
            Módne kúsky pre každý deň. Navrhnuté na Slovensku, ušité pre teba.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href="#produkty" style={{
              background: COLORS.white, color: COLORS.charcoal,
              padding: '14px 36px', fontSize: 12, fontWeight: 700, letterSpacing: 2,
              textDecoration: 'none', textTransform: 'uppercase',
              transition: 'background 0.2s, color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = COLORS.coral; e.currentTarget.style.color = COLORS.white; }}
              onMouseLeave={e => { e.currentTarget.style.background = COLORS.white; e.currentTarget.style.color = COLORS.charcoal; }}
            >Nakupovať</a>
            <a href="#produkty" style={{
              background: 'transparent', color: COLORS.white,
              padding: '14px 36px', fontSize: 12, fontWeight: 700, letterSpacing: 2,
              textDecoration: 'none', textTransform: 'uppercase',
              border: `1px solid rgba(255,255,255,0.4)`,
              transition: 'border-color 0.2s, background 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.coral; e.currentTarget.style.background = 'rgba(232,93,74,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent'; }}
            >Výpredaj -40%</a>
          </div>
        </div>
        {/* Decorative label */}
        <div style={{
          position: 'absolute', bottom: 40, right: 40,
          background: COLORS.coral, color: COLORS.white,
          padding: '12px 20px', fontSize: 11, fontWeight: 800, letterSpacing: 2,
          textTransform: 'uppercase',
        }}>SS 2026</div>
      </section>

      {/* KATEGÓRIE */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>Nakupovať podľa kategórie</h2>
          <a href="#produkty" style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, color: COLORS.midgray, textDecoration: 'none', textTransform: 'uppercase' }}>Zobraziť všetko →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { label: 'Šaty', count: '42 kúskov', bg: '#c9a8a0', bg2: '#b08878' },
            { label: 'Bundy', count: '28 kúskov', bg: '#787878', bg2: '#585858' },
            { label: 'Topánky', count: '35 kúskov', bg: '#c8c0b0', bg2: '#a89e8e' },
            { label: 'Doplnky', count: '56 kúskov', bg: '#b8a090', bg2: '#987060' },
          ].map(cat => (
            <div key={cat.label} style={{
              position: 'relative', cursor: 'pointer', overflow: 'hidden',
              aspectRatio: '3/4',
            }}
              onMouseEnter={e => { (e.currentTarget.querySelector('.cat-overlay') as HTMLElement).style.opacity = '1'; }}
              onMouseLeave={e => { (e.currentTarget.querySelector('.cat-overlay') as HTMLElement).style.opacity = '0'; }}
            >
              <div style={{ width: '100%', height: '100%', background: `linear-gradient(160deg, ${cat.bg} 0%, ${cat.bg2} 100%)` }} />
              <div className="cat-overlay" style={{
                position: 'absolute', inset: 0,
                background: 'rgba(26,26,26,0.3)',
                transition: 'opacity 0.3s', opacity: 0,
              }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 16px', background: 'linear-gradient(transparent, rgba(26,26,26,0.7))' }}>
                <p style={{ color: COLORS.white, fontSize: 18, fontWeight: 800, margin: 0 }}>{cat.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, margin: '2px 0 0', letterSpacing: 1 }}>{cat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUKTY */}
      <section id="produkty" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>Nové kúsky</h2>
          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 4, background: COLORS.lightbeige, padding: 4, borderRadius: 2 }}>
            {categories.map(cat => (
              <button key={cat.key} onClick={() => setActiveFilter(cat.key)} style={{
                padding: '8px 20px', fontSize: 12, fontWeight: 600, letterSpacing: 1,
                border: 'none', cursor: 'pointer', transition: 'all 0.2s', borderRadius: 1,
                background: activeFilter === cat.key ? COLORS.charcoal : 'transparent',
                color: activeFilter === cat.key ? COLORS.white : COLORS.midgray,
                textTransform: 'uppercase',
              }}>{cat.label}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {filtered.map(product => (
            <div key={product.id}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              style={{ background: COLORS.white, cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s' }}
            >
              {/* Product image block */}
              <div style={{ position: 'relative', aspectRatio: '3/4', background: `linear-gradient(160deg, ${product.color} 0%, ${product.color2} 100%)`, overflow: 'hidden' }}>
                {/* Badge */}
                <span style={{
                  position: 'absolute', top: 12, left: 12,
                  background: product.badge === 'Nové' ? COLORS.charcoal : COLORS.coral,
                  color: COLORS.white, fontSize: 10, fontWeight: 700, letterSpacing: 1,
                  padding: '4px 10px', textTransform: 'uppercase',
                }}>{product.badge}</span>

                {/* Added to cart animation */}
                {addedId === product.id && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(26,26,26,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'fadeIn 0.2s ease',
                  }}>
                    <span style={{ color: COLORS.white, fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>✓ Pridané</span>
                  </div>
                )}

                {/* Wishlist heart */}
                <button onClick={() => toggleWishlist(product.id)} style={{
                  position: 'absolute', top: 12, right: 12,
                  background: 'rgba(255,255,255,0.9)', border: 'none',
                  borderRadius: '50%', width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'transform 0.2s',
                  transform: wishlist.includes(product.id) ? 'scale(1.1)' : 'scale(1)',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24"
                    fill={wishlist.includes(product.id) ? COLORS.coral : 'none'}
                    stroke={wishlist.includes(product.id) ? COLORS.coral : COLORS.charcoal}
                    strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>

                {/* Decorative shape */}
                <div style={{ position: 'absolute', bottom: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
              </div>

              {/* Product info */}
              <div style={{ padding: '16px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 6px', letterSpacing: 0.3 }}>{product.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: product.oldPrice ? COLORS.coral : COLORS.charcoal }}>{product.price} €</span>
                  {product.oldPrice && (
                    <span style={{ fontSize: 13, color: COLORS.midgray, textDecoration: 'line-through' }}>{product.oldPrice} €</span>
                  )}
                </div>
                <button onClick={() => addToCart(product.id)} style={{
                  width: '100%', background: COLORS.charcoal, color: COLORS.white,
                  border: 'none', padding: '11px', fontSize: 11, fontWeight: 700, letterSpacing: 2,
                  cursor: 'pointer', textTransform: 'uppercase', transition: 'background 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = COLORS.coral)}
                  onMouseLeave={e => (e.currentTarget.style.background = COLORS.charcoal)}
                >Do košíka</button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: COLORS.midgray }}>
            <p style={{ fontSize: 16 }}>Žiadne produkty v tejto kategórii.</p>
          </div>
        )}
      </section>

      {/* VÝHODY */}
      <section style={{ background: COLORS.charcoal, padding: '56px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {[
            { icon: '🚚', title: 'Doprava zadarmo', sub: 'od 49 € objednávky' },
            { icon: '↩', title: 'Vrátenie do 30 dní', sub: 'bez otázok, zadarmo' },
            { icon: '🔒', title: 'Bezpečná platba', sub: 'SSL + overené platobné brány' },
            { icon: '🇸🇰', title: 'Slovenský brand', sub: 'dizajn & výroba doma' },
          ].map(item => (
            <div key={item.title} style={{ textAlign: 'center', color: COLORS.white }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
              <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px', letterSpacing: 0.5 }}>{item.title}</p>
              <p style={{ fontSize: 12, color: COLORS.beige, margin: 0 }}>{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RECENZIE */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>Čo hovoria naši zákazníci</h2>
          <p style={{ color: COLORS.midgray, fontSize: 14 }}>Overené recenzie od skutočných nakupujúcich</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {reviews.map(r => (
            <div key={r.initials} style={{ background: COLORS.white, padding: '28px', borderLeft: `3px solid ${COLORS.coral}` }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                {Array.from({ length: r.stars }).map((_, i) => (
                  <span key={i} style={{ color: COLORS.coral, fontSize: 14 }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: COLORS.charcoal, margin: '0 0 20px', fontStyle: 'italic' }}>"{r.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: COLORS.lightbeige, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{r.initials}</div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{r.initials}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INSTAGRAM FEED */}
      <section style={{ background: COLORS.lightbeige, padding: '64px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>Follow @flavour.sk</h2>
            <p style={{ color: COLORS.midgray, fontSize: 14 }}>Sleduj nás na Instagrame pre dennú dávku štýlu</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
            {[
              { bg: '#c9a8a0' }, { bg: '#8ea0b4' }, { bg: '#c8c0b0' },
              { bg: '#b8a090' }, { bg: '#9aac8a' }, { bg: '#c4b8d4' },
            ].map((item, i) => (
              <div key={i} style={{ aspectRatio: '1', background: item.bg, position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
                onMouseEnter={e => { (e.currentTarget.querySelector('.ig-overlay') as HTMLElement).style.opacity = '1'; }}
                onMouseLeave={e => { (e.currentTarget.querySelector('.ig-overlay') as HTMLElement).style.opacity = '0'; }}
              >
                <div className="ig-overlay" style={{
                  position: 'absolute', inset: 0, background: 'rgba(232,93,74,0.7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.3s',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.white} strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ background: COLORS.coral, padding: '80px 24px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 12 }}>Newsletter</p>
          <h2 style={{ color: COLORS.white, fontSize: 36, fontWeight: 900, lineHeight: 1.1, letterSpacing: -1, marginBottom: 12 }}>
            Zľava 10 % na prvý nákup
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, marginBottom: 36 }}>
            Prihlás sa k newsletteru a získaj zľavový kód okamžite. Žiadny spam — iba nové kolekcie a exkluzívne akcie.
          </p>
          {!subscribed ? (
            <div style={{ display: 'flex', gap: 0, maxWidth: 440, margin: '0 auto' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tvoj@email.sk"
                style={{
                  flex: 1, padding: '14px 20px', border: 'none', outline: 'none',
                  fontSize: 14, background: COLORS.white, color: COLORS.charcoal,
                }}
              />
              <button onClick={() => { if (email) setSubscribed(true); }} style={{
                background: COLORS.charcoal, color: COLORS.white, border: 'none',
                padding: '14px 28px', fontSize: 11, fontWeight: 700, letterSpacing: 2,
                cursor: 'pointer', textTransform: 'uppercase', transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >Prihlásiť</button>
            </div>
          ) : (
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '20px 32px', display: 'inline-block' }}>
              <p style={{ color: COLORS.white, fontSize: 15, fontWeight: 600, margin: 0 }}>
                ✓ Hotovo! Kód FLAVOUR10 sme ti poslali na email.
              </p>
            </div>
          )}
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 16 }}>
            Odhlásenie kedykoľvek. Tvoje údaje sú v bezpečí.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#111111', color: COLORS.white, padding: '64px 24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            {/* Brand col */}
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 6, marginBottom: 16 }}>FLAVOUR</div>
              <p style={{ color: COLORS.beige, fontSize: 13, lineHeight: 1.7, marginBottom: 20, maxWidth: 240 }}>
                Slovenský módny brand pre tých, ktorí veria, že štýl je forma sebavyjadrenia.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                {['IG', 'FB', 'TT', 'PIN'].map(s => (
                  <div key={s} style={{
                    width: 36, height: 36, border: `1px solid rgba(255,255,255,0.2)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, cursor: 'pointer', color: COLORS.beige,
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = COLORS.coral; (e.currentTarget as HTMLElement).style.color = COLORS.coral; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLElement).style.color = COLORS.beige; }}
                  >{s}</div>
                ))}
              </div>
            </div>

            {/* Nakupovanie */}
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20, color: COLORS.white }}>Nakupovanie</h4>
              {['Ženy', 'Muži', 'Doplnky', 'Výpredaj', 'Nové kúsky', 'Bestsellery'].map(l => (
                <p key={l} style={{ margin: '0 0 10px' }}>
                  <a href="#" style={{ color: COLORS.beige, textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = COLORS.white)}
                    onMouseLeave={e => (e.currentTarget.style.color = COLORS.beige)}
                  >{l}</a>
                </p>
              ))}
            </div>

            {/* Zákaznícky servis */}
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20, color: COLORS.white }}>Zákaznícky servis</h4>
              {['Vrátenie tovaru', 'Doprava a platba', 'Veľkostný sprievodca', 'Kontakt', 'FAQ', 'Darčekové poukazy'].map(l => (
                <p key={l} style={{ margin: '0 0 10px' }}>
                  <a href="#" style={{ color: COLORS.beige, textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = COLORS.white)}
                    onMouseLeave={e => (e.currentTarget.style.color = COLORS.beige)}
                  >{l}</a>
                </p>
              ))}
            </div>

            {/* O nás */}
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20, color: COLORS.white }}>O nás</h4>
              {['Náš príbeh', 'Udržateľnosť', 'Press', 'Kariéra', 'Obchodné podmienky', 'GDPR'].map(l => (
                <p key={l} style={{ margin: '0 0 10px' }}>
                  <a href="#" style={{ color: COLORS.beige, textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = COLORS.white)}
                    onMouseLeave={e => (e.currentTarget.style.color = COLORS.beige)}
                  >{l}</a>
                </p>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>
              © 2026 FLAVOUR s.r.o. — Všetky práva vyhradené
            </p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: 0 }}>
              Web by{' '}
              <a href="https://vassweb.sk" style={{ color: COLORS.coral, textDecoration: 'none', fontWeight: 600 }}>Vassweb</a>
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @media (max-width: 900px) {
          section > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          section > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
