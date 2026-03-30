'use client';

import { useState } from 'react';

const font = 'var(--font-inter), Inter, system-ui, sans-serif';
const heading = 'var(--font-heading), Playfair Display, Georgia, serif';

const templates = [
  { id: 'restaurant', name: 'Reštaurácia / Kaviareň', icon: '🍝', desc: 'Jedálny lístok, rezervácie, galéria, kontakt', preview: '/demo/restaurant', price: 'od 299 €' },
  { id: 'beauty', name: 'Kaderníctvo / Kozmetika', icon: '💇', desc: 'Služby, cenník, galéria prác, online rezervácia', preview: '/demo/portfolio', price: 'od 299 €' },
  { id: 'auto', name: 'Autoservis / Pneuservis', icon: '🔧', desc: 'Služby, cenník, otváracie hodiny, mapa', preview: '/demo/firma', price: 'od 299 €' },
  { id: 'fitness', name: 'Fitness / Joga / Masáže', icon: '💪', desc: 'Rozvrh lekcií, cenník, trénerský tím', preview: '/demo/fitness', price: 'od 299 €' },
  { id: 'firma', name: 'Firma / Remeselník', icon: '🏗️', desc: 'O nás, služby, referencie, portfólio realizácií', preview: '/demo/firma', price: 'od 299 €' },
  { id: 'eshop', name: 'E-shop', icon: '🛒', desc: 'Produkty, košík, platby, admin panel', preview: '/demo/eshop', price: 'od 1 990 €' },
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
  { name: 'Svetlá', primary: '#d4a843', bg: '#ffffff' },
];

export default function VyberSiWeb() {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(colorPresets[0]);
  const [customColor, setCustomColor] = useState('#d4a843');
  const [form, setForm] = useState({ firma: '', meno: '', email: '', telefon: '', web: '', poznamky: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const selectedTmpl = templates.find(t => t.id === selectedTemplate);

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
          message: `KONFIGURÁTOR WEBU\n\nŠablóna: ${selectedTmpl?.name || 'Neurčená'}\nFarba: ${selectedColor.name} (${selectedColor.primary})\nExistujúci web: ${form.web || 'Žiadny'}\n\nPoznámky:\n${form.poznamky}`,
          source: 'konfigurator',
        }),
      });
      setSent(true);
    } catch {
      setSent(true); // aj tak ukáž ďakujem
    }
    setSending(false);
  };

  if (sent) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0908', color: '#fff', fontFamily: font, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 500, animation: 'fadeIn 0.5s ease' }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
          <h1 style={{ fontFamily: heading, fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, marginBottom: 16 }}>
            Ďakujeme, <span style={{ color: '#d4a843' }}>{form.firma}</span>!
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
            Váš výber sme prijali. Ozveme sa vám do 24 hodín s návrhom a cenovou ponukou.
          </p>
          <div style={{ padding: 20, background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 16, textAlign: 'left', marginBottom: 32 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>VÁŠ VÝBER</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>{selectedTmpl?.icon}</span>
              <div>
                <div style={{ fontWeight: 600 }}>{selectedTmpl?.name}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{selectedTmpl?.price}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: selectedColor.primary }} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Farba: {selectedColor.name}</span>
            </div>
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
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        input:focus, textarea:focus { border-color: ${selectedColor.primary} !important; outline: none; }
      `}</style>

      {/* Header */}
      <header style={{ textAlign: 'center', padding: '60px 24px 40px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${selectedColor.primary}15 0%, transparent 60%)` }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <a href="https://vassweb.sk" style={{ color: '#d4a843', textDecoration: 'none', fontSize: 22, fontWeight: 700, letterSpacing: '0.02em' }}>Vassweb</a>
          <h1 style={{ fontFamily: heading, fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, margin: '20px 0 12px', lineHeight: 1.2 }}>
            Nakonfigurujte si <span style={{ color: selectedColor.primary }}>vlastný web</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>
            Vyberte šablónu, farby a pošlite nám brief. Hotové do 5 dní.
          </p>
        </div>
      </header>

      {/* Progress */}
      <div style={{ maxWidth: 600, margin: '0 auto 40px', padding: '0 24px' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? selectedColor.primary : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 11, color: step >= 1 ? selectedColor.primary : 'rgba(255,255,255,0.3)', fontWeight: 600 }}>1. Šablóna</span>
          <span style={{ fontSize: 11, color: step >= 2 ? selectedColor.primary : 'rgba(255,255,255,0.3)', fontWeight: 600 }}>2. Farby</span>
          <span style={{ fontSize: 11, color: step >= 3 ? selectedColor.primary : 'rgba(255,255,255,0.3)', fontWeight: 600 }}>3. Kontakt</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 60px' }}>

        {/* STEP 1 — Šablóna */}
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>Vyberte si typ webu</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {templates.map(t => (
                <button key={t.id} onClick={() => { setSelectedTemplate(t.id); }}
                  style={{
                    textAlign: 'left', padding: 24, borderRadius: 16, cursor: 'pointer', fontFamily: font,
                    background: selectedTemplate === t.id ? `${selectedColor.primary}12` : '#111110',
                    border: `2px solid ${selectedTemplate === t.id ? selectedColor.primary : 'rgba(255,255,255,0.06)'}`,
                    color: '#fff', transition: 'all 0.2s',
                  }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{t.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: 12 }}>{t.desc}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: selectedColor.primary }}>{t.price}</span>
                    <a href={t.preview} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                      style={{ fontSize: 12, color: selectedColor.primary, textDecoration: 'none', fontWeight: 600, padding: '4px 12px', borderRadius: 8, border: `1px solid ${selectedColor.primary}30`, background: `${selectedColor.primary}10` }}>
                      Náhľad →
                    </a>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button onClick={() => { if (selectedTemplate) setStep(2); }}
                disabled={!selectedTemplate}
                style={{
                  padding: '14px 40px', borderRadius: 12, fontSize: 15, fontWeight: 700, fontFamily: font, cursor: selectedTemplate ? 'pointer' : 'not-allowed',
                  background: selectedTemplate ? `linear-gradient(135deg, ${selectedColor.primary}, ${selectedColor.primary}cc)` : 'rgba(255,255,255,0.06)',
                  color: selectedTemplate ? '#000' : 'rgba(255,255,255,0.3)', border: 'none', transition: 'all 0.2s',
                  opacity: selectedTemplate ? 1 : 0.5,
                }}>
                Ďalej → Farby
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — Farby */}
        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>Vyberte si farby</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12, maxWidth: 600, margin: '0 auto 32px' }}>
              {colorPresets.map(c => (
                <button key={c.name} onClick={() => { setSelectedColor(c); setCustomColor(c.primary); }}
                  style={{
                    padding: 16, borderRadius: 12, cursor: 'pointer', textAlign: 'center', fontFamily: font,
                    background: selectedColor.name === c.name ? `${c.primary}20` : '#111110',
                    border: `2px solid ${selectedColor.name === c.name ? c.primary : 'rgba(255,255,255,0.06)'}`,
                    color: '#fff', transition: 'all 0.2s',
                  }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: c.primary, margin: '0 auto 8px', boxShadow: `0 4px 16px ${c.primary}40` }} />
                  <div style={{ fontSize: 12, fontWeight: 600, color: c.primary }}>{c.name}</div>
                </button>
              ))}
            </div>

            {/* Custom color */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 8 }}>Alebo si vyberte vlastnú farbu:</label>
              <input type="color" value={customColor} onChange={e => { setCustomColor(e.target.value); setSelectedColor({ name: 'Vlastná', primary: e.target.value, bg: '#0a0908' }); }}
                style={{ width: 60, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'transparent' }} />
            </div>

            {/* Live preview */}
            <div style={{ maxWidth: 500, margin: '0 auto 32px', padding: 24, borderRadius: 16, background: selectedColor.bg === '#ffffff' ? '#fafafa' : '#111110', border: `1px solid ${selectedColor.primary}20` }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Náhľad</div>
              <div style={{ padding: 20, borderRadius: 12, background: selectedColor.bg, border: `1px solid ${selectedColor.primary}15` }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: selectedColor.bg === '#ffffff' ? '#1a1a1a' : '#fff', marginBottom: 8 }}>
                  {form.firma || 'Vaša firma'}
                </div>
                <div style={{ fontSize: 13, color: selectedColor.primary, fontWeight: 600, marginBottom: 16 }}>
                  {selectedTmpl?.name || 'Webstránka'}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ padding: '8px 16px', borderRadius: 8, background: selectedColor.primary, color: selectedColor.bg === '#ffffff' ? '#fff' : '#000', fontSize: 13, fontWeight: 700 }}>Kontakt</div>
                  <div style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${selectedColor.primary}40`, color: selectedColor.primary, fontSize: 13, fontWeight: 600 }}>Služby</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <button onClick={() => setStep(1)} style={{ padding: '14px 32px', borderRadius: 12, fontSize: 14, fontWeight: 600, fontFamily: font, cursor: 'pointer', background: 'transparent', border: `1px solid rgba(255,255,255,0.1)`, color: 'rgba(255,255,255,0.5)' }}>← Späť</button>
              <button onClick={() => setStep(3)}
                style={{ padding: '14px 40px', borderRadius: 12, fontSize: 15, fontWeight: 700, fontFamily: font, cursor: 'pointer', background: `linear-gradient(135deg, ${selectedColor.primary}, ${selectedColor.primary}cc)`, color: '#000', border: 'none' }}>
                Ďalej → Kontakt
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Kontakt */}
        {step === 3 && (
          <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>Povedzte nám o sebe</h2>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 32 }}>Ozveme sa vám do 24 hodín s návrhom.</p>

            {/* Vybraná šablóna recap */}
            <div style={{ display: 'flex', gap: 12, padding: 16, background: '#111110', borderRadius: 12, marginBottom: 24, alignItems: 'center' }}>
              <span style={{ fontSize: 28 }}>{selectedTmpl?.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedTmpl?.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{selectedTmpl?.price}</div>
              </div>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: selectedColor.primary }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>Názov firmy *</label>
                <input value={form.firma} onChange={e => setForm(f => ({ ...f, firma: e.target.value }))} placeholder="Napr. Kaderníctvo Lucia"
                  style={{ width: '100%', padding: '12px 16px', background: '#111110', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: font }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>Vaše meno</label>
                  <input value={form.meno} onChange={e => setForm(f => ({ ...f, meno: e.target.value }))} placeholder="Meno a priezvisko"
                    style={{ width: '100%', padding: '12px 16px', background: '#111110', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: font }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>Telefón</label>
                  <input value={form.telefon} onChange={e => setForm(f => ({ ...f, telefon: e.target.value }))} placeholder="+421 9XX XXX XXX"
                    style={{ width: '100%', padding: '12px 16px', background: '#111110', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: font }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>Email *</label>
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="vas@email.sk" type="email"
                  style={{ width: '100%', padding: '12px 16px', background: '#111110', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: font }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>Existujúca webstránka (ak máte)</label>
                <input value={form.web} onChange={e => setForm(f => ({ ...f, web: e.target.value }))} placeholder="www.priklad.sk"
                  style={{ width: '100%', padding: '12px 16px', background: '#111110', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: font }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>Poznámky — čo by ste chceli na webe?</label>
                <textarea value={form.poznamky} onChange={e => setForm(f => ({ ...f, poznamky: e.target.value }))} rows={4}
                  placeholder="Napr. chcem galériu prác, online rezerváciu, jedálny lístok..."
                  style={{ width: '100%', padding: '12px 16px', background: '#111110', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: font, resize: 'vertical' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28 }}>
              <button onClick={() => setStep(2)} style={{ padding: '14px 32px', borderRadius: 12, fontSize: 14, fontWeight: 600, fontFamily: font, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>← Späť</button>
              <button onClick={handleSubmit} disabled={sending || !form.firma || !form.email}
                style={{
                  padding: '14px 40px', borderRadius: 12, fontSize: 15, fontWeight: 700, fontFamily: font, cursor: (!form.firma || !form.email) ? 'not-allowed' : 'pointer',
                  background: (!form.firma || !form.email) ? 'rgba(255,255,255,0.06)' : `linear-gradient(135deg, ${selectedColor.primary}, ${selectedColor.primary}cc)`,
                  color: (!form.firma || !form.email) ? 'rgba(255,255,255,0.3)' : '#000', border: 'none', opacity: (!form.firma || !form.email) ? 0.5 : 1,
                }}>
                {sending ? 'Odosielam...' : 'Odoslať → Chcem web!'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '32px 24px', borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
        © 2026 Vassweb — VVD s.r.o. | <a href="https://vassweb.sk" style={{ color: '#d4a843', textDecoration: 'none' }}>vassweb.sk</a>
      </footer>
    </div>
  );
}
