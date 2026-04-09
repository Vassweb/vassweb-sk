'use client'

import { useState } from 'react'

const accent = '#b76e79'
const accentLight = '#f5e6e8'
const accentDark = '#9a5562'
const cream = '#fdf8f5'
const white = '#ffffff'
const textDark = '#2c1a1e'
const textMid = '#6b4c52'
const textLight = '#a08890'

const services = [
  { name: 'Strih dámsky', price: '25 €', icon: '✂️', desc: 'Profesionálny strih podľa tvaru tváre' },
  { name: 'Strih pánsky', price: '15 €', icon: '✂️', desc: 'Klasický aj moderný pánsky strih' },
  { name: 'Farbenie', price: 'od 45 €', icon: '🎨', desc: 'Jednofarbenie s kvalitnými farbami L\'Oréal' },
  { name: 'Melír', price: 'od 55 €', icon: '✨', desc: 'Klasický, balayage aj babylights melír' },
  { name: 'Spoločenský účes', price: '35 €', icon: '💐', desc: 'Svadby, plesy, firemné akcie' },
  { name: 'Ošetrenie vlasov', price: '30 €', icon: '💧', desc: 'Keratínové a hydratačné ošetrenie' },
]

const testimonials = [
  { name: 'M. K.', text: 'Výborný salón! Vždy odchádzam spokojná. Stylistka mi urobila krásny melír a poradila s farbou. Vrátim sa určite.', rating: 5 },
  { name: 'J. S.', text: 'Príjemné prostredie, profesionálny prístup. Strih bol presne taký, ako som chcela. Odporúčam všetkým!', rating: 5 },
  { name: 'A. N.', text: 'Najlepší salón v okolí. Spoločenský účes na svadbu bol nádherný, dostala som veľa komplimentov.', rating: 5 },
]

const galleryItems = [
  { bg: '#e8c5ca', label: 'Dámske strihy' },
  { bg: '#d4a8b0', label: 'Farbenie' },
  { bg: '#c9919b', label: 'Melír' },
  { bg: '#e2b8be', label: 'Spoločenské účesy' },
  { bg: '#dbb5ba', label: 'Ošetrenia' },
  { bg: '#cf9fa6', label: 'Pánske strihy' },
]

export default function SalonBellaPage() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', color: textDark, margin: 0, padding: 0 }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade { animation: fadeIn 0.8s ease forwards; }
        .animate-up { animation: fadeInUp 0.7s ease forwards; }
        .btn-primary {
          background: ${accent};
          color: white;
          border: none;
          padding: 14px 32px;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          border-radius: 2px;
          text-decoration: none;
          display: inline-block;
        }
        .btn-primary:hover {
          background: ${accentDark};
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(183,110,121,0.35);
        }
        .btn-outline {
          background: transparent;
          color: ${accent};
          border: 1.5px solid ${accent};
          padding: 13px 30px;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 2px;
          text-decoration: none;
          display: inline-block;
        }
        .btn-outline:hover {
          background: ${accent};
          color: white;
        }
        .service-card {
          background: white;
          border: 1px solid #f0e4e6;
          padding: 28px 24px;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          border-radius: 4px;
        }
        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(183,110,121,0.12);
          border-color: ${accent};
        }
        .gallery-item {
          position: relative;
          overflow: hidden;
          border-radius: 4px;
          cursor: pointer;
        }
        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }
        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: rgba(183,110,121,0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .testimonial-card {
          background: white;
          border: 1px solid #f0e4e6;
          padding: 28px;
          border-radius: 4px;
          position: relative;
        }
        .testimonial-card::before {
          content: '"';
          position: absolute;
          top: -12px;
          left: 24px;
          font-size: 72px;
          color: ${accentLight};
          font-family: Georgia, serif;
          line-height: 1;
        }
        .nav-link {
          color: ${textMid};
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.5px;
          transition: color 0.2s;
          text-transform: uppercase;
        }
        .nav-link:hover { color: ${accent}; }
        .input-field {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e8d5d8;
          border-radius: 2px;
          font-size: 15px;
          font-family: inherit;
          color: ${textDark};
          background: white;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus { border-color: ${accent}; }
        .section-label {
          text-transform: uppercase;
          letter-spacing: 3px;
          font-size: 12px;
          font-weight: 600;
          color: ${accent};
          margin-bottom: 12px;
        }
        .section-title {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 400;
          color: ${textDark};
          line-height: 1.25;
          margin-bottom: 16px;
        }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .hero-buttons { flex-direction: column; align-items: center; gap: 12px !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .gallery-grid { grid-template-columns: 1fr 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .footer-inner { flex-direction: column !important; text-align: center; gap: 8px !important; }
        }
        @media (max-width: 480px) {
          .gallery-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #f0e4e6', padding: '0 5%' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          <a href="#hero" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: textDark, letterSpacing: 1 }}>Salón <span style={{ color: accent }}>Bella</span></span>
          </a>
          <div className="nav-links" style={{ display: 'flex', gap: 36 }}>
            <a href="#sluzby" className="nav-link">Služby</a>
            <a href="#o-nas" className="nav-link">O nás</a>
            <a href="#galeria" className="nav-link">Galéria</a>
            <a href="#hodnotenia" className="nav-link">Hodnotenia</a>
            <a href="#kontakt" className="nav-link">Kontakt</a>
          </div>
          <a href="#kontakt" className="btn-primary" style={{ padding: '10px 22px', fontSize: 13 }}>Rezervovať</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" style={{ background: `linear-gradient(135deg, ${cream} 0%, #fceef0 50%, #f9e8ea 100%)`, minHeight: '88vh', display: 'flex', alignItems: 'center', padding: '80px 5%' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' }}>
          <div className="animate-up" style={{ flex: '1 1 400px' }}>
            <p className="section-label">Váš kaderníctvo v Bratislave</p>
            <h1 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 400, lineHeight: 1.1, color: textDark, marginBottom: 20 }}>
              Salón <span style={{ color: accent, fontStyle: 'italic' }}>Bella</span>
            </h1>
            <p style={{ fontSize: 20, color: textMid, marginBottom: 12, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Váš salón krásy v srdci mesta
            </p>
            <p style={{ fontSize: 16, color: textLight, lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
              Doprajte si profesionálnu starostlivosť o vlasy v príjemnom prostredí. Náš tím skúsených stylistov sa postará o váš dokonalý vzhľad.
            </p>
            <div className="hero-buttons" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href="#kontakt" className="btn-primary">Rezervovať termín</a>
              <a href="#sluzby" className="btn-outline">Naše služby</a>
            </div>
            <div style={{ display: 'flex', gap: 40, marginTop: 48, flexWrap: 'wrap' }}>
              {[['5+', 'Rokov skúseností'], ['2000+', 'Spokojných klientok'], ['98%', 'Pozitívnych hodnotení']].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: accent, fontFamily: 'Georgia, serif' }}>{num}</div>
                  <div style={{ fontSize: 13, color: textLight, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="animate-fade" style={{ flex: '1 1 320px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 340, height: 420, background: `linear-gradient(160deg, ${accentLight} 0%, #f0c5cb 60%, ${accent}40 100%)`, borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 20px 60px rgba(183,110,121,0.2)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 72 }}>✂️</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: accentDark, marginTop: 12, fontStyle: 'italic' }}>Est. 2019</div>
              </div>
              <div style={{ position: 'absolute', top: 24, right: -16, background: white, borderRadius: 12, padding: '10px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: 13, color: textMid, fontWeight: 500 }}>
                ★★★★★ 5.0
              </div>
              <div style={{ position: 'absolute', bottom: 24, left: -16, background: accent, borderRadius: 12, padding: '10px 16px', boxShadow: '0 4px 16px rgba(183,110,121,0.3)', fontSize: 13, color: white, fontWeight: 500 }}>
                Otvorené dnes 🟢
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SLUZBY */}
      <section id="sluzby" style={{ padding: '80px 5%', background: white }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p className="section-label">Čo ponúkame</p>
            <h2 className="section-title">Naše služby</h2>
            <p style={{ color: textLight, fontSize: 16, maxWidth: 520, margin: '0 auto' }}>Starostlivosť o vaše vlasy s použitím prémiových produktov a moderných techník</p>
          </div>
          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {services.map((s) => (
              <div key={s.name} className="service-card">
                <div style={{ fontSize: 32, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, marginBottom: 8, color: textDark }}>{s.name}</h3>
                <p style={{ fontSize: 14, color: textLight, lineHeight: 1.6, marginBottom: 16 }}>{s.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: accent }}>{s.price}</span>
                  <a href="#kontakt" style={{ fontSize: 13, color: accent, textDecoration: 'none', fontWeight: 500, borderBottom: `1px solid ${accent}`, paddingBottom: 1 }}>Rezervovať →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O NAS */}
      <section id="o-nas" style={{ padding: '80px 5%', background: cream }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 300, height: 360, background: `linear-gradient(145deg, #f0c5cb, ${accent}60)`, borderRadius: '40% 60% 50% 50% / 60% 40% 60% 40%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 48px rgba(183,110,121,0.18)' }}>
              <div style={{ textAlign: 'center', padding: 24 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>💇‍♀️</div>
                <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: accentDark, fontSize: 16 }}>Váš štýl,<br />naša vášeň</div>
              </div>
            </div>
          </div>
          <div style={{ flex: '1 1 420px' }}>
            <p className="section-label">Náš príbeh</p>
            <h2 className="section-title">O salóne Bella</h2>
            <p style={{ fontSize: 16, color: textMid, lineHeight: 1.8, marginBottom: 20 }}>
              Salón Bella vznikol v roku 2019 s jedným cieľom — poskytnúť klientkám a klientom profesionálnu starostlivosť o vlasy v príjemnom a útulnom prostredí. Sídlime v srdci Bratislavy na Hlavnej ulici.
            </p>
            <p style={{ fontSize: 16, color: textMid, lineHeight: 1.8, marginBottom: 32 }}>
              Náš tím skúsených stylistov pravidelne absolvuje odborné školenia a sleduje najnovšie trendy. Pracujeme výhradne s prémiovými produktmi značiek L'Oréal Professionnel a Kérastase, aby sme vám zaručili ten najlepší výsledok.
            </p>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[['✓ Prémiové produkty', ''], ['✓ Skúsený tím', ''], ['✓ Príjemná atmosféra', ''], ['✓ Individuálny prístup', '']].map(([item]) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: textMid, fontWeight: 500 }}>
                  <span style={{ color: accent }}>{item.split(' ')[0]}</span>
                  <span>{item.split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" style={{ padding: '80px 5%', background: white }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p className="section-label">Naše práce</p>
            <h2 className="section-title">Galéria</h2>
            <p style={{ color: textLight, fontSize: 16, maxWidth: 480, margin: '0 auto' }}>Pohľad do sveta krásnych účesov a premien, ktoré každý deň vytvárame</p>
          </div>
          <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {galleryItems.map((item, i) => (
              <div key={i} className="gallery-item" style={{ height: i % 3 === 1 ? 260 : 200 }}>
                <div style={{ width: '100%', height: '100%', background: item.bg, display: 'flex', alignItems: 'flex-end', padding: 16 }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500, letterSpacing: 0.5 }}>{item.label}</span>
                </div>
                <div className="gallery-overlay">
                  <span style={{ color: white, fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HODNOTENIA */}
      <section id="hodnotenia" style={{ padding: '80px 5%', background: cream }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p className="section-label">Čo hovoria klienti</p>
            <h2 className="section-title">Hodnotenia</h2>
          </div>
          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div style={{ color: '#f4b942', fontSize: 18, marginBottom: 16, letterSpacing: 2 }}>
                  {'★'.repeat(t.rating)}
                </div>
                <p style={{ fontSize: 15, color: textMid, lineHeight: 1.7, marginBottom: 20 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${accentLight}, ${accent}60)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: accent, fontFamily: 'Georgia, serif' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: textDark }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: textLight }}>Overená klientka</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KONTAKT */}
      <section id="kontakt" style={{ padding: '80px 5%', background: white }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p className="section-label">Navštívte nás</p>
            <h2 className="section-title">Kontakt a rezervácia</h2>
          </div>
          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            {/* Info */}
            <div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, marginBottom: 28, color: textDark }}>Informácie</h3>
              {[
                { icon: '📍', label: 'Adresa', value: 'Hlavná 42, 811 01 Bratislava' },
                { icon: '📞', label: 'Telefón', value: '+421 9XX XXX XXX' },
                { icon: '✉️', label: 'Email', value: 'info@salonbella.sk' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, background: accentLight, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 12, color: textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 15, color: textDark, fontWeight: 500 }}>{item.value}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 32, padding: 24, background: accentLight, borderRadius: 4, borderLeft: `3px solid ${accent}` }}>
                <h4 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: accent, marginBottom: 14, fontWeight: 600 }}>Otváracie hodiny</h4>
                {[
                  ['Pondelok – Piatok', '9:00 – 19:00'],
                  ['Sobota', '9:00 – 14:00'],
                  ['Nedeľa', 'Zatvorené'],
                ].map(([day, hours]) => (
                  <div key={day} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                    <span style={{ color: textMid }}>{day}</span>
                    <span style={{ fontWeight: 600, color: hours === 'Zatvorené' ? textLight : textDark }}>{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, marginBottom: 28, color: textDark }}>Rezervácia termínu</h3>
              {submitted ? (
                <div style={{ background: accentLight, border: `1px solid ${accent}`, borderRadius: 4, padding: 32, textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: textDark, marginBottom: 8 }}>Ďakujeme!</h4>
                  <p style={{ color: textMid, fontSize: 15 }}>Vaša správa bola odoslaná. Ozveme sa vám čo najskôr.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, color: textMid, display: 'block', marginBottom: 6, fontWeight: 500 }}>Vaše meno *</label>
                    <input
                      className="input-field"
                      type="text"
                      placeholder="Vaše meno"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, color: textMid, display: 'block', marginBottom: 6, fontWeight: 500 }}>Telefónne číslo *</label>
                    <input
                      className="input-field"
                      type="tel"
                      placeholder="+421 9XX XXX XXX"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, color: textMid, display: 'block', marginBottom: 6, fontWeight: 500 }}>Správa (voliteľné)</label>
                    <textarea
                      className="input-field"
                      rows={4}
                      placeholder="Aký termín vám vyhovuje? O akú službu máte záujem?"
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: 4, textAlign: 'center' }}>
                    Odoslať rezerváciu
                  </button>
                  <p style={{ fontSize: 12, color: textLight, textAlign: 'center' }}>
                    Potvrdenie dostanete do 24 hodín telefonicky
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: textDark, color: 'rgba(255,255,255,0.5)', padding: '28px 5%' }}>
        <div className="footer-inner" style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontFamily: 'Georgia, serif', color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>Salón <span style={{ color: accent }}>Bella</span></span>
            <span style={{ marginLeft: 20, fontSize: 13 }}>© 2026 Salón Bella. Všetky práva vyhradené.</span>
          </div>
          <a href="https://vassweb.sk" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = accent)}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
            Web by Vassweb
          </a>
        </div>
      </footer>
    </div>
  )
}
