import { NextRequest, NextResponse } from 'next/server';

// ─── Supabase CRM sync ────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const OWNER_USER_ID = process.env.OWNER_USER_ID || '';
const DEFAULT_ORGANIZATION_ID = process.env.DEFAULT_ORGANIZATION_ID || '';

async function upsertLeadToCrm(lead: {
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
  source: string;
}): Promise<{ id: string | null; isNew: boolean; error: string | null }> {
  console.log('[CRM] env check:', {
    url: SUPABASE_URL ? `${SUPABASE_URL.slice(0, 30)}...` : 'MISSING',
    key: SUPABASE_SERVICE_ROLE_KEY ? `${SUPABASE_SERVICE_ROLE_KEY.slice(0, 10)}...` : 'MISSING',
    user: OWNER_USER_ID ? `${OWNER_USER_ID.slice(0, 8)}...` : 'MISSING',
    org: DEFAULT_ORGANIZATION_ID ? `${DEFAULT_ORGANIZATION_ID.slice(0, 8)}...` : 'MISSING',
  });

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OWNER_USER_ID || !DEFAULT_ORGANIZATION_ID) {
    return { id: null, isNew: false, error: 'CRM not configured' };
  }

  const headers = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    'Accept-Profile': 'public',
    'Content-Profile': 'public',
  };

  try {
    // 1) Check if a client with this email already exists in our org
    const lookupRes = await fetch(
      `${SUPABASE_URL}/rest/v1/clients?select=id,tags,notes&email=eq.${encodeURIComponent(lead.email)}&organization_id=eq.${DEFAULT_ORGANIZATION_ID}`,
      { headers }
    );

    if (lookupRes.ok) {
      const existing = (await lookupRes.json()) as Array<{ id: string; tags: string[] | null; notes: string | null }>;
      if (existing.length > 0) {
        // Update existing: append new inquiry to notes, set status to "zaujem" (interested) if still prospect
        const row = existing[0];
        const prevTags = Array.isArray(row.tags) ? row.tags : [];
        const statusTags = ['prospect', 'osloveny', 'caka', 'zaujem', 'nezaujem', 'klient'];
        const hadStatus = prevTags.find((t) => statusTags.includes(t));
        const newStatus = hadStatus === 'klient' ? 'klient' : 'zaujem';
        const cleanedTags = prevTags.filter((t) => !statusTags.includes(t));
        const nextTags = Array.from(
          new Set([...cleanedTags, newStatus, `src:${lead.source || 'contact'}`])
        );
        const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
        const appendedNotes = [
          row.notes || '',
          '',
          `── Nový dopyt ${timestamp} (${lead.source || 'contact'}) ──`,
          lead.notes,
        ]
          .filter(Boolean)
          .join('\n');

        const patchRes = await fetch(
          `${SUPABASE_URL}/rest/v1/clients?id=eq.${row.id}`,
          {
            method: 'PATCH',
            headers: { ...headers, Prefer: 'return=representation' },
            body: JSON.stringify({
              tags: nextTags,
              notes: appendedNotes,
              ...(lead.phone ? { phone: lead.phone } : {}),
              ...(lead.name ? { name: lead.name } : {}),
              ...(lead.company ? { company: lead.company } : {}),
            }),
          }
        );
        if (!patchRes.ok) {
          const err = await patchRes.text();
          return { id: row.id, isNew: false, error: `Update failed: ${err}` };
        }
        return { id: row.id, isNew: false, error: null };
      }
    }

    // 2) Insert new client
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/clients`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=representation' },
      body: JSON.stringify({
        user_id: OWNER_USER_ID,
        organization_id: DEFAULT_ORGANIZATION_ID,
        name: lead.name || lead.company || '',
        company: lead.company || '',
        email: lead.email,
        phone: lead.phone || '',
        notes: lead.notes || '',
        tags: ['zaujem', `src:${lead.source || 'contact'}`],
      }),
    });

    if (!insertRes.ok) {
      const err = await insertRes.text();
      console.error('[CRM] Insert failed', insertRes.status, err);
      return { id: null, isNew: false, error: `Insert failed (${insertRes.status}): ${err}` };
    }
    const created = (await insertRes.json()) as Array<{ id: string }>;
    return { id: created[0]?.id || null, isNew: true, error: null };
  } catch (err) {
    return { id: null, isNew: false, error: err instanceof Error ? err.message : 'CRM error' };
  }
}

// Rate limiting: simple in-memory store (resets on cold start, which is fine for Vercel)
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3; // max 3 submissions
const RATE_WINDOW = 60 * 1000; // per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Príliš veľa požiadaviek. Skúste to znova neskôr.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, message, company, phone, source } = body;

    // Validation
    if (!email || !message) {
      return NextResponse.json(
        { error: 'Chýbajú povinné polia.' },
        { status: 400 }
      );
    }
    if (!name && !company) {
      return NextResponse.json(
        { error: 'Zadajte meno alebo názov firmy.' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Neplatná e-mailová adresa.' },
        { status: 400 }
      );
    }

    // Honeypot check (if present in body, it's a bot)
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json(
        { error: 'Služba dočasne nedostupná. Kontaktujte nás na info@vassweb.sk.' },
        { status: 500 }
      );
    }

    const isKonfigurator = source === 'konfigurator';
    const displayName = company ? escapeHtml(company) : escapeHtml(name || '');
    const subjectPrefix = isKonfigurator ? '🛠 Konfigurátor' : '📩 Kontakt';

    // Parse konfigurator message into sections for rich display
    function buildEmailHtml(): string {
      const rows: string[] = [];
      if (company) rows.push(`<tr><td style="padding:8px 0;color:#d4a843;font-weight:600;width:110px;vertical-align:top">Firma:</td><td style="padding:8px 0;color:#fff">${escapeHtml(company)}</td></tr>`);
      if (name) rows.push(`<tr><td style="padding:8px 0;color:#d4a843;font-weight:600;vertical-align:top">Kontakt:</td><td style="padding:8px 0;color:#fff">${escapeHtml(name)}</td></tr>`);
      rows.push(`<tr><td style="padding:8px 0;color:#d4a843;font-weight:600;vertical-align:top">E-mail:</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(email)}" style="color:#ffeebb">${escapeHtml(email)}</a></td></tr>`);
      if (phone) rows.push(`<tr><td style="padding:8px 0;color:#d4a843;font-weight:600;vertical-align:top">Telefón:</td><td style="padding:8px 0;color:#fff"><a href="tel:${escapeHtml(phone)}" style="color:#ffeebb">${escapeHtml(phone)}</a></td></tr>`);

      let bodyHtml = '';
      if (isKonfigurator && message) {
        // Parse the structured konfigurator message
        const lines = message.split('\n');
        const sections: { title: string; lines: string[] }[] = [];
        let current: { title: string; lines: string[] } | null = null;
        for (const line of lines) {
          if (line.startsWith('── ') && line.endsWith(' ──')) {
            if (current) sections.push(current);
            current = { title: line.replace(/^── /, '').replace(/ ──$/, ''), lines: [] };
          } else if (line.trim()) {
            if (current) current.lines.push(line);
            else if (line !== 'KONFIGURÁTOR WEBU') {
              if (!sections.length) sections.push({ title: '', lines: [] });
              sections[sections.length - 1].lines.push(line);
            }
          }
        }
        if (current) sections.push(current);

        for (const section of sections) {
          if (!section.title && !section.lines.length) continue;
          if (section.title) {
            bodyHtml += `<div style="margin:20px 0 8px;padding:8px 12px;background:rgba(212,168,67,0.1);border-left:3px solid #d4a843;border-radius:0 6px 6px 0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#d4a843">${escapeHtml(section.title)}</div>`;
          }
          for (const l of section.lines) {
            const [key, ...rest] = l.split(':');
            const val = rest.join(':').trim();
            if (val) {
              const isTotal = key.includes('CELKOM') || key.includes('ODHAD');
              bodyHtml += `<div style="display:flex;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05)"><span style="color:rgba(255,255,255,0.45);min-width:150px;font-size:13px">${escapeHtml(key.trim())}:</span><span style="color:${isTotal ? '#ffeebb' : '#fff'};font-size:13px;font-weight:${isTotal ? '700' : '400'}">${escapeHtml(val)}</span></div>`;
            } else {
              bodyHtml += `<div style="padding:6px 0;color:rgba(255,255,255,0.6);font-size:13px">${escapeHtml(l)}</div>`;
            }
          }
        }
      } else if (message) {
        bodyHtml = `<div style="color:rgba(255,255,255,0.8);line-height:1.7;white-space:pre-wrap;font-size:14px">${escapeHtml(message)}</div>`;
      }

      const badge = isKonfigurator
        ? `<span style="display:inline-block;padding:3px 10px;background:rgba(212,168,67,0.15);border:1px solid rgba(212,168,67,0.3);border-radius:999px;font-size:11px;color:#d4a843;font-weight:600;letter-spacing:0.06em;margin-bottom:4px">Z KONFIGURÁTORA</span>`
        : '';

      return `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f0e0d;border-radius:14px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#ffeebb,#d4a843);padding:22px 28px">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:rgba(10,9,8,0.5);text-transform:uppercase;margin-bottom:4px">Vassweb.sk</div>
            <h1 style="color:#0a0908;margin:0;font-size:22px;font-weight:700">Nový dopyt — ${displayName}</h1>
          </div>
          <div style="padding:24px 28px">
            ${badge}
            <table style="width:100%;border-collapse:collapse;margin-top:8px">${rows.join('')}</table>
            ${bodyHtml ? `<div style="margin-top:4px">${bodyHtml}</div>` : ''}
          </div>
          <div style="padding:14px 28px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:11px;color:rgba(255,255,255,0.2)">
            Odoslané z vassweb.sk · <a href="mailto:${escapeHtml(email)}" style="color:rgba(212,168,67,0.4)">Odpovedať priamo</a>
          </div>
        </div>`;
    }

    // Sync lead to Supabase CRM (parallel with email — non-blocking on failure)
    const crmPromise = upsertLeadToCrm({
      name: name || '',
      company: company || '',
      email,
      phone: phone || '',
      notes: message || '',
      source: source || 'contact',
    }).catch((err) => {
      console.error('CRM sync failed:', err);
      return { id: null, isNew: false, error: 'sync failed' };
    });

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vassweb Formulár <formular@vassweb.sk>',
        to: ['info@vassweb.sk'],
        reply_to: email,
        subject: `${subjectPrefix}: ${displayName}`,
        html: buildEmailHtml(),
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json().catch(() => ({}));
      console.error('Resend error:', JSON.stringify(errorData));

      // Try fallback with Resend default sender
      const fallbackResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Vassweb <onboarding@resend.dev>',
          to: ['richard.vass@vassco.sk'],
          reply_to: email,
          subject: `${subjectPrefix}: ${displayName}`,
          html: buildEmailHtml(),
        }),
      });

      if (fallbackResponse.ok) {
        const crm = await crmPromise;
        return NextResponse.json({ success: true, crm: { synced: !!crm.id, isNew: crm.isNew } });
      }

      const fallbackError = await fallbackResponse.json().catch(() => ({}));
      console.error('Resend fallback error:', JSON.stringify(fallbackError));
      return NextResponse.json(
        { error: 'Nepodarilo sa odoslať správu. Skúste to znova alebo nás kontaktujte na info@vassweb.sk.' },
        { status: 500 }
      );
    }

    const crm = await crmPromise;
    if (crm.error) console.error('CRM sync error:', crm.error);
    return NextResponse.json({ success: true, crm: { synced: !!crm.id, isNew: crm.isNew } });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Nastala chyba. Skúste to znova neskôr.' },
      { status: 500 }
    );
  }
}

// Prevent XSS in email HTML
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
