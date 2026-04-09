import { NextRequest, NextResponse } from 'next/server';

// ─── Supabase CRM sync via SECURITY DEFINER RPC ────────────────────
// Uses the anon/publishable key to call submit_contact_lead() which
// is a SECURITY DEFINER function that handles upsert + status tagging
// server-side in Postgres, so RLS and key format don't block us.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const OWNER_USER_ID = (process.env.OWNER_USER_ID || '').trim();
const DEFAULT_ORGANIZATION_ID = (process.env.DEFAULT_ORGANIZATION_ID || '').trim();

type CrmResult = {
  id: string | null;
  isNew: boolean;
  priority: 'hot' | 'warm' | 'cold' | null;
  score: number | null;
  error: string | null;
};

async function upsertLeadToCrm(lead: {
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
  source: string;
}): Promise<CrmResult> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !OWNER_USER_ID || !DEFAULT_ORGANIZATION_ID) {
    return { id: null, isNew: false, priority: null, score: null, error: 'CRM not configured' };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_contact_lead`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_name: lead.name || '',
        p_company: lead.company || '',
        p_email: lead.email,
        p_phone: lead.phone || '',
        p_notes: lead.notes || '',
        p_source: lead.source || 'contact',
        p_owner_id: OWNER_USER_ID,
        p_org_id: DEFAULT_ORGANIZATION_ID,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[CRM] RPC failed', res.status, err);
      return { id: null, isNew: false, priority: null, score: null, error: `RPC failed (${res.status}): ${err}` };
    }
    const data = (await res.json()) as { id?: string; is_new?: boolean; priority?: string; score?: number };
    const priorityTag = data?.priority || null;
    const priority = priorityTag === 'prio:hot' ? 'hot' : priorityTag === 'prio:warm' ? 'warm' : priorityTag === 'prio:cold' ? 'cold' : null;
    return {
      id: data?.id || null,
      isNew: !!data?.is_new,
      priority,
      score: typeof data?.score === 'number' ? data.score : null,
      error: null,
    };
  } catch (err) {
    console.error('[CRM] RPC exception', err);
    return { id: null, isNew: false, priority: null, score: null, error: err instanceof Error ? err.message : 'CRM error' };
  }
}

// ─── Auto-responder: confirmation email to the client ───────────────
async function sendClientConfirmation(lead: {
  name: string;
  company: string;
  email: string;
  source: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const displayName = lead.name || lead.company || 'tam';
  const greeting = lead.name ? `Dobrý deň, ${escapeHtml(lead.name)},` : 'Dobrý deň,';
  const fromName = 'Richard Vass — Vassweb';
  const subject = 'Ďakujeme za Vašu správu — ozveme sa do 24 hodín';

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f0e0d;color:#e8e0d0;border-radius:14px;overflow:hidden;border:1px solid rgba(212,168,67,0.2)">
      <div style="background:linear-gradient(135deg,#ffeebb,#d4a843,#8a6a1e);padding:28px 32px;text-align:center">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.15em;color:rgba(10,9,8,0.55);text-transform:uppercase;margin-bottom:8px">Vassweb</div>
        <h1 style="color:#0a0908;margin:0;font-size:26px;font-weight:700;font-family:Georgia,serif">Ďakujeme za Váš záujem</h1>
      </div>
      <div style="padding:32px;line-height:1.7">
        <p style="color:#e8e0d0;font-size:15px;margin:0 0 18px">${greeting}</p>
        <p style="color:rgba(232,224,208,0.85);font-size:15px;margin:0 0 18px">
          vašu správu sme úspešne prijali a veľmi si vážime, že ste si vybrali práve Vassweb.
          Ozvem sa Vám <strong style="color:#ffeebb">osobne do 24 hodín</strong> s konkrétnym
          návrhom riešenia a cenovou ponukou.
        </p>
        <div style="background:rgba(212,168,67,0.08);border-left:3px solid #d4a843;padding:16px 20px;margin:24px 0;border-radius:0 10px 10px 0">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;color:#d4a843;text-transform:uppercase;margin-bottom:8px">Čo sa teraz stane</div>
          <ol style="color:rgba(232,224,208,0.75);font-size:13.5px;margin:0;padding-left:20px;line-height:1.8">
            <li>Pozriem sa na Váš dopyt a pripravím návrh riešenia</li>
            <li>Do 24 hodín Vám pošlem cenovú ponuku na mieru</li>
            <li>Ak súhlasíte, dohodneme si krátku bezplatnú konzultáciu (15 min)</li>
            <li>Po schválení štartujeme — prvé výsledky do 7 dní</li>
          </ol>
        </div>
        <p style="color:rgba(232,224,208,0.7);font-size:13.5px;margin:18px 0 8px">
          Medzičasom si môžete pozrieť ukážky našej práce:
        </p>
        <div style="margin:10px 0 24px">
          <a href="https://vassweb.sk/#portfolio" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#ffeebb,#d4a843);color:#0a0908;border-radius:999px;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:0.05em">Portfólio →</a>
        </div>
        <div style="border-top:1px solid rgba(212,168,67,0.12);padding-top:20px;margin-top:20px">
          <p style="color:rgba(232,224,208,0.6);font-size:13px;margin:0 0 4px">S pozdravom,</p>
          <p style="color:#ffeebb;font-size:15px;font-weight:600;margin:0 0 4px">Richard Vass</p>
          <p style="color:rgba(232,224,208,0.45);font-size:12px;margin:0">Vassweb — VVD s.r.o.</p>
        </div>
      </div>
      <div style="background:rgba(0,0,0,0.25);padding:18px 32px;border-top:1px solid rgba(212,168,67,0.1);font-size:11px;color:rgba(232,224,208,0.35);text-align:center;line-height:1.6">
        <div>VVD s.r.o. · Blatná na Ostrove 281, 930 32 · IČO: 56921021</div>
        <div style="margin-top:4px"><a href="mailto:info@vassweb.sk" style="color:rgba(212,168,67,0.55);text-decoration:none">info@vassweb.sk</a> · <a href="tel:+421918668728" style="color:rgba(212,168,67,0.55);text-decoration:none">+421 918 668 728</a></div>
        <div style="margin-top:8px;font-size:10px;color:rgba(232,224,208,0.25)">
          Tento email ste dostali, pretože ste nás kontaktovali cez formulár na vassweb.sk (${escapeHtml(lead.source || 'kontakt')}).
        </div>
      </div>
    </div>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <info@vassweb.sk>`,
        to: [lead.email],
        reply_to: 'info@vassweb.sk',
        subject,
        html,
      }),
    });
    if (!res.ok) {
      console.warn('[auto-reply] send failed', res.status, await res.text().catch(() => ''));
    }
  } catch (err) {
    console.warn('[auto-reply] exception', err);
  }
  void displayName; // used via escapeHtml above
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
    }).catch((err): CrmResult => {
      console.error('CRM sync failed:', err);
      return { id: null, isNew: false, priority: null, score: null, error: 'sync failed' };
    });

    // Send auto-responder confirmation to the client (fire-and-forget, non-blocking)
    const confirmPromise = sendClientConfirmation({
      name: name || '',
      company: company || '',
      email,
      source: source || 'contact',
    }).catch((err) => {
      console.warn('[auto-reply] failed:', err);
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
        await confirmPromise;
        return NextResponse.json({
          success: true,
          crm: { synced: !!crm.id, isNew: crm.isNew, priority: crm.priority, score: crm.score },
        });
      }

      const fallbackError = await fallbackResponse.json().catch(() => ({}));
      console.error('Resend fallback error:', JSON.stringify(fallbackError));
      return NextResponse.json(
        { error: 'Nepodarilo sa odoslať správu. Skúste to znova alebo nás kontaktujte na info@vassweb.sk.' },
        { status: 500 }
      );
    }

    const crm = await crmPromise;
    await confirmPromise;
    if (crm.error) console.error('CRM sync error:', crm.error);
    return NextResponse.json({
      success: true,
      crm: { synced: !!crm.id, isNew: crm.isNew, priority: crm.priority, score: crm.score },
    });
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
