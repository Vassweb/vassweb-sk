'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Globe, Bot, Zap, Smartphone, ArrowDown, CheckCircle,
  Shield, MonitorSmartphone, Search, Wrench, BarChart3, Send, Phone, Mail,
  ChevronUp, ChevronDown, Quote, Star,
} from 'lucide-react';
import { type Locale, getT } from '@/lib/translations';

const heading = 'var(--font-heading), Playfair Display, Georgia, serif';
const body = 'var(--font-inter), Inter, system-ui, sans-serif';

const goldGradient = {
  background: 'linear-gradient(90deg, #ffeebb 0%, #d4a843 50%, #8a6a1e 100%)',
  WebkitBackgroundClip: 'text' as const,
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text' as const,
};

const card: React.CSSProperties = {
  padding: '28px 24px',
  borderRadius: 16,
  border: '1px solid rgba(212,168,67,0.12)',
  backgroundColor: 'rgba(255,255,255,0.025)',
};

const section: React.CSSProperties = { padding: '80px 24px' };
const sectionAlt: React.CSSProperties = { padding: '80px 24px', backgroundColor: 'rgba(255,255,255,0.015)' };

const label: React.CSSProperties = {
  color: '#d4a843', fontSize: 11, fontWeight: 600, fontFamily: body,
  letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: 12,
};

const h2Style: React.CSSProperties = {
  fontFamily: heading, fontWeight: 400, fontSize: 'clamp(28px, 4vw, 44px)',
  color: '#fff', marginBottom: 16,
};

/* ═══ SCROLL FADE-IN ANIMATION ═══ */
function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ═══ ANIMATED COUNTER ═══ */
function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState('0');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    // If value is purely numeric, animate it
    const numericValue = parseInt(value.replace(/\D/g, ''));
    if (isNaN(numericValue) || value === 'AI') {
      setDisplay(value);
      return;
    }
    const duration = 1500;
    const startTime = performance.now();
    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * numericValue);
      setDisplay(current.toString());
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, value]);

  return <div ref={ref}>{display}{suffix}</div>;
}

/* ═══ HOVER CARD WITH GLOW ═══ */
function HoverCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...card,
        ...style,
        position: 'relative' as const,
        overflow: 'hidden' as const,
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        borderColor: hovered ? 'rgba(212,168,67,0.5)' : 'rgba(212,168,67,0.12)',
        backgroundColor: hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.025)',
        boxShadow: hovered
          ? '0 8px 32px rgba(212,168,67,0.1), 0 0 0 1px rgba(212,168,67,0.15), inset 0 1px 0 rgba(212,168,67,0.1)'
          : '0 0 0 0 transparent',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Top edge glow line */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.4), transparent)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }} />
      {children}
    </div>
  );
}

/* ═══ CONTACT FORM ═══ */
function ContactForm({ t }: { t: ReturnType<typeof getT>['contact'] }) {
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error || t.errorDefault);
        return;
      }

      setStatus('sent');
      setForm({ name: '', email: '', message: '', website: '' });
    } catch {
      setStatus('error');
      setErrorMsg(t.errorNetwork);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 18px', borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)',
    color: '#fff', fontSize: 14, fontFamily: body,
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  // Success state — animated checkmark
  if (status === 'sent') {
    return (
      <div style={{
        maxWidth: 480, margin: '0 auto', textAlign: 'center', padding: '40px 20px',
        animation: 'fadeInUp 0.5s ease',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
          background: 'linear-gradient(135deg, rgba(212,168,67,0.15), rgba(212,168,67,0.05))',
          border: '2px solid rgba(212,168,67,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CheckCircle size={28} color="#d4a843" />
        </div>
        <h3 style={{ fontFamily: heading, fontWeight: 400, fontSize: 24, color: '#fff', marginBottom: 8 }}>
          {t.successTitle}
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: body, lineHeight: 1.6, marginBottom: 24 }}>
          {t.successText}
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="outline-btn"
          style={{
            padding: '10px 24px', border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.5)', borderRadius: 999, fontSize: 13,
            fontFamily: body, background: 'transparent', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >{t.sendAnother}</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Honeypot — hidden from humans, bots fill it */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={e => setForm({ ...form, website: e.target.value })}
        style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="form-row">
        <label style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }} htmlFor="contact-name">{t.nameLabel}</label>
        <input
          id="contact-name"
          type="text" placeholder={t.namePlaceholder} required value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(212,168,67,0.3)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,168,67,0.05)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
        />
        <label style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }} htmlFor="contact-email">{t.emailLabel}</label>
        <input
          id="contact-email"
          type="email" placeholder={t.emailPlaceholder} required value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={inputStyle}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(212,168,67,0.3)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,168,67,0.05)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
        />
      </div>
      <label style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }} htmlFor="contact-message">{t.messageLabel}</label>
      <textarea
        id="contact-message"
        placeholder={t.messagePlaceholder} required rows={4} value={form.message}
        onChange={e => setForm({ ...form, message: e.target.value })}
        style={{ ...inputStyle, resize: 'vertical' as const, minHeight: 120 }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(212,168,67,0.3)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,168,67,0.05)'; }}
        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
      />

      {/* Error message */}
      {status === 'error' && (
        <p style={{ color: '#e74c3c', fontSize: 13, fontFamily: body, textAlign: 'center', margin: 0 }}>
          {errorMsg}
        </p>
      )}

      <button type="submit" disabled={status === 'sending'} className="cta-btn" style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '14px 36px', background: status === 'sending'
          ? 'linear-gradient(135deg, #c4a050, #a08030, #7a6020)'
          : 'linear-gradient(135deg, #ffeebb, #d4a843, #8a6a1e)',
        color: '#0a0908', borderRadius: 999, fontWeight: 600, fontSize: 14,
        border: 'none', cursor: status === 'sending' ? 'wait' : 'pointer', fontFamily: body,
        transition: 'transform 0.2s, box-shadow 0.2s, background 0.3s',
        opacity: status === 'sending' ? 0.8 : 1,
      }}>
        <Send size={16} style={{ animation: status === 'sending' ? 'pulse 1s ease-in-out infinite' : 'none' }} />
        {status === 'idle' || status === 'error' ? t.sendBtn : t.sendingBtn}
      </button>
    </form>
  );
}

/* ═══ TYPING EFFECT ═══ */
function TypeWriter({ text, speed = 35, delay = 800 }: { text: string; speed?: number; delay?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [started, text, speed, delay]);

  return <span ref={ref}>{displayed}<span className="cursor-blink">|</span></span>;
}

/* ═══ SECTION DIVIDER ═══ */
function SectionDivider() {
  return (
    <div style={{ height: 1, maxWidth: 200, margin: '0 auto', background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.15), transparent)' }} />
  );
}

/* ═══ FEATURE TOOLTIPS — vysvetlivky pre laikov ═══ */
const featureTooltips: Record<string, string> = {
  'SEO optimalizácia': 'Váš web sa zobrazí vyššie vo výsledkoch Google',
  'SEO optimisation': 'Your website will rank higher in Google results',
  'SEO optimalizace': 'Váš web se zobrazí výše ve výsledcích Google',
  'SEO optimalizáció': 'Weboldala magasabban jelenik meg a Google-ben',
  'CMS systém': 'Admin panel kde si meníte obsah sami, bez programátora',
  'CMS system': 'Admin panel where you edit content yourself, no developer needed',
  'CMS rendszer': 'Admin felület ahol maga szerkeszti a tartalmat',
  'SSL certifikát': 'Šifrovanie a zámok v prehliadači — bezpečný web',
  'SSL certificate': 'Encryption and padlock in browser — secure website',
  'SSL tanúsítvány': 'Titkosítás és lakat a böngészőben — biztonságos web',
  'Google Analytics': 'Štatistiky návštevnosti — koľko ľudí prišlo a odkiaľ',
  'Hosting (1. rok v cene)': 'Server kde beží váš web — 1. rok zadarmo',
  'Hosting (1st year included)': 'Server hosting your website — 1st year free',
  'Hosting (1. rok v ceně)': 'Server kde běží váš web — 1. rok zdarma',
  'Hosting (1. év az árban)': 'Szerver ahol a web fut — 1. év ingyenes',
  'Responzívna webstránka': 'Web vyzerá perfektne na mobile aj počítači',
  'Responsive website': 'Website looks perfect on mobile and desktop',
  'Responzivní webstránka': 'Web vypadá perfektně na mobilu i počítači',
  'Reszponzív weboldal': 'A weboldal tökéletesen néz ki mobilon és asztalon',
  'Vlastná doména': 'Vaša adresa na internete — napr. vasafirma.sk',
  'Custom domain': 'Your internet address — e.g. yourbusiness.com',
  'Vlastní doména': 'Vaše adresa na internetu — např. vasefirma.cz',
  'Saját domain': 'Az Ön internet címe — pl. cege.hu',
  'AI chatbot integrácia': 'Inteligentný chatbot ktorý odpovedá klientom 24/7',
  'AI chatbot integration': 'Smart chatbot that answers clients 24/7',
  'AI chatbot integrace': 'Inteligentní chatbot co odpovídá klientům 24/7',
  'AI chatbot integráció': 'Intelligens chatbot ami 24/7 válaszol az ügyfeleknek',
  'Blog modul': 'Píšte články a novinky — pomáha SEO aj dôveryhodnosti',
  'Blog module': 'Write articles and news — helps SEO and credibility',
  'E-mail automatizácia': 'Automatické emaily klientom — potvrdenia, novinky',
  'Email automation': 'Automated emails to clients — confirmations, news',
  'E-mail automatizace': 'Automatické emaily klientům — potvrzení, novinky',
  'E-mail automatizáció': 'Automatikus emailek az ügyfeleknek — visszaigazolások',
  'Kontaktný formulár': 'Formulár cez ktorý vám klienti píšu správy',
  'Contact form': 'Form through which clients send you messages',
  'Kontaktní formulář': 'Formulář přes který vám klienti píšou zprávy',
  'Kapcsolatfelvételi űrlap': 'Űrlap amin keresztül az ügyfelek üzenetet küldenek',
  'Mobilný dizajn': 'Web optimalizovaný pre smartfóny a tablety',
  'Mobile design': 'Website optimised for smartphones and tablets',
  'Mobilní design': 'Web optimalizovaný pro smartphony a tablety',
  'Mobil dizájn': 'Okostelefonokra és tabletekre optimalizált web',
  'Prioritná podpora': 'Prednostná technická pomoc — odpoveď do 4 hodín',
  'Priority support': 'Priority technical help — response within 4 hours',
  'Prioritní podpora': 'Přednostní technická pomoc — odpověď do 4 hodin',
  'Elsőbbségi támogatás': 'Elsőbbségi technikai segítség — válasz 4 órán belül',
  'Napojenie na soc. siete': 'Facebook, Instagram, LinkedIn — prepojenie s webom',
  'Social media integration': 'Facebook, Instagram, LinkedIn — connected to your site',
  'Napojení na soc. sítě': 'Facebook, Instagram, LinkedIn — propojení s webem',
  'Közösségi média integráció': 'Facebook, Instagram, LinkedIn — összekapcsolva a weboldallal',
};

/* ═══ PRICING CARD WITH SELECTION ═══ */
function PricingCard({ plan, isSelected, onSelect, tPricing }: {
  plan: { name: string; price: string; originalPrice?: string; featured: boolean; features: string[] };
  isSelected: boolean;
  onSelect: () => void;
  tPricing: ReturnType<typeof getT>['pricing'];
}) {
  const [hoveredFeature, setHoveredFeature] = useState(-1);
  const isHighlighted = isSelected || plan.featured;
  return (
    <div
      onClick={onSelect}
      style={{
        position: 'relative', padding: '36px 28px', borderRadius: 16,
        border: isHighlighted ? '1px solid rgba(212,168,67,0.3)' : '1px solid rgba(255,255,255,0.07)',
        backgroundColor: isHighlighted ? 'rgba(212,168,67,0.04)' : 'rgba(255,255,255,0.02)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isSelected ? '0 12px 40px rgba(212,168,67,0.12)' : 'none',
        cursor: 'pointer',
      }}
    >
      {isHighlighted && (
        <div style={{
          position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
          padding: '5px 18px', background: 'linear-gradient(135deg, #ffeebb, #d4a843, #8a6a1e)',
          borderRadius: 999, color: '#0a0908', fontSize: 10, fontWeight: 700,
          fontFamily: body, whiteSpace: 'nowrap',
          opacity: isHighlighted ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}>{plan.featured ? tPricing.popular : tPricing.selected}</div>
      )}

      {plan.originalPrice && tPricing.launchBadge && (
        <div style={{
          display: 'inline-block', marginBottom: 10,
          padding: '3px 10px', borderRadius: 4,
          background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.3)',
          fontSize: 9, fontWeight: 700, fontFamily: body,
          color: '#d4a843', letterSpacing: '0.05em',
        }}>{tPricing.launchBadge}</div>
      )}

      <h3 style={{ fontFamily: heading, fontWeight: 500, fontSize: 22, color: '#fff', marginBottom: 6 }}>{plan.name}</h3>
      <div style={{ marginBottom: 8 }}>
        {plan.originalPrice && (
          <div style={{ marginBottom: 4 }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15, fontFamily: body, textDecoration: 'line-through' }}>€{plan.originalPrice}</span>
          </div>
        )}
        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, fontFamily: body }}>{tPricing.from} </span>
        <span className={isHighlighted ? 'gold-shimmer' : ''} style={{
          fontFamily: body, fontWeight: 300, fontSize: 'clamp(32px, 3.5vw, 40px)',
          fontVariantNumeric: 'lining-nums' as const,
          ...goldGradient,
        }}>€{plan.price}</span>
      </div>
      {plan.originalPrice && tPricing.saving && (
        <div style={{
          marginBottom: 20, fontSize: 11, fontFamily: body, color: '#6abf69',
        }}>{tPricing.saving}: €{(parseInt(plan.originalPrice.replace(/[^0-9]/g, '')) - parseInt(plan.price.replace(/[^0-9]/g, ''))).toLocaleString('sk-SK')}</div>
      )}

      <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28 }}>
        {plan.features.map((f, j) => (
          <li
            key={j}
            onMouseEnter={() => setHoveredFeature(j)}
            onMouseLeave={() => setHoveredFeature(-1)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12,
              color: hoveredFeature === j ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
              fontSize: 13, fontFamily: body,
              transform: hoveredFeature === j ? 'translateX(4px)' : 'translateX(0)',
              transition: 'all 0.2s ease',
            }}
          >
            <CheckCircle size={15} color="#d4a843" style={{ flexShrink: 0, marginTop: 2 }} />
            <span title={featureTooltips[f] || undefined} style={{ cursor: featureTooltips[f] ? 'help' : undefined, borderBottom: featureTooltips[f] ? '1px dotted rgba(212,168,67,0.25)' : undefined, paddingBottom: featureTooltips[f] ? 1 : undefined }}>
              {f}
            </span>
          </li>
        ))}
      </ul>

      <a href="#kontakt" className={isHighlighted ? 'cta-btn' : 'outline-btn'} aria-label={tPricing.cta} style={{
        display: 'block', textAlign: 'center', padding: '12px 20px',
        borderRadius: 999, fontWeight: 600, fontSize: 13, fontFamily: body,
        textDecoration: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        ...(isHighlighted
          ? { background: 'linear-gradient(135deg, #ffeebb, #d4a843, #8a6a1e)', color: '#0a0908' }
          : { border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', backgroundColor: 'transparent' }
        ),
      }}>{tPricing.cta}</a>
    </div>
  );
}

/* ═══ FAQ ACCORDION ═══ */
function FAQItem({ question, answer, isOpen, onClick }: {
  question: string; answer: string; isOpen: boolean; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: '1px solid rgba(212,168,67,0.08)',
        transition: 'background-color 0.3s ease',
        backgroundColor: hovered ? 'rgba(212,168,67,0.02)' : 'transparent',
      }}
    >
      <button
        onClick={onClick}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{
          fontFamily: heading, fontWeight: 500, fontSize: 'clamp(15px, 2vw, 17px)',
          color: isOpen ? '#d4a843' : '#fff',
          transition: 'color 0.3s ease',
          paddingRight: 16,
        }}>{question}</span>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          border: `1px solid ${isOpen ? 'rgba(212,168,67,0.3)' : 'rgba(212,168,67,0.1)'}`,
          backgroundColor: isOpen ? 'rgba(212,168,67,0.08)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          <ChevronDown size={16} color="#d4a843" />
        </div>
      </button>
      <div style={{
        maxHeight: isOpen ? 200 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
        opacity: isOpen ? 1 : 0,
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.8,
          fontFamily: body, fontWeight: 300, padding: '0 0 20px 0',
        }}>{answer}</p>
      </div>
    </div>
  );
}

/* ═══ TESTIMONIAL CARD ═══ */
function TestimonialCard({ name, role, text }: { name: string; role: string; text: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '32px 28px',
        borderRadius: 16,
        border: `1px solid ${hovered ? 'rgba(212,168,67,0.25)' : 'rgba(212,168,67,0.08)'}`,
        backgroundColor: hovered ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.02)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 32px rgba(212,168,67,0.08)' : 'none',
        position: 'relative' as const,
        overflow: 'hidden' as const,
      }}
    >
      {/* Top glow */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.3), transparent)',
        opacity: hovered ? 1 : 0, transition: 'opacity 0.4s ease',
      }} />

      <Quote size={20} color="rgba(212,168,67,0.2)" style={{ marginBottom: 16 }} />

      {/* Stars */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill="#d4a843" color="#d4a843" />
        ))}
      </div>

      <p style={{
        color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.8,
        fontFamily: body, fontWeight: 300, fontStyle: 'italic',
        marginBottom: 20,
      }}>
        &ldquo;{text}&rdquo;
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Anonymous avatar */}
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(212,168,67,0.15), rgba(212,168,67,0.05))',
          border: '1px solid rgba(212,168,67,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: body, fontWeight: 600, fontSize: 13, color: '#fff' }}>{name}</div>
          <div style={{ fontFamily: body, fontWeight: 400, fontSize: 11, color: 'rgba(212,168,67,0.8)' }}>{role}</div>
        </div>
      </div>
    </div>
  );
}

/* ═══ SCROLL-TO-TOP BUTTON ═══ */
function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed', bottom: 32, right: 32, zIndex: 50,
        width: 44, height: 44, borderRadius: 12,
        border: '1px solid rgba(212,168,67,0.25)',
        background: hovered
          ? 'linear-gradient(135deg, rgba(212,168,67,0.2), rgba(212,168,67,0.08))'
          : 'rgba(10,9,8,0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.8)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: hovered ? '0 4px 24px rgba(212,168,67,0.15)' : '0 2px 12px rgba(0,0,0,0.3)',
      }}
    >
      <ChevronUp size={18} color="#d4a843" />
    </button>
  );
}

/* ═══ WHATSAPP FLOATING BUTTON ═══ */
function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="https://wa.me/421918668728"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed', bottom: 88, right: 32, zIndex: 50,
        width: 52, height: 52, borderRadius: '50%',
        background: hovered ? '#2bc44e' : '#25D366',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: hovered ? '0 6px 28px rgba(37,211,102,0.4)' : '0 4px 16px rgba(37,211,102,0.25)',
        transition: 'all 0.3s ease',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
        textDecoration: 'none',
      }}
    >
      <svg width={28} height={28} viewBox="0 0 24 24" fill="#fff">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  );
}

/* ═══ MAIN PAGE ═══ */
export default function Home({ locale = 'sk' }: { locale?: Locale }) {
  const tr = getT(locale);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedPlan, setSelectedPlan] = useState(1); // Business default
  const [pageReady, setPageReady] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(-1);

  useEffect(() => {
    // Smooth page fade-in on load
    const timer = setTimeout(() => setPageReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <main id="main-content" style={{
      overflow: 'hidden',
      opacity: pageReady ? 1 : 0,
      transition: 'opacity 0.6s ease',
    }}>

      <ScrollToTop />
      <WhatsAppButton />

      {/* ══ Top gradient line — premium detail ══ */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 1, zIndex: 100,
        background: 'linear-gradient(90deg, transparent 0%, rgba(212,168,67,0.4) 20%, #d4a843 50%, rgba(212,168,67,0.4) 80%, transparent 100%)',
      }} />

      {/* ══ HERO ══ */}
      <section style={{
        position: 'relative', minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center', paddingTop: 80,
      }}>
        {/* Parallax radial glow */}
        <div style={{
          position: 'absolute',
          top: `calc(38% + ${(mousePos.y - 0.5) * 20}px)`,
          left: `calc(50% + ${(mousePos.x - 0.5) * 20}px)`,
          transform: 'translate(-50%, -50%)', width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,168,67,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
          transition: 'top 0.3s ease-out, left 0.3s ease-out',
        }} />

        {/* Lens flare line with parallax */}
        <div style={{
          position: 'absolute', top: '33%', left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,238,187,0) 25%, rgba(255,238,187,0.06) 45%, rgba(255,238,187,0.12) 50%, rgba(255,238,187,0.06) 55%, rgba(255,238,187,0) 75%, transparent)',
          pointerEvents: 'none',
        }} />

        {/* Vignette edges — cinematic feel */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(10,9,8,0.6) 100%)',
        }} />

        {/* Bottom fade to dark */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, pointerEvents: 'none',
          background: 'linear-gradient(to top, #0a0908, transparent)',
        }} />

        {/* Floating particles effect */}
        <div className="particles" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`particle particle-${i}`} style={{
              position: 'absolute',
              width: 2, height: 2, borderRadius: '50%',
              backgroundColor: 'rgba(212,168,67,0.15)',
            }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', textAlign: 'center', padding: '40px 24px' }}>

          <FadeIn>
            <div style={{ marginBottom: 36 }}>
              <Image
                src="/images/logo-vertical.webp"
                alt="VW Vassweb"
                width={1200}
                height={774}
                priority
                style={{ height: 'clamp(120px, 18vw, 220px)', width: 'auto', margin: '0 auto', display: 'block' }}
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 style={{
              fontFamily: heading, fontWeight: 400,
              fontSize: 'clamp(32px, 5.5vw, 56px)',
              color: '#fff', marginBottom: 20, lineHeight: 1.15,
            }}>
              {tr.hero.line1}<br />
              <span style={goldGradient}>{tr.hero.line2}</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p style={{
              fontSize: 16, color: 'rgba(255,255,255,0.68)', fontFamily: body, fontWeight: 300,
              maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7, minHeight: '2.5em',
            }}>
              <TypeWriter text={tr.hero.typewriter} delay={1200} />
            </p>
          </FadeIn>

          <FadeIn delay={0.6}>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
              <a href="#kontakt" className="cta-btn hero-cta" style={{
                display: 'inline-block', padding: '14px 36px',
                background: 'linear-gradient(135deg, #ffeebb, #d4a843, #8a6a1e)',
                color: '#0a0908', borderRadius: 999, fontWeight: 600, fontSize: 14,
                textDecoration: 'none', fontFamily: body,
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative',
              }}>{tr.hero.ctaPrimary}</a>
              <a href="/vyber-si-web" className="outline-btn" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px',
                border: '1px solid rgba(212,168,67,0.35)', color: '#d4a843',
                borderRadius: 999, fontWeight: 600, fontSize: 14,
                textDecoration: 'none', backgroundColor: 'rgba(212,168,67,0.05)', fontFamily: body,
                transition: 'all 0.2s',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64L19.43 12.97z" fill="#d4a843" />
                </svg>
                {locale === 'en' ? 'Build your website' : locale === 'cs' ? 'Vytvořte si web' : locale === 'hu' ? 'Készítse el weboldalát' : 'Vytvor si web'}
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.8}>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 999, fontSize: 12, color: 'rgba(34,197,94,0.85)', fontWeight: 600, fontFamily: body }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="rgba(34,197,94,0.85)" /></svg>
                {locale === 'en' ? 'Every website built from scratch' : locale === 'cs' ? 'Každý web stavíme od základu' : locale === 'hu' ? 'Minden weboldal alapoktól épül' : 'Každý web staviame od základu'}
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(251,146,60,0.07)', border: '1px solid rgba(251,146,60,0.15)', borderRadius: 999, fontSize: 12, color: 'rgba(251,146,60,0.9)', fontWeight: 600, fontFamily: body }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" fill="rgba(251,146,60,0.9)" /></svg>
                {locale === 'en' ? 'Limited projects per month' : locale === 'cs' ? 'Omezený počet projektů měsíčně' : locale === 'hu' ? 'Korlátozott projektszám havonta' : 'Obmedzený počet projektov mesačne'}
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(212,168,67,0.07)', border: '1px solid rgba(212,168,67,0.15)', borderRadius: 999, fontSize: 12, color: 'rgba(212,168,67,0.85)', fontWeight: 600, fontFamily: body }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" fill="rgba(212,168,67,0.85)" /></svg>
                {locale === 'en' ? 'Typically 14 days' : locale === 'cs' ? 'Obvykle 14 dní' : locale === 'hu' ? 'Általában 14 nap' : 'Zvyčajne 14 dní'}
              </div>
            </div>
          </FadeIn>

          <div style={{ animation: 'pulse 2s ease-in-out infinite', opacity: 0.2 }}>
            <ArrowDown size={18} style={{ color: '#d4a843', margin: '0 auto' }} />
          </div>

          {/* Scroll hint text */}
          <p style={{
            marginTop: 12, fontSize: 10, fontFamily: body,
            color: 'rgba(212,168,67,0.15)', letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
          }}>scroll</p>
        </div>
      </section>

      <SectionDivider />

      {/* ══ SERVICES ══ */}
      <section id="sluzby" style={section}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={label}>{tr.services.label}</p>
              <h2 style={h2Style}>{tr.services.heading}</h2>
              <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, #d4a843, transparent)', margin: '0 auto' }} />
            </div>
          </FadeIn>

          <div className="grid-services" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[Globe, Bot, Zap, Smartphone].map((Icon, i) => {
              const s = tr.services.items[i];
              return (
                <FadeIn key={i} delay={i * 0.1}>
                  <HoverCard>
                    <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(212,168,67,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                      <Icon size={22} color="#d4a843" strokeWidth={1.5} />
                    </div>
                    <h3 style={{ fontFamily: heading, fontWeight: 500, fontSize: 20, color: '#fff', marginBottom: 8 }}>{s.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 13, lineHeight: 1.7, fontFamily: body }}>{s.desc}</p>
                  </HoverCard>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ══ ABOUT ══ */}
      <section id="o-nas" style={sectionAlt}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={label}>{tr.about.label}</p>
              <h2 style={h2Style}>{tr.about.heading}</h2>
            </div>
          </FadeIn>

          <div className="grid-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 48 }}>
            {tr.about.stats.map((item, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                  <div style={{ fontFamily: heading, fontWeight: 400, fontSize: 'clamp(40px, 5vw, 56px)', ...goldGradient, marginBottom: 6 }}>
                    <AnimatedCounter value={item.num} suffix={item.suffix} />
                  </div>
                  <div style={{ color: 'rgba(212,168,67,0.8)', fontSize: 11, fontWeight: 600, fontFamily: body, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>{item.lbl}</div>
                  <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 14, fontFamily: body }}>{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
              {/* Ambient glow behind card */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%', height: '120%',
                background: 'radial-gradient(ellipse, rgba(212,168,67,0.04), transparent 70%)',
                pointerEvents: 'none',
              }} />
              <div style={{ ...card, padding: '36px 32px', textAlign: 'center', position: 'relative' }}>
                <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, lineHeight: 1.8, fontFamily: body, fontWeight: 300, fontStyle: 'italic' }}>
                  &ldquo;{tr.about.tagline}&rdquo;
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <SectionDivider />

      {/* ══ WHAT YOU GET ══ */}
      <section id="co-ziskate" style={section}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={label}>{tr.benefits.label}</p>
              <h2 style={h2Style}>{tr.benefits.heading}</h2>
              <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, #d4a843, transparent)', margin: '0 auto' }} />
            </div>
          </FadeIn>

          <div className="grid-benefits" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[Zap, Shield, MonitorSmartphone, Search, Wrench, BarChart3].map((BenefitIcon, i) => {
              const item = tr.benefits.items[i];
              return (
                <FadeIn key={i} delay={i * 0.08}>
                  <HoverCard style={{ padding: '28px 24px', display: 'flex', alignItems: 'flex-start', gap: 18 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                      background: 'linear-gradient(135deg, rgba(212,168,67,0.15), rgba(212,168,67,0.05))',
                      border: '1px solid rgba(212,168,67,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 16px rgba(212,168,67,0.06)',
                    }}>
                      <BenefitIcon size={26} color="#d4a843" strokeWidth={1.8} />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: heading, fontWeight: 500, fontSize: 17, color: '#fff', marginBottom: 6 }}>{item.title}</h4>
                      <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 13, lineHeight: 1.6, fontFamily: body }}>{item.desc}</p>
                    </div>
                  </HoverCard>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ══ PROCESS ══ */}
      <section id="proces" style={sectionAlt}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={label}>{tr.process.label}</p>
              <h2 style={h2Style}>{tr.process.heading}</h2>
            </div>
          </FadeIn>

          <div className="grid-process" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {tr.process.steps.map((item, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <HoverCard>
                  <div style={{ fontFamily: body, fontWeight: 300, fontSize: 32, ...goldGradient, marginBottom: 12, fontVariantNumeric: 'lining-nums' as const }}>{item.step}</div>
                  <h3 style={{ fontFamily: heading, fontWeight: 500, fontSize: 18, color: '#fff', marginBottom: 6 }}>{item.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 13, lineHeight: 1.6, fontFamily: body }}>{item.desc}</p>
                </HoverCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ══ PRICING ══ */}
      <section id="cennik" style={section}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={label}>{tr.pricing.label}</p>
              <h2 style={h2Style}>{tr.pricing.heading}</h2>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: 'rgba(251,146,60,0.07)', border: '1px solid rgba(251,146,60,0.15)', borderRadius: 999, fontSize: 12, color: 'rgba(251,146,60,0.9)', fontWeight: 600, fontFamily: body }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" fill="rgba(251,146,60,0.9)" /></svg>
                  {locale === 'en' ? 'Limited projects per month' : locale === 'cs' ? 'Omezený počet projektů měsíčně' : locale === 'hu' ? 'Korlátozott projektszám havonta' : 'Obmedzený počet projektov mesačne'}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: 'rgba(212,168,67,0.07)', border: '1px solid rgba(212,168,67,0.15)', borderRadius: 999, fontSize: 12, color: 'rgba(212,168,67,0.85)', fontWeight: 600, fontFamily: body }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="rgba(212,168,67,0.85)" /></svg>
                  {locale === 'en' ? 'Typically 14 days' : locale === 'cs' ? 'Obvykle 14 dní' : locale === 'hu' ? 'Általában 14 nap' : 'Zvyčajne 14 dní'}
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="grid-pricing" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {tr.pricing.plans.map((plan, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <PricingCard plan={plan} isSelected={selectedPlan === i} onSelect={() => setSelectedPlan(i)} tPricing={tr.pricing} />
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <p style={{ textAlign: 'center', marginTop: 24, color: 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: body }}>
              {tr.pricing.note}
            </p>
          </FadeIn>
        </div>
      </section>

      <SectionDivider />

      {/* ══ TESTIMONIALS ══ */}
      <section id="referencie" style={sectionAlt}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={label}>{tr.testimonials.label}</p>
              <h2 style={h2Style}>{tr.testimonials.heading}</h2>
              <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, #d4a843, transparent)', margin: '0 auto' }} />
            </div>
          </FadeIn>

          <div className="grid-testimonials" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {tr.testimonials.items.map((item, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <TestimonialCard name={item.name} role={item.role} text={item.text} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ══ REALIZÁCIE — skutočné demo stránky (clickable showcase) ══ */}
      <section id="realizacie" style={section}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={label}>{locale === 'en' ? 'LIVE DEMOS' : locale === 'cs' ? 'UKÁZKY' : locale === 'hu' ? 'ÉLŐ DEMÓK' : 'UKÁŽKY'}</p>
              <h2 style={h2Style}>
                {locale === 'en' ? 'See our ' : locale === 'cs' ? 'Podívejte se na naše ' : locale === 'hu' ? 'Nézze meg ' : 'Pozrite si naše '}
                <span style={goldGradient}>{locale === 'en' ? 'real work' : locale === 'cs' ? 'reálné weby' : locale === 'hu' ? 'valós munkáinkat' : 'reálne weby'}</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 15, fontFamily: body, maxWidth: 540, margin: '12px auto 0' }}>
                {locale === 'en' ? '10 fully functional demo websites — one for each package tier. Click to open.' : locale === 'cs' ? '10 plně funkčních demo webů — jeden pro každý balíček. Klikněte pro otevření.' : locale === 'hu' ? '10 teljesen működő demó weboldal — minden csomaghoz egy. Kattintson a megnyitáshoz.' : '10 plne funkčných demo webov — jeden pre každý balíček. Kliknite pre otvorenie.'}
              </p>
              <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, #d4a843, transparent)', margin: '20px auto 0' }} />
            </div>
          </FadeIn>

          <div className="grid-realizacie" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { slug: 'salon-bella', name: 'Kaderníctvo Salón Bella', tier: 'Starter', price: '299€', color: '#ec4899', tpl: 'beauty', pkg: 'starter' },
              { slug: 'cafe-milano', name: 'Kaviareň Café Milano', tier: 'Starter', price: '299€', color: '#a8754b', tpl: 'restaurant', pkg: 'starter' },
              { slug: 'foto-studio', name: 'Fotoštúdio Atelier NOIR', tier: 'Basic', price: '590€', color: '#f59e0b', tpl: 'foto', pkg: 'basic' },
              { slug: 'kvetinarstvo', name: 'Kvety & Radosť', tier: 'Basic', price: '590€', color: '#84cc16', tpl: 'firma', pkg: 'basic' },
              { slug: 'advokat-kovac', name: 'JUDr. Kováč & Partners', tier: 'Business', price: '990€', color: '#1e3a8a', tpl: 'ucto', pkg: 'business' },
              { slug: 'dentalna-klinika', name: 'DentCare Klinika', tier: 'Business', price: '990€', color: '#14b8a6', tpl: 'zubar', pkg: 'business' },
              { slug: 'crm-realitka', name: 'CRM Realitka ProDom', tier: 'Premium', price: '1990€', color: '#3b82f6', tpl: 'realitka', pkg: 'premium' },
              { slug: 'crm-autoservis', name: 'CRM Autoservis', tier: 'Premium', price: '1990€', color: '#10b981', tpl: 'auto', pkg: 'premium' },
              { slug: 'eshop-flavour', name: 'E-shop FLAVOUR', tier: 'Premium', price: '1990€', color: '#f87171', tpl: 'eshop', pkg: 'premium' },
              { slug: 'booking-system', name: 'BookIT Rezervácie', tier: 'Premium', price: '1990€', color: '#6366f1', tpl: 'hotel', pkg: 'premium' },
            ].map((demo, i) => (
              <FadeIn key={demo.slug} delay={Math.min(i * 0.05, 0.4)}>
                <a
                  href={`/demo/${demo.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${locale === 'en' ? 'Open demo' : 'Otvoriť demo'}: ${demo.name}`}
                  style={{
                    display: 'block',
                    position: 'relative',
                    borderRadius: 14,
                    overflow: 'hidden',
                    border: '1px solid rgba(212,168,67,0.12)',
                    background: 'rgba(255,255,255,0.02)',
                    textDecoration: 'none',
                    transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                    aspectRatio: '4/3',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'rgba(212,168,67,0.35)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(212,168,67,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(212,168,67,0.12)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Color preview stripe */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${demo.color}, ${demo.color}88)` }} />
                  {/* Browser chrome mockup */}
                  <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,95,87,0.6)' }} />
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(254,188,46,0.6)' }} />
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(40,200,64,0.6)' }} />
                    </div>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 2 }} />
                  </div>
                  {/* Card content */}
                  <div style={{ padding: '14px 16px 16px', color: '#fff' }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      borderRadius: 999,
                      background: `${demo.color}18`,
                      border: `1px solid ${demo.color}40`,
                      color: demo.color,
                      fontSize: 9,
                      fontWeight: 700,
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.08em',
                      marginBottom: 8,
                    }}>
                      {demo.tier} · {demo.price}
                    </div>
                    <div style={{ fontFamily: heading, fontSize: 14, fontWeight: 500, lineHeight: 1.35, marginBottom: 6 }}>
                      {demo.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(212,168,67,0.7)', fontFamily: body, fontWeight: 600 }}>
                      {locale === 'en' ? 'Open demo' : locale === 'cs' ? 'Otevřít demo' : locale === 'hu' ? 'Megnyitás' : 'Otvoriť demo'}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H9M17 7V15" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  </div>
                </a>
                <a
                  href={`/vyber-si-web?template=${demo.tpl}&package=${demo.pkg}&step=2`}
                  aria-label={`${locale === 'en' ? 'Configure similar' : 'Konfigurovať podobný'}: ${demo.name}`}
                  style={{
                    display: 'block',
                    marginTop: 6,
                    textAlign: 'center',
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.35)',
                    textDecoration: 'none',
                    fontFamily: body,
                    letterSpacing: '0.04em',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#d4a843'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
                >
                  {locale === 'en' ? 'I want a similar one →' : locale === 'cs' ? 'Chci podobný →' : locale === 'hu' ? 'Hasonlót szeretnék →' : 'Chcem podobný →'}
                </a>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <p style={{ textAlign: 'center', marginTop: 32, fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: body, fontStyle: 'italic' }}>
              {locale === 'en' ? 'All data in the demos is anonymized — no real client information.' : locale === 'cs' ? 'Všechna data v demech jsou anonymizovaná — žádné reálné údaje klientů.' : locale === 'hu' ? 'A demókban minden adat anonimizált — nincs valós ügyféladat.' : 'Všetky údaje v demách sú anonymizované — žiadne reálne údaje klientov.'}
            </p>
          </FadeIn>
        </div>
      </section>

      <SectionDivider />

      {/* ══ VYBER SI WEB — namiesto portfólia ══ */}
      <section id="portfolio" style={section}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={label}>{locale === 'en' ? 'CONFIGURATOR' : locale === 'hu' ? 'KONFIGURÁTOR' : 'KONFIGURÁTOR'}</p>
              <h2 style={h2Style}>{locale === 'en' ? 'Choose your website' : locale === 'cs' ? 'Vyberte si svůj web' : locale === 'hu' ? 'Válassza ki weboldalát' : 'Vyberte si svoj web'}</h2>
              <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 15, fontFamily: body, maxWidth: 540, margin: '12px auto 0' }}>
                {locale === 'en' ? '16 templates for different industries. Choose a design, colors, upload your logo — and we\'ll build it. Ready in 5 days.' : locale === 'cs' ? '16 šablon pro různá odvětví. Vyberte si design, barvy, nahrajte logo — a my to postavíme. Hotové do 5 dnů.' : locale === 'hu' ? '16 sablon különböző iparágakhoz. Válasszon dizájnt, színeket, töltse fel logóját — és mi megépítjük. 5 napon belül kész.' : '16 šablón pre rôzne odvetvia. Vyberte si dizajn, farby, nahrajte logo — a my to postavíme. Hotové do 5 dní.'}
              </p>
              <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, #d4a843, transparent)', margin: '20px auto 0' }} />
            </div>
          </FadeIn>

          {/* Šablóny grid */}
          <div className="grid-portfolio" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { path: 'M11 3V7H13V3H11ZM7.5 3C7.22 3 7 3.22 7 3.5V9C7 10.1 7.9 11 9 11V20C9 20.55 9.45 21 10 21H10C10.55 21 11 20.55 11 20V11C12.1 11 13 10.1 13 9V3.5C13 3.22 12.78 3 12.5 3H12.5C12.22 3 12 3.22 12 3.5V8H11V3.5C11 3.22 10.78 3 10.5 3H10.5C10.22 3 10 3.22 10 3.5V8H9V3.5C9 3.22 8.78 3 8.5 3H8.5C8.22 3 8 3.22 8 3.5V8L7.5 3ZM16 3C14.9 3 14 4.9 14 7C14 8.74 14.63 10.19 15.5 10.78V20C15.5 20.55 15.95 21 16.5 21H16.5C17.05 21 17.5 20.55 17.5 20V10.78C18.37 10.19 19 8.74 19 7C19 4.9 18.1 3 17 3H16Z', name: 'Reštaurácia / Kaviareň', price: 'od 299 €' },
              { path: 'M6.2 2C5.54 2 5 2.54 5 3.2V11H5C3.9 11 3 11.9 3 13V15C3 16.1 3.9 17 5 17H6V21C6 21.55 6.45 22 7 22H7C7.55 22 8 21.55 8 21V17H9C10.1 17 11 16.1 11 15V13C11 11.9 10.1 11 9 11H9V3.2C9 2.54 8.46 2 7.8 2H6.2ZM13 2L16.5 8.5L20 2H13ZM16.5 10C14.84 10 13.5 11.34 13.5 13C13.5 14.3 14.36 15.41 15.5 15.82V21C15.5 21.55 15.95 22 16.5 22C17.05 22 17.5 21.55 17.5 21V15.82C18.64 15.41 19.5 14.3 19.5 13C19.5 11.34 18.16 10 16.5 10Z', name: 'Kaderníctvo / Kozmetika', price: 'od 299 €' },
              { path: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.29 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13S8 13.67 8 14.5S7.33 16 6.5 16ZM17.5 16C16.67 16 16 15.33 16 14.5S16.67 13 17.5 13S19 13.67 19 14.5S18.33 16 17.5 16ZM5 11L6.5 6.5H17.5L19 11H5Z', name: 'Autoservis / Pneuservis', price: 'od 299 €' },
              { path: 'M20.57 14.86L22 13.43L20.57 12L17 15.57L8.43 7L12 3.43L10.57 2L9.14 3.43L7.71 2L5.57 4.14L4.14 2.71L2.71 4.14L4.14 5.57L2 7.71L3.43 9.14L2 10.57L3.43 12L7 8.43L15.57 17L12 20.57L13.43 22L14.86 20.57L16.29 22L18.43 19.86L19.86 21.29L21.29 19.86L19.86 18.43L22 16.29L20.57 14.86Z', name: 'Fitness / Joga / Masáže', price: 'od 299 €' },
              { path: 'M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z', name: 'Stavebná firma / Remeselník', price: 'od 299 €' },
              { path: 'M12 2C9.24 2 7 4.24 7 7C7 9.85 8.41 11.56 9.5 12.83C10 13.4 10.45 13.91 10.71 14.42C11.28 15.56 11 17 11 18C11 19.1 11.5 20 12 20S13 19.1 13 18C13 17 12.72 15.56 13.29 14.42C13.55 13.91 14 13.4 14.5 12.83C15.59 11.56 17 9.85 17 7C17 4.24 14.76 2 12 2Z', name: 'Zubár / Lekár / Klinika', price: 'od 299 €' },
              { path: 'M4.5 9.5C5.88 9.5 7 8.38 7 7S5.88 4.5 4.5 4.5S2 5.62 2 7S3.12 9.5 4.5 9.5ZM9 5.5C10.38 5.5 11.5 4.38 11.5 3S10.38 0.5 9 0.5S6.5 1.62 6.5 3S7.62 5.5 9 5.5ZM15 5.5C16.38 5.5 17.5 4.38 17.5 3S16.38 0.5 15 0.5S12.5 1.62 12.5 3S13.62 5.5 15 5.5ZM19.5 9.5C20.88 9.5 22 8.38 22 7S20.88 4.5 19.5 4.5S17 5.62 17 7S18.12 9.5 19.5 9.5ZM17.34 14.86C14.28 11.8 8.67 12.56 6.34 16.14C4.01 19.72 5.07 22.5 8.5 22.5C10.43 22.5 11.22 20.5 12 20.5C12.78 20.5 13.57 22.5 15.5 22.5C18.93 22.5 20.4 17.92 17.34 14.86Z', name: 'Veterinár / Pet salón', price: 'od 299 €' },
              { path: 'M12 10.8C13.77 10.8 15.2 12.23 15.2 14C15.2 15.77 13.77 17.2 12 17.2C10.23 17.2 8.8 15.77 8.8 14C8.8 12.23 10.23 10.8 12 10.8ZM9 2L7.17 4H4C2.9 4 2 4.9 2 6V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V6C22 4.9 21.1 4 20 4H16.83L15 2H9ZM12 19C9.24 19 7 16.76 7 14C7 11.24 9.24 9 12 9C14.76 9 17 11.24 17 14C17 16.76 14.76 19 12 19Z', name: 'Fotograf / Videograf', price: 'od 299 €' },
              { path: 'M12 6C12 4.9 11.1 4 10 4C10 2.9 9.1 2 8 2S6 2.9 6 4C4.9 4 4 4.9 4 6H12ZM3 8V10C3 11.1 3.9 12 5 12V20C5 21.1 5.9 22 7 22H9C10.1 22 11 21.1 11 20V12C12.1 12 13 11.1 13 10V8H3ZM19 6H15V8H19V10H15V12H19C20.1 12 21 11.1 21 10V8C21 6.9 20.1 6 19 6ZM17 14H15V20C15 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20V14H17Z', name: 'Cukráreň / Pekáreň', price: 'od 299 €' },
              { path: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 6C8.69 6 6 8.69 6 12H12V6Z', name: 'Autoškola', price: 'od 299 €' },
              { path: 'M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM11 17H7V15H11V17ZM11 13H7V11H11V13ZM11 9H7V7H11V9ZM17 17H13V15H17V17ZM17 13H13V11H17V13ZM17 9H13V7H17V9Z', name: 'Účtovník / Daňový poradca', price: 'od 299 €' },
              { path: 'M12 3L2 12H5V20H11V14H13V20H19V12H22L12 3ZM12 7.7L17 12.2V18H15V12H9V18H7V12.2L12 7.7Z', name: 'Realitná kancelária', price: 'od 590 €' },
              { path: 'M7 13C8.66 13 10 11.66 10 10C10 8.34 8.66 7 7 7C5.34 7 4 8.34 4 10C4 11.66 5.34 13 7 13ZM19 7H11V14H3V5H1V19H3V17H21V19H23V11C23 8.79 21.21 7 19 7Z', name: 'Hotel / Penzión', price: 'od 590 €' },
              { path: 'M12 2C9.79 2 8 3.79 8 6C8 7.2 8.54 8.27 9.38 9L12 21L14.62 9C15.46 8.27 16 7.2 16 6C16 3.79 14.21 2 12 2ZM12 8C10.9 8 10 7.1 10 6C10 4.9 10.9 4 12 4C13.1 4 14 4.9 14 6C14 7.1 13.1 8 12 8Z', name: 'Svadobný salón / Krajčír', price: 'od 299 €' },
              { path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', name: 'Portfólio / Osobná stránka', price: 'od 299 €' },
              { path: 'M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22S9 21.1 9 20S8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1Z', name: 'E-shop', price: 'od 1 990 €' },
            ].map((tmpl, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{
                  ...card, color: '#fff', display: 'flex', alignItems: 'center', gap: 16,
                  transition: 'transform 0.3s ease, border-color 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(212,168,67,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(212,168,67,0.12)'; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(212,168,67,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d={tmpl.path} fill="#d4a843" /></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: heading, fontSize: 17, fontWeight: 500, marginBottom: 2 }}>{tmpl.name}</div>
                    <div style={{ fontSize: 13, color: '#d4a843', fontWeight: 600 }}>{tmpl.price}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* CTA — Konfigurátor */}
          <FadeIn delay={0.4}>
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 14, fontFamily: body, marginBottom: 20 }}>
                {locale === 'en' ? 'Choose colors, upload your logo and send us a brief — we\'ll get back to you within 24 hours' : locale === 'cs' ? 'Vyberte si barvy, nahrajte logo a pošlete nám brief — ozveme se do 24 hodin' : locale === 'hu' ? 'Válasszon színeket, töltse fel logóját és küldjön briefet — 24 órán belül jelentkezünk' : 'Vyberte si farby, nahrajte logo a pošlite nám brief — ozveme sa do 24 hodín'}
              </p>
              <a href="/vyber-si-web" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '16px 40px', borderRadius: 12,
                background: 'linear-gradient(135deg, #ffeebb, #d4a843, #8a6a1e)',
                color: '#0a0908', fontSize: 16, fontWeight: 700, fontFamily: body,
                textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 24px rgba(212,168,67,0.3)',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(212,168,67,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(212,168,67,0.3)'; }}
              >
                {locale === 'en' ? 'Configure your website →' : locale === 'cs' ? 'Nakonfigurovat si web →' : locale === 'hu' ? 'Konfigurálja weboldalát →' : 'Nakonfigurovať si web →'}
              </a>
              <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 12, fontFamily: body, marginTop: 12 }}>
                {locale === 'en' ? 'Choose a template, colors, upload your logo — done in 3 minutes' : locale === 'cs' ? 'Vyberte šablonu, barvy, nahrajte logo — hotové za 3 minuty' : locale === 'hu' ? 'Válasszon sablont, színeket, töltse fel logóját — 3 perc alatt kész' : 'Vyberte šablónu, farby, nahrajte logo — hotové za 3 minúty'}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <SectionDivider />

      {/* ══ FAQ ══ */}
      <section id="faq" style={section}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={label}>{tr.faq.label}</p>
              <h2 style={h2Style}>{tr.faq.heading}</h2>
              <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, #d4a843, transparent)', margin: '0 auto' }} />
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{
              border: '1px solid rgba(212,168,67,0.08)',
              borderRadius: 16,
              padding: '8px 28px',
              backgroundColor: 'rgba(255,255,255,0.015)',
            }}>
              {tr.faq.items.map((item, i) => (
                <FAQItem
                  key={i}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openFAQ === i}
                  onClick={() => setOpenFAQ(openFAQ === i ? -1 : i)}
                />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <SectionDivider />

      {/* ══ CTA + CONTACT FORM ══ */}
      <section id="kontakt" style={sectionAlt}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <FadeIn>
            <p style={label}>{tr.contact.label}</p>
            <h2 style={{ ...h2Style, marginBottom: 20 }}>
              <span style={goldGradient}>{tr.contact.heading1}</span>{' '}{tr.contact.heading2}
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.62)', lineHeight: 1.7, fontFamily: body, fontWeight: 300, maxWidth: 440, margin: '0 auto 40px' }}>
              {tr.contact.subtext}
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <ContactForm t={tr.contact} />
          </FadeIn>

          <FadeIn delay={0.3}>
            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 30, height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.2), transparent)', marginBottom: 4 }} />
              <p style={{ fontSize: 11, fontFamily: body, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>
                {locale === 'en' ? 'Or reach us directly' : locale === 'cs' ? 'Nebo nás kontaktujte přímo' : locale === 'hu' ? 'Vagy keressen minket közvetlenül' : 'Alebo nás kontaktujte priamo'}
              </p>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href="tel:+421918668728" className="animated-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(212,168,67,0.75)', fontSize: 13, textDecoration: 'none', fontFamily: body, transition: 'color 0.3s' }}>
                  <Phone size={14} /> +421 918 668 728
                </a>
                <a href="mailto:info@vassweb.com" className="animated-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(212,168,67,0.75)', fontSize: 13, textDecoration: 'none', fontFamily: body, transition: 'color 0.3s' }}>
                  <Mail size={14} /> info@vassweb.com
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ position: 'relative', borderTop: '1px solid rgba(212,168,67,0.08)', padding: '64px 24px 40px' }}>
        {/* Ambient glow at top of footer */}
        <div style={{
          position: 'absolute', top: -1, left: '20%', right: '20%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.2), transparent)',
        }} />

        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Top section — logo centered + tagline */}
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <Image src="/images/logo-horizontal.webp" alt="Vassweb" width={1200} height={774} style={{ height: 36, width: 'auto', margin: '0 auto 16px', display: 'block' }} />
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: body, lineHeight: 1.8, maxWidth: 400, margin: '0 auto' }}>
                {tr.footer.tagline}
              </p>
            </div>
          </FadeIn>

          {/* Middle section — 3 columns: nav, contact, legal */}
          <div className="grid-footer" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, marginBottom: 48 }}>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'rgba(212,168,67,0.7)', fontWeight: 600, fontSize: 10, fontFamily: body, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>{tr.footer.navHeading}</h4>
              {tr.footer.navLinks.map(l => (
                <a key={l.href} href={l.href} className="footer-link" style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none', marginBottom: 10, fontFamily: body, transition: 'color 0.3s' }}>{l.label}</a>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'rgba(212,168,67,0.7)', fontWeight: 600, fontSize: 10, fontFamily: body, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>{tr.footer.contactHeading}</h4>
              <a href="tel:+421918668728" className="footer-link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none', marginBottom: 10, fontFamily: body, transition: 'color 0.3s' }}>
                <Phone size={13} color="rgba(212,168,67,0.6)" /> +421 918 668 728
              </a>
              <a href="mailto:info@vassweb.com" className="footer-link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none', marginBottom: 10, fontFamily: body, transition: 'color 0.3s' }}>
                <Mail size={13} color="rgba(212,168,67,0.6)" /> info@vassweb.com
              </a>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'rgba(212,168,67,0.7)', fontWeight: 600, fontSize: 10, fontFamily: body, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>{tr.footer.legalHeading}</h4>
              <a href={locale === 'en' ? '/en/privacy-policy' : locale === 'cs' ? '/cs/ochrana-udaju' : locale === 'hu' ? '/hu/adatvedelmi-iranyelvek' : '/ochrana-udajov'} className="footer-link" style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none', marginBottom: 10, fontFamily: body, transition: 'color 0.3s' }}>{tr.footer.privacy}</a>
              <a href={locale === 'en' ? '/en/terms-and-conditions' : locale === 'cs' ? '/cs/obchodni-podminky' : locale === 'hu' ? '/hu/altalanos-szerzodesi-feltetelek' : '/obchodne-podmienky'} className="footer-link" style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none', marginBottom: 10, fontFamily: body, transition: 'color 0.3s' }}>{tr.footer.terms}</a>
            </div>
          </div>

          {/* Company info — povinné údaje podľa § 3a OZ a § 4 ZoEO */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 24, marginBottom: 16, textAlign: 'center' }}>
            <h4 style={{ color: 'rgba(212,168,67,0.7)', fontWeight: 600, fontSize: 10, fontFamily: body, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>{tr.footer.companyHeading}</h4>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: body, lineHeight: 1.8 }}>
              {tr.footer.companyLines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: body }}>
              {tr.footer.copyright}
            </p>
            <p style={{ color: 'rgba(212,168,67,0.4)', fontSize: 9, fontFamily: body, letterSpacing: '0.2em', textTransform: 'uppercase' as const }}>
              Crafted with precision
            </p>
          </div>
        </div>
      </footer>

      {/* ═══ ANIMATIONS & STYLES ═══ */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: translateY(0); }
          50% { opacity: 0.5; transform: translateY(4px); }
        }

        /* Floating particles */
        @keyframes float-0 { 0% { top: 20%; left: 10%; opacity: 0; } 50% { opacity: 0.3; } 100% { top: 80%; left: 15%; opacity: 0; } }
        @keyframes float-1 { 0% { top: 30%; left: 85%; opacity: 0; } 50% { opacity: 0.2; } 100% { top: 70%; left: 80%; opacity: 0; } }
        @keyframes float-2 { 0% { top: 60%; left: 20%; opacity: 0; } 50% { opacity: 0.25; } 100% { top: 10%; left: 25%; opacity: 0; } }
        @keyframes float-3 { 0% { top: 10%; left: 70%; opacity: 0; } 50% { opacity: 0.2; } 100% { top: 90%; left: 65%; opacity: 0; } }
        @keyframes float-4 { 0% { top: 50%; left: 5%; opacity: 0; } 50% { opacity: 0.15; } 100% { top: 20%; left: 10%; opacity: 0; } }
        @keyframes float-5 { 0% { top: 80%; left: 90%; opacity: 0; } 50% { opacity: 0.2; } 100% { top: 30%; left: 85%; opacity: 0; } }

        .particle-0 { animation: float-0 8s ease-in-out infinite; }
        .particle-1 { animation: float-1 10s ease-in-out infinite 1s; }
        .particle-2 { animation: float-2 9s ease-in-out infinite 2s; }
        .particle-3 { animation: float-3 11s ease-in-out infinite 0.5s; }
        .particle-4 { animation: float-4 7s ease-in-out infinite 3s; }
        .particle-5 { animation: float-5 12s ease-in-out infinite 1.5s; }

        /* Gold shimmer on selected pricing */
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .gold-shimmer {
          background: linear-gradient(90deg, #d4a843 0%, #ffeebb 25%, #fff 50%, #ffeebb 75%, #d4a843 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        /* Blinking cursor for TypeWriter */
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .cursor-blink {
          animation: blink 0.8s step-end infinite;
          color: #d4a843;
          font-weight: 300;
        }

        /* Hero CTA animated glow border */
        @keyframes borderGlow {
          0%, 100% { box-shadow: 0 0 12px rgba(212,168,67,0.15), 0 0 4px rgba(255,238,187,0.1); }
          50% { box-shadow: 0 0 24px rgba(212,168,67,0.3), 0 0 8px rgba(255,238,187,0.2); }
        }
        .hero-cta {
          animation: borderGlow 3s ease-in-out infinite;
        }
        .hero-cta:hover {
          animation: none;
        }

        /* CTA button hover effects */
        .cta-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 20px rgba(212,168,67,0.3) !important;
        }
        .outline-btn:hover {
          border-color: rgba(212,168,67,0.3) !important;
          color: rgba(255,255,255,0.8) !important;
          background-color: rgba(212,168,67,0.05) !important;
        }

        /* Form success animation */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Footer link hover */
        .footer-link {
          transition: color 0.25s ease, transform 0.25s ease !important;
        }
        .footer-link:hover {
          color: rgba(212,168,67,0.6) !important;
          transform: translateX(3px);
        }

        /* Form row — default 2 columns */
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* ── Mobile: up to 640px ── */
        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr !important;
          }
          .grid-services,
          .grid-stats,
          .grid-process,
          .grid-pricing,
          .grid-testimonials,
          .grid-portfolio,
          .grid-realizacie {
            grid-template-columns: 1fr !important;
          }
          .grid-benefits {
            grid-template-columns: 1fr !important;
          }
          .grid-footer {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }

        /* ── Tablet: 641px to 900px ── */
        @media (min-width: 641px) and (max-width: 900px) {
          .grid-services,
          .grid-process {
            grid-template-columns: 1fr 1fr !important;
          }
          .grid-pricing {
            grid-template-columns: 1fr !important;
            max-width: 400px;
            margin: 0 auto;
          }
          .grid-benefits {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .grid-portfolio {
            grid-template-columns: 1fr 1fr !important;
          }
          .grid-realizacie {
            grid-template-columns: 1fr 1fr !important;
          }
          .grid-footer {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        /* Gradient border animation for pricing popular card */
        @keyframes borderRotate {
          0% { --angle: 0deg; }
          100% { --angle: 360deg; }
        }

        /* Section label tracking animation */
        @keyframes trackIn {
          from { letter-spacing: 0.4em; opacity: 0; }
          to { letter-spacing: 0.2em; opacity: 1; }
        }

        /* Subtle breathing for the hero glow */
        @keyframes breathe {
          0%, 100% { opacity: 0.07; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.1; transform: translate(-50%, -50%) scale(1.05); }
        }

        /* Smooth link underline animation */
        .animated-link {
          position: relative;
        }
        .animated-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: #d4a843;
          transition: width 0.3s ease;
        }
        .animated-link:hover::after {
          width: 100%;
        }

        /* Reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .particle { display: none !important; }
          .hero-cta { animation: none !important; }
          * { animation-duration: 0.01s !important; transition-duration: 0.01s !important; }
        }
      `}</style>
    </main>
  );
}
