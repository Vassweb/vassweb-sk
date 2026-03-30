'use client';

import { useState, useRef } from 'react';

const font = 'var(--font-inter), Inter, system-ui, sans-serif';
const heading = 'var(--font-heading), Playfair Display, Georgia, serif';

const templates = [
  { id: 'restaurant', name: 'Reštaurácia / Kaviareň', icon: '🍝', desc: 'Jedálny lístok, rezervácie, galéria jedál, otváracie hodiny', preview: '/demo/restaurant', price: 'od 299 €', category: 'gastro' },
  { id: 'beauty', name: 'Kaderníctvo / Kozmetika', icon: '💇', desc: 'Služby, cenník, galéria prác, online rezervácia', preview: '/demo/portfolio', price: 'od 299 €', category: 'beauty' },
  { id: 'auto', name: 'Autoservis / Pneuservis', icon: '🔧', desc: 'Služby, cenník, otváracie hodiny, kontakt s mapou', preview: '/demo/firma', price: 'od 299 €', category: 'sluzby' },
  { id: 'fitness', name: 'Fitness / Joga / Masáže', icon: '💪', desc: 'Rozvrh lekcií, cenník, trénerský tím, galéria', preview: '/demo/fitness', price: 'od 299 €', category: 'health' },
  { id: 'firma', name: 'Stavebná firma / Remeselník', icon: '🏗️', desc: 'O nás, služby, referencie, portfólio realizácií', preview: '/demo/firma', price: 'od 299 €', category: 'sluzby' },
  { id: 'zubar', name: 'Zubár / Lekár / Klinika', icon: '🦷', desc: 'Ordinačné hodiny, služby, tím lekárov, kontakt', preview: '/demo/firma', price: 'od 299 €', category: 'health' },
  { id: 'veterinar', name: 'Veterinár / Pet salón', icon: '🐾', desc: 'Služby, cenník, tím, galéria, otváracie hodiny', preview: '/demo/firma', price: 'od 299 €', category: 'health' },
  { id: 'foto', name: 'Fotograf / Videograf', icon: '📸', desc: 'Portfólio, cenníky balíčkov, galéria, kontakt', preview: '/demo/portfolio', price: 'od 299 €', category: 'creative' },
  { id: 'cukraren', name: 'Cukráreň / Pekáreň', icon: '🧁', desc: 'Menu, objednávky, galéria výrobkov, o nás', preview: '/demo/restaurant', price: 'od 299 €', category: 'gastro' },
  { id: 'autoskola', name: 'Autoškola', icon: '🚗', desc: 'Kurzy, cenník, inštruktori, prihlášky online', preview: '/demo/firma', price: 'od 299 €', category: 'sluzby' },
  { id: 'ucto', name: 'Účtovník / Daňový poradca', icon: '📊', desc: 'Služby, cenník, referencie, formulár na dopyt', preview: '/demo/firma', price: 'od 299 €', category: 'sluzby' },
  { id: 'realitka', name: 'Realitná kancelária', icon: '🏠', desc: 'Ponuky nehnuteľností, vyhľadávanie, kontakt', preview: '/demo/firma', price: 'od 590 €', category: 'sluzby' },
  { id: 'hotel', name: 'Hotel / Penzión / Ubytovanie', icon: '🏨', desc: 'Izby, galéria, cenník, online rezervácia', preview: '/demo/restaurant', price: 'od 590 €', category: 'gastro' },
  { id: 'svadobny', name: 'Svadobný salón / Krajčír', icon: '👰', desc: 'Kolekcie, galéria, cenník, objednávka termínu', preview: '/demo/portfolio', price: 'od 299 €', category: 'creative' },
  { id: 'eshop', name: 'E-shop', icon: '🛒', desc: 'Produkty, košík, platby, admin panel', preview: '/demo/eshop', price: 'od 1 990 €', category: 'eshop' },
  { id: 'portfolio', name: 'Portfólio / Osobná stránka', icon: '🎨', desc: 'Práce, bio, kontakt, moderný dizajn', preview: '/demo/portfolio', price: 'od 299 €', category: 'creative' },
];

const categories = [
  { key: 'all', label: 'Všetky' },
  { key: 'gastro', label: 'Gastro' },
  { key: 'beauty', label: 'Krása' },
  { key: 'health', label: 'Zdravie' },
  { key: 'sluzby', label: 'Služby' },
  { key: 'creative', label: 'Kreativita' },
  { key: 'eshop', label: 'E-shop' },
];

const colorPresets = [
  { name: 'Zlato', primary: '#d4a843', bg: '#0a0908' },
  { name: 'Modrá', primary: '#3b82f6', bg: '#0a1628' },
  { name: 'Zelená', primary: '#10b981', bg: '#0a1a12' },
  { name: 'Červená', primary: '#ef4444', bg: '#1a0a0a' },
  { name: 'Fialová', primary: '#8b5cf6', bg: '#12081a' },
  { name: 'Oranžová', primary: '#f59e0b', bg: '#1a1408' },
  { name: 'Ružová', primary: '#ec4899', bg: '#1a081a' },
  { name: 'Tyrkysová', primary: '#06b6d4', bg: '#081a1a' },
  { name: 'Tmavá', primary: '#94a3b8', bg: '#0f172a' },
  { name: 'Svetlá modrá', primary: '#2563eb', bg: '#ffffff' },
  { name: 'Svetlá zelená', primary: '#059669', bg: '#ffffff' },
  { name: 'Svetlá zlato', primary: '#b8860b', bg: '#ffffff' },
];

export default function VyberSiWeb() {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedColor, setSelectedColor] = useState(colorPresets[0]);
  const [customColor, setCustomColor] = useState('#d4a843');
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [logoName, setLogoName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ firma: '', meno: '', email: '', telefon: '', web: '', poznamky: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const selectedTmpl = templates.find(t => t.id === selectedTemplate);
  const filteredTemplates = categoryFilter === 'all' ? templates : templates.filter(t => t.category === categoryFilter);
  const isLight = selectedColor.bg === '#ffffff';
  const textColor = isLight ? '#1a1a1a' : '#fff';
  const mutedColor = isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.45)';
  const cardBg = isLight ? '#f5f5f5' : '#111110';
  const inputBg = isLight ? '#ffffff' : '#111110';
  const inputBorder = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)';

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return; // max 2MB
    setLogoName(file.name);
    const reader = new FileReader();
    reader.onload = () => setLogoFile(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.firma || !form.email) return;
    setSending(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.meno,
          email: form.email,
          phone: form.telefon,
          company: form.firma,
          message: `KONFIGURÁTOR WEBU\n\nŠablóna: ${selectedTmpl?.name || 'Neurčená'}\nFarba: ${selectedColor.name} (${selectedColor.primary})\nPozadie: ${selectedColor.bg}\nLogo: ${logoName || 'Žiadne'}\nExistujúci web: ${form.web || 'Žiadny'}\n\nPoznámky:\n${form.poznamky}`,
          source: 'konfigurator',
        }),
      });
      setSent(true);
    } catch {
      setSent(true);
    }
    setSending(false);
  };

  // ═══ ĎAKUJEM STRÁNKA ═══
  if (sent) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0908', color: '#fff', fontFamily: font, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 520, animation: 'fadeIn 0.5s ease' }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
          <h1 style={{ fontFamily: heading, fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, marginBottom: 16 }}>
            Ďakujeme, <span style={{ color: '#d4a843' }}>{form.firma}</span>!
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
            Váš výber sme prijali. Ozveme sa vám do 24 hodín s návrhom a cenovou ponukou.
          </p>
          <div style={{ padding: 20, background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 16, textAlign: 'left', marginBottom: 32 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>VÁŠ VÝBER</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>{selectedTmpl?.icon}</span>
              <div>
                <div style={{ fontWeight: 600 }}>{selectedTmpl?.name}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{selectedTmpl?.price}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: selectedColor.primary }} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Farba: {selectedColor.name}</span>
            </div>
            {logoFile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={logoFile} alt="logo" style={{ width: 20, height: 20, borderRadius: 4, objectFit: 'contain' }} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Logo: {logoName}</span>
              </div>
            )}
          </div>
          <a href="https://vassweb.sk" style={{ color: '#d4a843', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>← Späť na vassweb.sk</a>
        </div>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0908', color: '#fff', fontFamily: font }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        input:focus, textarea:focus { border-color: ${selectedColor.primary} !important; outline: none; }
      `}</style>

      {/* Header */}
      <header style={{ textAlign: 'center', padding: '48px 24px 32px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${selectedColor.primary}15 0%, transparent 60%)` }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <a href="https://vassweb.sk" style={{ color: '#d4a843', textDecoration: 'none', fontSize: 22, fontWeight: 700 }}>Vassweb</a>
          <h1 style={{ fontFamily: heading, fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 700, margin: '16px 0 8px' }}>
            Nakonfigurujte si <span style={{ color: selectedColor.primary }}>vlastný web</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, maxWidth: 480, margin: '0 auto' }}>
            3 kroky a hotovo. Vyberte šablónu, farby, nahrajte logo — a my to postavíme.
          </p>
        </div>
      </header>

      {/* Progress */}
      <div style={{ maxWidth: 600, margin: '0 auto 32px', padding: '0 24px' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[1, 2, 3].map(s => (
            <button key={s} onClick={() => { if (s < step || (s === 2 && selectedTemplate) || (s === 3 && selectedTemplate)) setStep(s); }}
              style={{ flex: 1, height: 6, borderRadius: 3, background: s <= step ? selectedColor.primary : 'rgba(255,255,255,0.08)', transition: 'background 0.3s', border: 'none', cursor: s <= step ? 'pointer' : 'default' }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          {['1. Šablóna', '2. Dizajn', '3. Kontakt'].map((l, i) => (
            <span key={l} style={{ fontSize: 11, color: step > i ? selectedColor.primary : 'rgba(255,255,255,0.25)', fontWeight: 600 }}>{l}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 60px' }}>

        {/* ═══ STEP 1 — ŠABLÓNA ═══ */}
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>Aký web potrebujete?</h2>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
              {categories.map(c => (
                <button key={c.key} onClick={() => setCategoryFilter(c.key)}
                  style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: font, cursor: 'pointer', border: `1px solid ${categoryFilter === c.key ? selectedColor.primary : 'rgba(255,255,255,0.08)'}`, background: categoryFilter === c.key ? `${selectedColor.primary}15` : 'transparent', color: categoryFilter === c.key ? selectedColor.primary : 'rgba(255,255,255,0.4)', transition: 'all 0.2s' }}>
                  {c.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              {filteredTemplates.map(t => (
                <button key={t.id} onClick={() => setSelectedTemplate(t.id)}
                  style={{
                    textAlign: 'left', padding: 20, borderRadius: 14, cursor: 'pointer', fontFamily: font,
                    background: selectedTemplate === t.id ? `${selectedColor.primary}12` : '#111110',
                    border: `2px solid ${selectedTemplate === t.id ? selectedColor.primary : 'rgba(255,255,255,0.04)'}`,
                    color: '#fff', transition: 'all 0.2s',
                  }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{t.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, marginBottom: 10 }}>{t.desc}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: selectedColor.primary }}>{t.price}</span>
                    <a href={t.preview} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                      style={{ fontSize: 11, color: selectedColor.primary, textDecoration: 'none', fontWeight: 600, padding: '3px 10px', borderRadius: 6, border: `1px solid ${selectedColor.primary}30`, background: `${selectedColor.primary}08` }}>
                      Náhľad →
                    </a>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <button onClick={() => { if (selectedTemplate) setStep(2); }} disabled={!selectedTemplate}
                style={{ padding: '13px 36px', borderRadius: 12, fontSize: 14, fontWeight: 700, fontFamily: font, cursor: selectedTemplate ? 'pointer' : 'not-allowed', background: selectedTemplate ? `linear-gradient(135deg, ${selectedColor.primary}, ${selectedColor.primary}cc)` : 'rgba(255,255,255,0.04)', color: selectedTemplate ? '#000' : 'rgba(255,255,255,0.2)', border: 'none', opacity: selectedTemplate ? 1 : 0.4 }}>
                Ďalej → Dizajn
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2 — DIZAJN (Farby + Logo) ═══ */}
        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>Upravte si dizajn</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
              {/* Left — controls */}
              <div>
                {/* Colors */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'rgba(255,255,255,0.6)' }}>Farebná schéma</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {colorPresets.map(c => (
                      <button key={c.name} onClick={() => { setSelectedColor(c); setCustomColor(c.primary); }}
                        style={{ padding: 12, borderRadius: 10, cursor: 'pointer', textAlign: 'center', fontFamily: font, background: selectedColor.name === c.name ? `${c.primary}20` : '#111110', border: `2px solid ${selectedColor.name === c.name ? c.primary : 'rgba(255,255,255,0.04)'}`, color: '#fff', transition: 'all 0.2s' }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: c.primary, margin: '0 auto 6px', border: c.bg === '#ffffff' ? '1px solid rgba(0,0,0,0.1)' : 'none' }}>
                          {c.bg === '#ffffff' && <div style={{ width: '100%', height: '50%', borderRadius: '0 0 8px 8px', background: '#fff' }} />}
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: c.primary }}>{c.name}</div>
                      </button>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Vlastná:</span>
                    <input type="color" value={customColor} onChange={e => { setCustomColor(e.target.value); setSelectedColor({ name: 'Vlastná', primary: e.target.value, bg: '#0a0908' }); }}
                      style={{ width: 36, height: 28, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent' }} />
                  </div>
                </div>

                {/* Logo upload */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'rgba(255,255,255,0.6)' }}>Logo (voliteľné)</div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleLogo} style={{ display: 'none' }} />
                  <button onClick={() => fileRef.current?.click()}
                    style={{ width: '100%', padding: 16, borderRadius: 12, cursor: 'pointer', fontFamily: font, fontSize: 13, fontWeight: 600, background: '#111110', border: `2px dashed ${logoFile ? selectedColor.primary : 'rgba(255,255,255,0.08)'}`, color: logoFile ? selectedColor.primary : 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s' }}>
                    {logoFile ? (
                      <>
                        <img src={logoFile} alt="logo" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'contain' }} />
                        {logoName} — Zmeniť
                      </>
                    ) : '+ Nahrať logo (PNG, JPG, SVG — max 2MB)'}
                  </button>
                  {logoFile && (
                    <button onClick={() => { setLogoFile(null); setLogoName(''); }} style={{ marginTop: 6, fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: font }}>Odstrániť logo</button>
                  )}
                </div>
              </div>

              {/* Right — LIVE PREVIEW with WATERMARK */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'rgba(255,255,255,0.6)' }}>Náhľad</div>
                <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: `1px solid ${selectedColor.primary}15` }}>
                  {/* VODOTLAČ */}
                  <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <div style={{ transform: 'rotate(-35deg)', display: 'flex', flexDirection: 'column', gap: 40, opacity: 0.07 }}>
                      {[0, 1, 2, 3].map(row => (
                        <div key={row} style={{ display: 'flex', gap: 60 }}>
                          {[0, 1, 2].map(col => (
                            <span key={col} style={{ fontSize: 28, fontWeight: 900, color: isLight ? '#000' : '#fff', whiteSpace: 'nowrap', letterSpacing: '0.1em' }}>VASSWEB</span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preview content */}
                  <div style={{ background: selectedColor.bg, padding: 24, minHeight: 320 }}>
                    {/* Navbar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, paddingBottom: 12, borderBottom: `1px solid ${selectedColor.primary}15` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {logoFile ? (
                          <img src={logoFile} alt="logo" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'contain' }} />
                        ) : (
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: selectedColor.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: selectedColor.bg === '#ffffff' ? '#fff' : '#000' }}>
                            {(form.firma || 'V')[0].toUpperCase()}
                          </div>
                        )}
                        <span style={{ fontSize: 16, fontWeight: 700, color: textColor }}>{form.firma || 'Vaša firma'}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 16 }}>
                        {['Služby', 'O nás', 'Kontakt'].map(l => (
                          <span key={l} style={{ fontSize: 12, color: mutedColor, fontWeight: 500 }}>{l}</span>
                        ))}
                      </div>
                    </div>

                    {/* Hero */}
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 10, color: selectedColor.primary, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{selectedTmpl?.name}</div>
                      <h3 style={{ fontSize: 22, fontWeight: 800, color: textColor, marginBottom: 8, lineHeight: 1.2 }}>
                        Vitajte v <span style={{ color: selectedColor.primary }}>{form.firma || 'Vašej firme'}</span>
                      </h3>
                      <p style={{ fontSize: 13, color: mutedColor, lineHeight: 1.6, marginBottom: 16 }}>
                        Profesionálne služby pre vás a vašu rodinu. Kontaktujte nás ešte dnes.
                      </p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ padding: '8px 18px', borderRadius: 8, background: selectedColor.primary, color: selectedColor.bg === '#ffffff' ? '#fff' : '#000', fontSize: 12, fontWeight: 700 }}>Kontaktujte nás</div>
                        <div style={{ padding: '8px 18px', borderRadius: 8, border: `1px solid ${selectedColor.primary}40`, color: selectedColor.primary, fontSize: 12, fontWeight: 600 }}>Naše služby</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                      {['Kvalita', 'Rýchlosť', 'Spoľahlivosť'].map(f => (
                        <div key={f} style={{ padding: 12, borderRadius: 8, background: `${selectedColor.primary}08`, border: `1px solid ${selectedColor.primary}10`, textAlign: 'center' }}>
                          <div style={{ fontSize: 18, marginBottom: 4 }}>⭐</div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: textColor }}>{f}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28 }}>
              <button onClick={() => setStep(1)} style={{ padding: '13px 28px', borderRadius: 12, fontSize: 13, fontWeight: 600, fontFamily: font, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>← Späť</button>
              <button onClick={() => setStep(3)}
                style={{ padding: '13px 36px', borderRadius: 12, fontSize: 14, fontWeight: 700, fontFamily: font, cursor: 'pointer', background: `linear-gradient(135deg, ${selectedColor.primary}, ${selectedColor.primary}cc)`, color: '#000', border: 'none' }}>
                Ďalej → Kontakt
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 3 — KONTAKT ═══ */}
        {step === 3 && (
          <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>Povedzte nám o sebe</h2>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 28 }}>Ozveme sa do 24 hodín s návrhom a cenovou ponukou.</p>

            {/* Recap */}
            <div style={{ display: 'flex', gap: 12, padding: 14, background: '#111110', borderRadius: 12, marginBottom: 20, alignItems: 'center' }}>
              <span style={{ fontSize: 24 }}>{selectedTmpl?.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedTmpl?.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{selectedTmpl?.price}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: selectedColor.primary }} />
                {logoFile && <img src={logoFile} alt="" style={{ width: 20, height: 20, borderRadius: 4, objectFit: 'contain' }} />}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: 4 }}>Názov firmy *</label>
                <input value={form.firma} onChange={e => setForm(f => ({ ...f, firma: e.target.value }))} placeholder="Napr. Kaderníctvo Lucia"
                  style={{ width: '100%', padding: '11px 14px', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 10, color: '#fff', fontSize: 13, fontFamily: font }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: 4 }}>Vaše meno</label>
                  <input value={form.meno} onChange={e => setForm(f => ({ ...f, meno: e.target.value }))} placeholder="Meno a priezvisko"
                    style={{ width: '100%', padding: '11px 14px', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 10, color: '#fff', fontSize: 13, fontFamily: font }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: 4 }}>Telefón</label>
                  <input value={form.telefon} onChange={e => setForm(f => ({ ...f, telefon: e.target.value }))} placeholder="+421 9XX XXX XXX"
                    style={{ width: '100%', padding: '11px 14px', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 10, color: '#fff', fontSize: 13, fontFamily: font }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: 4 }}>Email *</label>
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="vas@email.sk" type="email"
                  style={{ width: '100%', padding: '11px 14px', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 10, color: '#fff', fontSize: 13, fontFamily: font }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: 4 }}>Existujúca webstránka</label>
                <input value={form.web} onChange={e => setForm(f => ({ ...f, web: e.target.value }))} placeholder="www.priklad.sk"
                  style={{ width: '100%', padding: '11px 14px', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 10, color: '#fff', fontSize: 13, fontFamily: font }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: 4 }}>Čo by ste chceli na webe?</label>
                <textarea value={form.poznamky} onChange={e => setForm(f => ({ ...f, poznamky: e.target.value }))} rows={3}
                  placeholder="Napr. galériu prác, online rezerváciu, jedálny lístok..."
                  style={{ width: '100%', padding: '11px 14px', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 10, color: '#fff', fontSize: 13, fontFamily: font, resize: 'vertical' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24 }}>
              <button onClick={() => setStep(2)} style={{ padding: '13px 28px', borderRadius: 12, fontSize: 13, fontWeight: 600, fontFamily: font, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>← Späť</button>
              <button onClick={handleSubmit} disabled={sending || !form.firma || !form.email}
                style={{ padding: '13px 36px', borderRadius: 12, fontSize: 14, fontWeight: 700, fontFamily: font, cursor: (!form.firma || !form.email) ? 'not-allowed' : 'pointer', background: (!form.firma || !form.email) ? 'rgba(255,255,255,0.04)' : `linear-gradient(135deg, ${selectedColor.primary}, ${selectedColor.primary}cc)`, color: (!form.firma || !form.email) ? 'rgba(255,255,255,0.2)' : '#000', border: 'none', opacity: (!form.firma || !form.email) ? 0.4 : 1 }}>
                {sending ? 'Odosielam...' : 'Odoslať — Chcem web!'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid rgba(255,255,255,0.03)', fontSize: 11, color: 'rgba(255,255,255,0.15)' }}>
        © 2026 Vassweb — VVD s.r.o. | <a href="https://vassweb.sk" style={{ color: '#d4a843', textDecoration: 'none' }}>vassweb.sk</a>
      </footer>
    </div>
  );
}
