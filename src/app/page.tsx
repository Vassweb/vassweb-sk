'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Globe, Bot, Zap, Smartphone, ArrowDown, CheckCircle,
  Shield, MonitorSmartphone, Search, Wrench, BarChart3, Send, Phone, Mail,
  ChevronUp, ChevronDown, Quote, Star, ExternalLink,
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
        borderColor: hovered ? 'rgba(212,168,67,0.35)' : 'rgba(212,168,67,0.12)',
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

/* ═══ PRICING CARD WITH SELECTION ═══ */
function PricingCard({ plan, isSelected, onSelect, tPricing }: {
  plan: { name: string; price: string; featured: boolean; features: string[] };
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

      <h3 style={{ fontFamily: heading, fontWeight: 500, fontSize: 22, color: '#fff', marginBottom: 6 }}>{plan.name}</h3>
      <div style={{ marginBottom: 28 }}>
        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, fontFamily: body }}>{tPricing.from} </span>
        <span className={isHighlighted ? 'gold-shimmer' : ''} style={{
          fontFamily: body, fontWeight: 300, fontSize: 'clamp(32px, 3.5vw, 40px)',
          fontVariantNumeric: 'lining-nums' as const,
          ...goldGradient,
        }}>€{plan.price}</span>
      </div>

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
            {f}
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
          color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.8,
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
        color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.8,
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
          <div style={{ fontFamily: body, fontWeight: 400, fontSize: 11, color: 'rgba(212,168,67,0.5)' }}>{role}</div>
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
    <main style={{
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
              fontSize: 16, color: 'rgba(255,255,255,0.45)', fontFamily: body, fontWeight: 300,
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
              <a href="#sluzby" className="outline-btn" style={{
                display: 'inline-block', padding: '14px 36px',
                border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)',
                borderRadius: 999, fontWeight: 500, fontSize: 14,
                textDecoration: 'none', backgroundColor: 'transparent', fontFamily: body,
                transition: 'all 0.2s',
              }}>{tr.hero.ctaSecondary}</a>
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
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.7, fontFamily: body }}>{s.desc}</p>
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
                  <div style={{ color: 'rgba(212,168,67,0.5)', fontSize: 11, fontWeight: 600, fontFamily: body, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>{item.lbl}</div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: body }}>{item.desc}</p>
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
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.8, fontFamily: body, fontWeight: 300, fontStyle: 'italic' }}>
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
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.6, fontFamily: body }}>{item.desc}</p>
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
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, lineHeight: 1.6, fontFamily: body }}>{item.desc}</p>
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
            <p style={{ textAlign: 'center', marginTop: 24, color: 'rgba(255,255,255,0.2)', fontSize: 12, fontFamily: body }}>
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

      {/* ══ PORTFOLIO ══ */}
      <section id="portfolio" style={section}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={label}>{tr.portfolio.label}</p>
              <h2 style={h2Style}>{tr.portfolio.heading}</h2>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 15, fontFamily: body, maxWidth: 500, margin: '12px auto 0' }}>{tr.portfolio.subtext}</p>
              <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, #d4a843, transparent)', margin: '20px auto 0' }} />
            </div>
          </FadeIn>

          <div className="grid-portfolio" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {tr.portfolio.items.map((item, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div style={{
                  ...card,
                  padding: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, border-color 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(212,168,67,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(212,168,67,0.12)'; }}
                >
                  {/* Placeholder image area */}
                  <div style={{
                    height: 200,
                    background: `linear-gradient(135deg, rgba(212,168,67,${0.04 + i * 0.02}), rgba(10,9,8,0.95))`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `radial-gradient(circle at ${30 + i * 20}% 40%, rgba(212,168,67,0.08), transparent 60%)`,
                    }} />
                    <span style={{
                      fontFamily: heading,
                      fontSize: 'clamp(36px, 4vw, 48px)',
                      fontWeight: 400,
                      background: 'linear-gradient(135deg, rgba(255,238,187,0.15), rgba(212,168,67,0.15))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      position: 'relative',
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '24px 24px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, fontFamily: body, letterSpacing: '0.15em',
                      textTransform: 'uppercase', color: '#d4a843', marginBottom: 10,
                    }}>
                      {item.category}
                    </span>
                    <h3 style={{
                      fontFamily: heading, fontSize: 20, fontWeight: 500, color: '#fff', marginBottom: 10,
                    }}>
                      {item.title}
                    </h3>
                    <p style={{
                      fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: body, lineHeight: 1.7, marginBottom: 16, flex: 1,
                    }}>
                      {item.desc}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: item.href ? 16 : 0 }}>
                      {item.tags.map(tag => (
                        <span key={tag} style={{
                          fontSize: 10, fontFamily: body, fontWeight: 500,
                          padding: '4px 10px', borderRadius: 999,
                          border: '1px solid rgba(212,168,67,0.12)',
                          color: 'rgba(212,168,67,0.5)',
                          letterSpacing: '0.05em',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    {item.href && (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '10px 20px', borderRadius: 8,
                        background: 'linear-gradient(135deg, rgba(212,168,67,0.12), rgba(212,168,67,0.04))',
                        border: '1px solid rgba(212,168,67,0.2)',
                        color: '#d4a843', fontSize: 13, fontWeight: 500, fontFamily: body,
                        textDecoration: 'none', transition: 'all 0.3s ease',
                        letterSpacing: '0.03em',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212,168,67,0.2), rgba(212,168,67,0.08))'; e.currentTarget.style.borderColor = 'rgba(212,168,67,0.4)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212,168,67,0.12), rgba(212,168,67,0.04))'; e.currentTarget.style.borderColor = 'rgba(212,168,67,0.2)'; }}
                      >
                        <ExternalLink size={14} />
                        {tr.portfolio.viewDemo}
                      </a>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
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
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, fontFamily: body, fontWeight: 300, maxWidth: 440, margin: '0 auto 40px' }}>
              {tr.contact.subtext}
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <ContactForm t={tr.contact} />
          </FadeIn>

          <FadeIn delay={0.3}>
            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 30, height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.2), transparent)', marginBottom: 4 }} />
              <p style={{ fontSize: 11, fontFamily: body, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>
                {locale === 'en' ? 'Or reach us directly' : locale === 'cs' ? 'Nebo nás kontaktujte přímo' : locale === 'hu' ? 'Vagy keressen minket közvetlenül' : 'Alebo nás kontaktujte priamo'}
              </p>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href="tel:+421918668728" className="animated-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(212,168,67,0.5)', fontSize: 13, textDecoration: 'none', fontFamily: body, transition: 'color 0.3s' }}>
                  <Phone size={14} /> +421 918 668 728
                </a>
                <a href="mailto:info@vassweb.sk" className="animated-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(212,168,67,0.5)', fontSize: 13, textDecoration: 'none', fontFamily: body, transition: 'color 0.3s' }}>
                  <Mail size={14} /> info@vassweb.sk
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
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, fontFamily: body, lineHeight: 1.8, maxWidth: 400, margin: '0 auto' }}>
                {tr.footer.tagline}
              </p>
            </div>
          </FadeIn>

          {/* Middle section — 3 columns: nav, contact, legal */}
          <div className="grid-footer" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, marginBottom: 48 }}>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'rgba(212,168,67,0.4)', fontWeight: 600, fontSize: 10, fontFamily: body, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>{tr.footer.navHeading}</h4>
              {tr.footer.navLinks.map(l => (
                <a key={l.href} href={l.href} className="footer-link" style={{ display: 'block', color: 'rgba(255,255,255,0.25)', fontSize: 13, textDecoration: 'none', marginBottom: 10, fontFamily: body, transition: 'color 0.3s' }}>{l.label}</a>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'rgba(212,168,67,0.4)', fontWeight: 600, fontSize: 10, fontFamily: body, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>{tr.footer.contactHeading}</h4>
              <a href="tel:+421918668728" className="footer-link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'rgba(255,255,255,0.25)', fontSize: 13, textDecoration: 'none', marginBottom: 10, fontFamily: body, transition: 'color 0.3s' }}>
                <Phone size={13} color="rgba(212,168,67,0.3)" /> +421 918 668 728
              </a>
              <a href="mailto:info@vassweb.sk" className="footer-link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'rgba(255,255,255,0.25)', fontSize: 13, textDecoration: 'none', marginBottom: 10, fontFamily: body, transition: 'color 0.3s' }}>
                <Mail size={13} color="rgba(212,168,67,0.3)" /> info@vassweb.sk
              </a>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'rgba(212,168,67,0.4)', fontWeight: 600, fontSize: 10, fontFamily: body, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>{tr.footer.legalHeading}</h4>
              <a href={locale === 'en' ? '/en/privacy-policy' : locale === 'cs' ? '/cs/ochrana-udaju' : locale === 'hu' ? '/hu/adatvedelmi-iranyelvek' : '/ochrana-udajov'} className="footer-link" style={{ display: 'block', color: 'rgba(255,255,255,0.25)', fontSize: 13, textDecoration: 'none', marginBottom: 10, fontFamily: body, transition: 'color 0.3s' }}>{tr.footer.privacy}</a>
              <a href={locale === 'en' ? '/en/terms-and-conditions' : locale === 'cs' ? '/cs/obchodni-podminky' : locale === 'hu' ? '/hu/altalanos-szerzodesi-feltetelek' : '/obchodne-podmienky'} className="footer-link" style={{ display: 'block', color: 'rgba(255,255,255,0.25)', fontSize: 13, textDecoration: 'none', marginBottom: 10, fontFamily: body, transition: 'color 0.3s' }}>{tr.footer.terms}</a>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11, fontFamily: body }}>
              {tr.footer.copyright}
            </p>
            <p style={{ color: 'rgba(212,168,67,0.15)', fontSize: 9, fontFamily: body, letterSpacing: '0.2em', textTransform: 'uppercase' as const }}>
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
          .grid-portfolio {
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
