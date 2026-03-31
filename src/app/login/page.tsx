'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/supabase';

const ALLOWED_EMAIL = process.env.NEXT_PUBLIC_ALLOWED_EMAIL || '';

function setAuthCookie(token: string) {
  document.cookie = `sb-access-token=${token}; path=/; max-age=604800; SameSite=Lax`;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle email confirmation callback (tokens in URL hash)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      if (accessToken) {
        setAuthCookie(accessToken);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('vw-access-token', accessToken);
          if (refreshToken) localStorage.setItem('vw-refresh-token', refreshToken);
          localStorage.setItem('vw-user-email', ALLOWED_EMAIL);
        }
        window.location.href = '/';
        return;
      }
    }
    // If already has cookie, go to dashboard
    if (document.cookie.includes('sb-access-token')) {
      window.location.href = '/';
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Vyplňte email a heslo.');
      return;
    }

    if (isSignUp && email.toLowerCase() !== ALLOWED_EMAIL.toLowerCase()) {
      setError('Registrácia nie je povolená pre tento email.');
      return;
    }

    if (password.length < 6) {
      setError('Heslo musí mať minimálne 6 znakov.');
      return;
    }

    setLoading(true);
    try {
      const result = isSignUp
        ? await auth.signUp(email, password, 'https://app.vassweb.sk/login')
        : await auth.signIn(email, password);

      if (result.error) {
        if (result.error.includes('Email not confirmed')) {
          setError('Email ešte nie je overený. Skontrolujte schránku (aj spam).');
        } else if (result.error.includes('Invalid login credentials')) {
          setError('Nesprávny email alebo heslo.');
        } else {
          setError(result.error);
        }
      } else if (result.data?.access_token) {
        setAuthCookie(result.data.access_token);
        localStorage.setItem('vw-access-token', result.data.access_token);
        localStorage.setItem('vw-refresh-token', result.data.refresh_token);
        localStorage.setItem('vw-user-email', email);
        window.location.href = '/';
      } else if (isSignUp) {
        setIsSignUp(false);
        setEmail('');
        setPassword('');
        alert('Registrácia úspešná! Skontrolujte email pre overovací link.');
      }
    } catch {
      setError('Nepodarilo sa pripojiť k serveru.');
    }
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', background: '#0a0908',
    border: '1px solid rgba(212,168,67,0.15)', borderRadius: 10,
    color: '#fff', fontSize: 14, fontFamily: 'Inter, system-ui, sans-serif', outline: 'none',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0908', fontFamily: 'Inter, system-ui, sans-serif', color: '#fff', padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #ffeebb, #d4a843, #8a6a1e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, color: '#0a0908',
            boxShadow: '0 8px 32px rgba(212,168,67,0.2)',
          }}>V&Co</div>
          <h1 style={{ fontSize: 28, fontWeight: 300, marginBottom: 4 }}>
            Vassweb <span style={{ color: '#d4a843', fontWeight: 600 }}>App</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Interný business management systém</p>
        </div>

        {/* Form Card */}
        <div style={{
          background: '#111110', border: '1px solid rgba(212,168,67,0.1)', borderRadius: 16,
          padding: 28, boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#d4a843', marginBottom: 4, textAlign: 'center' }}>
            {isSignUp ? 'Registrácia' : 'Prihlásenie'}
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24, textAlign: 'center' }}>
            {isSignUp ? 'Vytvorte si nový účet' : 'Prihláste sa do systému'}
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', marginBottom: 6, letterSpacing: '0.05em' }}>E-MAIL</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vas@email.sk" autoComplete="email" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', marginBottom: 6, letterSpacing: '0.05em' }}>HESLO</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete={isSignUp ? 'new-password' : 'current-password'} style={inputStyle} />
            </div>

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(248,113,113,0.1)', color: '#f87171', fontSize: 13, marginBottom: 16 }}>{error}</div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px 20px', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 14, fontWeight: 600, fontFamily: 'Inter, system-ui, sans-serif',
              background: 'linear-gradient(135deg, #ffeebb, #d4a843, #8a6a1e)', color: '#0a0908', border: 'none',
              opacity: loading ? 0.5 : 1,
            }}>
              {loading ? 'Načítavam...' : isSignUp ? 'Registrovať sa' : 'Prihlásiť sa'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              style={{ background: 'none', border: 'none', color: '#d4a843', cursor: 'pointer', fontSize: 13, fontFamily: 'Inter, system-ui, sans-serif' }}>
              {isSignUp ? 'Už mám účet — prihlásiť sa' : 'Nemám účet — registrovať sa'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
          © 2026 Vass & Co. s.r.o.
        </p>
      </div>
    </div>
  );
}
