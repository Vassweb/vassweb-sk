'use client';

import { useState } from 'react';

const colors = {
  brown: '#3e2723',
  brownLight: '#5d4037',
  brownMid: '#795548',
  gold: '#c8a45a',
  goldLight: '#e8c97a',
  cream: '#faf6f0',
  creamDark: '#f0e8db',
  text: '#2c1810',
  textLight: '#6b4c3b',
  white: '#ffffff',
};

const styles: Record<string, React.CSSProperties> = {
  body: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    backgroundColor: colors.cream,
    color: colors.text,
    margin: 0,
    padding: 0,
    lineHeight: 1.6,
  },
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'rgba(62, 39, 35, 0.95)',
    backdropFilter: 'blur(8px)',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
  },
  navLogo: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '1.4rem',
    color: colors.gold,
    letterSpacing: '2px',
    fontWeight: 400,
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navLink: {
    color: colors.creamDark,
    textDecoration: 'none',
    fontSize: '0.85rem',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    transition: 'color 0.2s',
    cursor: 'pointer',
  },
  hero: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    backgroundColor: colors.brown,
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute' as const,
    inset: 0,
    background: 'radial-gradient(ellipse at center, rgba(62,39,35,0.4) 0%, rgba(30,15,10,0.85) 100%)',
    zIndex: 1,
  },
  heroBg: {
    position: 'absolute' as const,
    inset: 0,
    background: `
      radial-gradient(circle at 20% 50%, rgba(200, 164, 90, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(121, 85, 72, 0.3) 0%, transparent 50%),
      linear-gradient(135deg, #2c1810 0%, #3e2723 40%, #4e342e 70%, #3e2723 100%)
    `,
  },
  heroPattern: {
    position: 'absolute' as const,
    inset: 0,
    opacity: 0.04,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  },
  heroContent: {
    position: 'relative' as const,
    zIndex: 2,
    textAlign: 'center' as const,
    padding: '2rem',
    maxWidth: '700px',
  },
  heroPre: {
    color: colors.gold,
    fontSize: '0.8rem',
    letterSpacing: '5px',
    textTransform: 'uppercase' as const,
    marginBottom: '1.5rem',
    display: 'block',
  },
  heroTitle: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: 'clamp(3rem, 8vw, 5.5rem)',
    fontWeight: 400,
    color: colors.white,
    margin: '0 0 0.5rem',
    lineHeight: 1.1,
    letterSpacing: '2px',
  },
  heroSubtitle: {
    color: colors.gold,
    fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
    fontFamily: 'Georgia, serif',
    fontStyle: 'italic',
    marginBottom: '2.5rem',
    letterSpacing: '1px',
  },
  heroDivider: {
    width: '60px',
    height: '1px',
    background: colors.gold,
    margin: '1.5rem auto',
    opacity: 0.7,
  },
  heroCta: {
    display: 'inline-block',
    padding: '1rem 2.5rem',
    backgroundColor: colors.gold,
    color: colors.brown,
    textDecoration: 'none',
    fontWeight: 600,
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    border: '2px solid transparent',
  },
  section: {
    padding: '6rem 2rem',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  sectionDark: {
    backgroundColor: colors.brown,
    color: colors.cream,
    padding: '6rem 0',
  },
  sectionInner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  sectionLabel: {
    fontSize: '0.75rem',
    letterSpacing: '4px',
    textTransform: 'uppercase' as const,
    color: colors.gold,
    marginBottom: '0.75rem',
    display: 'block',
  },
  sectionTitle: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
    fontWeight: 400,
    color: colors.brown,
    margin: '0 0 1.5rem',
    lineHeight: 1.2,
  },
  sectionTitleLight: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
    fontWeight: 400,
    color: colors.cream,
    margin: '0 0 1.5rem',
    lineHeight: 1.2,
  },
  ornament: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    margin: '1.5rem 0 3rem',
  },
  ornamentLine: {
    flex: 1,
    height: '1px',
    backgroundColor: colors.gold,
    opacity: 0.4,
  },
  ornamentDot: {
    color: colors.gold,
    fontSize: '1.2rem',
  },
  aboutGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center',
  },
  aboutText: {
    fontSize: '1.05rem',
    lineHeight: 1.8,
    color: colors.textLight,
  },
  aboutHighlight: {
    fontFamily: 'Georgia, serif',
    fontSize: '1.3rem',
    fontStyle: 'italic',
    color: colors.brownLight,
    borderLeft: `3px solid ${colors.gold}`,
    paddingLeft: '1.5rem',
    margin: '2rem 0',
    lineHeight: 1.6,
  },
  aboutImageBlock: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  aboutImgPlaceholder: {
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative' as const,
  },
  menuTabs: {
    display: 'flex',
    gap: '0',
    marginBottom: '3rem',
    borderBottom: `2px solid ${colors.creamDark}`,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: '8px',
    padding: '2.5rem',
    boxShadow: '0 4px 30px rgba(62,39,35,0.08)',
  },
  menuCategory: {
    fontFamily: 'Georgia, serif',
    fontSize: '1.4rem',
    color: colors.brown,
    marginBottom: '0.5rem',
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  menuCategoryLine: {
    flex: 1,
    height: '1px',
    backgroundColor: colors.creamDark,
  },
  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: '0.85rem 0',
    borderBottom: `1px solid ${colors.creamDark}`,
  },
  menuItemName: {
    fontSize: '1rem',
    color: colors.text,
    fontWeight: 500,
  },
  menuItemDots: {
    flex: 1,
    borderBottom: `1px dotted ${colors.creamDark}`,
    margin: '0 0.75rem',
    transform: 'translateY(-4px)',
  },
  menuItemPrice: {
    fontSize: '0.95rem',
    color: colors.gold,
    fontWeight: 600,
    fontFamily: 'Georgia, serif',
    whiteSpace: 'nowrap' as const,
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  photosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(2, 220px)',
    gap: '1rem',
  },
  photoBlock: {
    borderRadius: '6px',
    overflow: 'hidden',
    position: 'relative' as const,
  },
  reviewsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    marginTop: '3rem',
  },
  reviewCard: {
    backgroundColor: colors.white,
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(62,39,35,0.08)',
    borderTop: `3px solid ${colors.gold}`,
  },
  reviewStars: {
    color: '#f5a623',
    fontSize: '1.1rem',
    letterSpacing: '2px',
    marginBottom: '1rem',
  },
  reviewText: {
    color: colors.textLight,
    lineHeight: 1.7,
    fontSize: '0.95rem',
    fontStyle: 'italic',
    marginBottom: '1.5rem',
  },
  reviewAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  reviewAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: colors.brownLight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.cream,
    fontWeight: 600,
    fontSize: '0.85rem',
    flexShrink: 0,
  },
  reviewName: {
    fontWeight: 600,
    fontSize: '0.9rem',
    color: colors.text,
  },
  reviewSource: {
    fontSize: '0.75rem',
    color: colors.textLight,
  },
  contactSection: {
    backgroundColor: colors.creamDark,
    padding: '6rem 0',
  },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
  },
  contactItem: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    alignItems: 'flex-start',
  },
  contactIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: colors.brown,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: '1.1rem',
  },
  contactLabel: {
    fontSize: '0.75rem',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    color: colors.textLight,
    marginBottom: '0.25rem',
  },
  contactValue: {
    fontSize: '1rem',
    color: colors.text,
    fontWeight: 500,
  },
  mapPlaceholder: {
    borderRadius: '8px',
    overflow: 'hidden',
    height: '300px',
    position: 'relative' as const,
    background: `linear-gradient(135deg, ${colors.brownLight} 0%, ${colors.brown} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    backgroundColor: colors.brown,
    padding: '2rem',
    textAlign: 'center' as const,
    borderTop: `1px solid rgba(200,164,90,0.2)`,
  },
  footerText: {
    color: 'rgba(250,246,240,0.5)',
    fontSize: '0.85rem',
  },
  footerLink: {
    color: colors.gold,
    textDecoration: 'none',
    fontSize: '0.75rem',
    opacity: 0.7,
    marginLeft: '1rem',
  },
};

const menuData = [
  {
    category: 'Káva',
    icon: '☕',
    items: [
      { name: 'Espresso', price: '2,20 €', desc: 'Ristretto, doppio' },
      { name: 'Cappuccino', price: '3,50 €', desc: 'Klasický taliansky štýl' },
      { name: 'Latte', price: '3,80 €', desc: 'S art-latte dekoráciou' },
      { name: 'Flat White', price: '3,90 €', desc: 'Dvojitý espresso' },
      { name: 'Čaj', price: '2,50 €', desc: 'Výber z kolekcie' },
    ],
  },
  {
    category: 'Zákusky',
    icon: '🍰',
    items: [
      { name: 'Tiramisu', price: '4,50 €', desc: 'Domáce, podľa babičkiného receptu' },
      { name: 'Cheesecake', price: '4,20 €', desc: 'New York style' },
      { name: 'Croissant', price: '2,80 €', desc: 'Čerstvý, máslový' },
      { name: 'Panna Cotta', price: '3,90 €', desc: 'S ovocnou omáčkou' },
    ],
  },
  {
    category: 'Raňajky',
    icon: '🥑',
    items: [
      { name: 'Avocado Toast', price: '7,90 €', desc: 'S vajíčkami a cherry paradajkami' },
      { name: 'Eggs Benedict', price: '8,50 €', desc: 'S holandskou omáčkou' },
      { name: 'Granola Bowl', price: '6,20 €', desc: 'S jogurtom a čerstvým ovocím' },
    ],
  },
];

const reviews = [
  {
    initials: 'P.M.',
    name: 'P. M.',
    text: 'Najlepšia káva v celom Starom Meste! Priateľský personál, útulná atmosféra a tiramisu ako v Ríme. Chodím sem každý týždeň.',
    rating: 5,
  },
  {
    initials: 'K.Š.',
    name: 'K. Š.',
    text: 'Objavil som toto miesto náhodou a teraz je to moja pracovná kancelária každé ráno. Flat White je fenomenálny, Wi-Fi spolahlivá.',
    rating: 5,
  },
  {
    initials: 'R.B.',
    name: 'R. B.',
    text: 'Nádherný interiér, kvalitné suroviny a obsluha, ktorá si pamätá vašu obľúbenú objednávku. Toto je kaviarenská kultúra v najlepšom.',
    rating: 5,
  },
];

function OrnamentDivider() {
  return (
    <div style={styles.ornament}>
      <div style={styles.ornamentLine} />
      <span style={styles.ornamentDot}>✦</span>
      <div style={styles.ornamentLine} />
    </div>
  );
}

export default function CafeMilano() {
  const [activeTab, setActiveTab] = useState(0);
  const [ctaHover, setCtaHover] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={styles.body}>
      {/* NAV */}
      <nav style={styles.nav}>
        <span style={styles.navLogo}>CAFÉ MILANO</span>
        <ul style={styles.navLinks}>
          {[['O nás', 'o-nas'], ['Menu', 'menu'], ['Atmosféra', 'atmosfera'], ['Kontakt', 'kontakt']].map(([label, id]) => (
            <li key={id}>
              <span
                style={styles.navLink}
                onClick={() => scrollTo(id)}
              >
                {label}
              </span>
            </li>
          ))}
        </ul>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={styles.heroPattern} />
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <span style={styles.heroPre}>Est. 2021 · Bratislava</span>
          <h1 style={styles.heroTitle}>Café Milano</h1>
          <div style={styles.heroDivider} />
          <p style={styles.heroSubtitle}>Talianska káva. Slovenská pohostinnosť.</p>
          <button
            style={{
              ...styles.heroCta,
              backgroundColor: ctaHover ? 'transparent' : colors.gold,
              color: ctaHover ? colors.gold : colors.brown,
              border: `2px solid ${colors.gold}`,
            }}
            onMouseEnter={() => setCtaHover(true)}
            onMouseLeave={() => setCtaHover(false)}
            onClick={() => scrollTo('menu')}
          >
            Pozrieť menu
          </button>
        </div>
      </section>

      {/* O NÁS */}
      <section id="o-nas" style={{ ...styles.section, paddingTop: '8rem' }}>
        <span style={styles.sectionLabel}>O nás</span>
        <h2 style={styles.sectionTitle}>Príbeh, ktorý chutí ako espresso</h2>
        <OrnamentDivider />
        <div style={styles.aboutGrid}>
          <div>
            <p style={styles.aboutText}>
              Café Milano vzniklo v roku 2021 zo sna dvoch priateľov, ktorí strávili roky v toskánskych kaviarňach
              a chceli priniesť autentickú taliansku kávovú kultúru do srdca Bratislavy.
            </p>
            <blockquote style={styles.aboutHighlight}>
              „Každý šálok espresso je malé rituál — moment pre seba, uprostred rušného dňa."
            </blockquote>
            <p style={styles.aboutText}>
              Naše zrná pochádzajú priamo od rodinných farmárov z Etiópie a Kolumbie, pražíme ich týždeň pred
              podávaním. Zákusky pečieme každé ráno — tiramisu podľa originálneho talianskeho receptu,
              croissanty s francúzskym maslom.
            </p>
            <p style={styles.aboutText}>
              Nájdete nás na Ventúrskej ulici v Starom Meste — kamenná fasáda, drevené stoly,
              vôňa čerstvej kávy a tichý džez na pozadí.
            </p>
          </div>
          <div style={styles.aboutImageBlock}>
            {[
              { bg: `linear-gradient(135deg, #5d4037 0%, #3e2723 100%)`, label: '☕', sub: 'Espresso bar' },
              { bg: `linear-gradient(135deg, #4e342e 0%, #6d4c41 100%)`, label: '🌿', sub: 'Čerstvé suroviny' },
              { bg: `linear-gradient(135deg, #6d4c41 0%, #4e342e 100%)`, label: '✨', sub: 'Domáce zákusky' },
              { bg: `linear-gradient(135deg, #3e2723 0%, #5d4037 100%)`, label: '🎵', sub: 'Živá atmosféra' },
            ].map((block, i) => (
              <div
                key={i}
                style={{
                  ...styles.aboutImgPlaceholder,
                  background: block.bg,
                  height: i === 0 ? '200px' : '160px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <span style={{ fontSize: '2rem' }}>{block.label}</span>
                <span style={{ color: 'rgba(250,246,240,0.8)', fontSize: '0.8rem', letterSpacing: '1px' }}>
                  {block.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" style={styles.sectionDark}>
        <div style={styles.sectionInner}>
          <span style={{ ...styles.sectionLabel }}>Ponuka</span>
          <h2 style={styles.sectionTitleLight}>Naše menu</h2>
          <OrnamentDivider />

          {/* Tabs */}
          <div style={styles.menuTabs}>
            {menuData.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                style={{
                  padding: '0.85rem 2rem',
                  border: 'none',
                  borderBottom: activeTab === i ? `3px solid ${colors.gold}` : '3px solid transparent',
                  backgroundColor: 'transparent',
                  color: activeTab === i ? colors.gold : 'rgba(250,246,240,0.5)',
                  cursor: 'pointer',
                  fontFamily: 'Georgia, serif',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  marginBottom: '-2px',
                }}
              >
                {cat.icon} {cat.category}
              </button>
            ))}
          </div>

          {/* Menu card */}
          <div style={{ maxWidth: '580px' }}>
            <div style={styles.menuCard}>
              <h3 style={styles.menuCategory}>
                {menuData[activeTab].icon} {menuData[activeTab].category}
              </h3>
              <div style={{ ...styles.menuCategoryLine, marginBottom: '1.5rem' }} />
              {menuData[activeTab].items.map((item, i) => (
                <div key={i} style={styles.menuItem}>
                  <div>
                    <div style={styles.menuItemName}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', color: colors.textLight, marginTop: '2px' }}>{item.desc}</div>
                  </div>
                  <span style={styles.menuItemPrice}>{item.price}</span>
                </div>
              ))}
              <p style={{
                fontSize: '0.78rem',
                color: colors.textLight,
                marginTop: '1.5rem',
                fontStyle: 'italic',
                borderTop: `1px solid ${colors.creamDark}`,
                paddingTop: '1rem',
              }}>
                Všetky ceny sú s DPH. Alergény dostupné na požiadanie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ATMOSFÉRA */}
      <section id="atmosfera" style={styles.section}>
        <span style={styles.sectionLabel}>Interiér</span>
        <h2 style={styles.sectionTitle}>Atmosféra, ktorá vás pohltí</h2>
        <OrnamentDivider />
        <div style={styles.photosGrid}>
          {[
            { bg: `linear-gradient(160deg, #6d4c41 0%, #3e2723 100%)`, label: 'Hlavná sála', icon: '🕯️' },
            { bg: `linear-gradient(160deg, #5d4037 0%, #4e342e 100%)`, label: 'Espresso bar', icon: '☕' },
            { bg: `linear-gradient(160deg, #795548 0%, #5d4037 100%)`, label: 'Záhradný kút', icon: '🌿' },
            { bg: `linear-gradient(160deg, #4e342e 0%, #3e2723 100%)`, label: 'Večerná atmosféra', icon: '✨' },
          ].map((block, i) => (
            <div
              key={i}
              style={{
                ...styles.photoBlock,
                background: block.bg,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '1.5rem',
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                opacity: 0.3,
              }}>
                {block.icon}
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(4px)',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                zIndex: 1,
              }}>
                <span style={{ color: colors.cream, fontSize: '0.85rem', letterSpacing: '1px' }}>
                  {block.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HODNOTENIA */}
      <section style={{ ...styles.sectionDark }}>
        <div style={styles.sectionInner}>
          <span style={styles.sectionLabel}>Recenzie</span>
          <h2 style={styles.sectionTitleLight}>Čo hovoria naši hostia</h2>
          <OrnamentDivider />
          <div style={styles.reviewsGrid}>
            {reviews.map((review, i) => (
              <div key={i} style={styles.reviewCard}>
                <div style={styles.reviewStars}>{'★'.repeat(review.rating)}</div>
                <p style={styles.reviewText}>"{review.text}"</p>
                <div style={styles.reviewAuthor}>
                  <div style={styles.reviewAvatar}>{review.initials}</div>
                  <div>
                    <div style={styles.reviewName}>{review.name}</div>
                    <div style={styles.reviewSource}>Google recenzia · overená</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KONTAKT */}
      <section id="kontakt" style={styles.contactSection}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
          <span style={styles.sectionLabel}>Nájdete nás</span>
          <h2 style={styles.sectionTitle}>Kontakt & Otváracie hodiny</h2>
          <OrnamentDivider />
          <div style={styles.contactGrid}>
            <div>
              {[
                {
                  icon: '📍',
                  label: 'Adresa',
                  value: 'Ventúrska 8\nBratislava – Staré Mesto',
                },
                {
                  icon: '📞',
                  label: 'Telefón',
                  value: '+421 9XX XXX XXX',
                },
                {
                  icon: '🕐',
                  label: 'Otváracie hodiny',
                  value: 'Pon – Pia: 7:30 – 20:00\nSob – Ned: 8:30 – 21:00',
                },
                {
                  icon: '📸',
                  label: 'Instagram',
                  value: '@cafemilano.ba',
                },
              ].map((item, i) => (
                <div key={i} style={styles.contactItem}>
                  <div style={styles.contactIcon}>
                    <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                  </div>
                  <div>
                    <div style={styles.contactLabel}>{item.label}</div>
                    {item.value.split('\n').map((line, j) => (
                      <div key={j} style={styles.contactValue}>{line}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={styles.mapPlaceholder}>
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 39px,
                  rgba(200,164,90,0.08) 40px
                ), repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 39px,
                  rgba(200,164,90,0.08) 40px
                )`,
              }} />
              <div style={{ textAlign: 'center', zIndex: 1, padding: '2rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📍</div>
                <div style={{ color: colors.cream, fontFamily: 'Georgia, serif', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  Ventúrska 8
                </div>
                <div style={{ color: colors.gold, fontSize: '0.85rem', letterSpacing: '1px' }}>
                  Bratislava – Staré Mesto
                </div>
                <div style={{
                  marginTop: '1.5rem',
                  padding: '0.6rem 1.5rem',
                  border: `1px solid ${colors.gold}`,
                  color: colors.gold,
                  fontSize: '0.8rem',
                  letterSpacing: '1px',
                  display: 'inline-block',
                  cursor: 'pointer',
                }}>
                  OTVORIŤ V MAPS
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}>
          <span style={styles.footerText}>© 2026 Café Milano. Všetky práva vyhradené.</span>
          <a href="https://vassweb.sk" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>
            Web by Vassweb
          </a>
        </div>
      </footer>
    </div>
  );
}
