/* ═══════════════════════════════════════════════════════════════
   VASSWEB — Leads API (replaces Firebase BizHub Cloud Functions)
   GET    /api/leads         — List leads
   POST   /api/leads         — Create lead + AI analysis + email
   PATCH  /api/leads         — Update lead
   DELETE /api/leads         — Delete lead
   ═══════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

// ─── Vassco Pricing Database ──────────────────────────────
const PRICING: Record<string, { base: string; items: Record<string, string>; note: string }> = {
  'Tepovanie čalúnenia': {
    base: 'od 15€',
    items: {
      'Gauč (3-sedačka)': '35-50€', 'Gauč (rohový/veľký)': '50-80€',
      'Kreslo': '15-25€', 'Stolička (čalúnená)': '8-12€',
      'Matrac (jednolôžko)': '25-35€', 'Matrac (dvojlôžko)': '35-50€',
      'Koberec (m²)': '3-5€/m²', 'Autosedačka': '12-18€',
    },
    note: 'Ceny závisia od znečistenia a veľkosti. Obhliadka zdarma.',
  },
  'Tepovanie automobilov': {
    base: 'od 60€',
    items: {
      'Interiér komplet (osobné auto)': '80-120€', 'Interiér komplet (SUV/Van)': '120-180€',
      'Len sedačky': '60-90€', 'Detailing interiér + exteriér': '150-250€',
      'Kožený interiér (čistenie + ošetrenie)': '100-150€',
    },
    note: 'Cena závisí od veľkosti auta a stupňa znečistenia.',
  },
  'B2B Facility Management': {
    base: 'individuálne',
    items: {
      'Kancelária do 100m²': '150-300€/mesiac', 'Kancelária 100-300m²': '300-600€/mesiac',
      'Kancelária 300-500m²': '600-1000€/mesiac', 'Výrobný priestor': 'individuálne',
      'Jednorazové čistenie': 'od 3€/m²',
    },
    note: 'SLA zmluva s garantovaným časom odozvy.',
  },
  'Čistenie Airbnb': {
    base: 'od 40€',
    items: {
      '1-izbový byt': '40-60€', '2-izbový byt': '55-80€',
      '3-izbový byt': '75-110€', 'Dom/väčší priestor': '100-180€',
      'Pranie posteľnej bielizne': '+15€',
    },
    note: 'Turnover cleaning medzi hosťami.',
  },
  'Správa bytových domov': {
    base: 'individuálne',
    items: {
      'Spoločné priestory (1x/týždeň)': 'od 100€/mesiac',
      'Spoločné priestory (2x/týždeň)': 'od 180€/mesiac',
      'Jednorazové hĺbkové čistenie': 'od 200€',
    },
    note: 'Cena závisí od veľkosti domu a počtu poschodí.',
  },
};

// ─── Supabase helper ──────────────────────────────────────
async function supaFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': options.method === 'POST' ? 'return=representation' : 'return=minimal',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase error: ${res.status} ${err}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ─── AI Lead Analysis ─────────────────────────────────────
async function analyzeLeadWithAI(lead: Record<string, string>) {
  if (!ANTHROPIC_API_KEY) return null;

  const pricing = PRICING[lead.sluzba || lead.service || ''] || { base: 'individuálne', items: {}, note: '' };
  const pricingInfo = `Cenník pre "${lead.sluzba || lead.service}":\nZákladná cena: ${pricing.base}\n` +
    Object.entries(pricing.items).map(([k, v]) => `- ${k}: ${v}`).join('\n') +
    `\nPoznámka: ${pricing.note}`;

  const prompt = `Si AI asistent spoločnosti Vass & Co. — profesionálna čistiaca a facility management firma v Bratislave.

Prišiel nový lead. Analyzuj ho a priprav:
1. KATEGORIZÁCIU (priorita: vysoká/stredná/nízka)
2. ODHADOVANÚ CENU na základe cenníka
3. NAVRHOVANÚ ODPOVEĎ pre klienta (po slovensky, profesionálne)
4. POZNÁMKY pre Richarda (majiteľ firmy)

LEAD ÚDAJE:
- Meno: ${lead.name || lead.meno}
- Kontakt: ${lead.email || lead.kontakt || lead.phone}
- Firma: ${lead.company || ''}
- Služba: ${lead.sluzba || lead.service || ''}
- Správa: ${lead.notes || lead.dalsi || ''}

CENNÍK:
${pricingInfo}

Odpovedz v JSON formáte (bez markdown):
{
  "priorita": "vysoká|stredná|nízka",
  "dovod_priority": "krátke vysvetlenie",
  "odhad_ceny": "rozsah ceny v EUR",
  "navrh_odpovede": "text emailu pre klienta (2-3 vety, slovensky)",
  "poznamky_richard": "interné poznámky a odporúčania",
  "kategoria_sluzby": "presnejšia podkategória služby"
}`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    const text = data.content?.[0]?.text?.trim() || '';
    const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('AI analysis failed:', e);
    return null;
  }
}

// ─── Email notification ───────────────────────────────────
async function sendLeadNotification(lead: Record<string, string>, ai: Record<string, string> | null) {
  if (!RESEND_API_KEY) return;

  const priorityEmoji: Record<string, string> = { 'vysoká': '🔴', 'stredná': '🟡', 'nízka': '🟢' };
  const emoji = ai ? (priorityEmoji[ai.priorita] || '⚪') : '📋';

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#1a1a2e;color:#C9A84C;padding:20px;border-radius:10px 10px 0 0;">
        <h2 style="margin:0;">Vass & Co. — Nový Lead</h2>
      </div>
      <div style="background:#f9f9f9;padding:20px;border:1px solid #eee;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:6px 0;font-weight:bold;width:100px;">Meno:</td><td>${lead.name || lead.meno}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Kontakt:</td><td>${lead.email || lead.phone || lead.kontakt}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Firma:</td><td>${lead.company || '-'}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Služba:</td><td>${lead.sluzba || lead.service || '-'}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Správa:</td><td>${lead.notes || lead.dalsi || '-'}</td></tr>
        </table>
      </div>
      ${ai ? `
      <div style="background:#fff;padding:20px;border:1px solid #eee;border-top:none;">
        <h3 style="margin-top:0;">🤖 AI Analýza</h3>
        <p><strong>Priorita:</strong> ${emoji} ${ai.priorita} — ${ai.dovod_priority}</p>
        <p><strong>Odhad ceny:</strong> ${ai.odhad_ceny}</p>
        <div style="margin-top:10px;padding:12px;background:#f0f8f0;border-radius:8px;border-left:4px solid #2D6A4F;">
          <strong>Navrhovaná odpoveď:</strong><br><em>${ai.navrh_odpovede}</em>
        </div>
        <div style="margin-top:10px;padding:12px;background:#fff8e6;border-radius:8px;border-left:4px solid #C9A84C;">
          <strong>Poznámky:</strong><br>${ai.poznamky_richard}
        </div>
      </div>` : ''}
    </div>`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Vassweb <onboarding@resend.dev>',
      to: ['richard.vass@vassco.sk'],
      subject: `${emoji} Nový lead: ${lead.name || lead.meno} — ${lead.sluzba || lead.service || 'Dopyt'}`,
      html,
    }),
  });
}

// ─── GET /api/leads ───────────────────────────────────────
export async function GET() {
  try {
    const leads = await supaFetch('leads?order=created_at.desc&limit=100');
    return NextResponse.json({ leads: leads || [] });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// ─── POST /api/leads — Create + AI + Email ────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, service, notes, source, organization_id } = body;

    if (!name) {
      return NextResponse.json({ error: 'Meno je povinné' }, { status: 400 });
    }

    // 1) AI Analysis
    const ai = await analyzeLeadWithAI({ ...body, meno: name, sluzba: service, kontakt: email || phone, dalsi: notes });

    // 2) Save to Supabase
    const leadData = {
      name,
      email: email || '',
      phone: phone || '',
      company: company || '',
      source: source || 'web',
      status: 'new',
      priority: ai?.priorita === 'vysoká' ? 'high' : ai?.priorita === 'nízka' ? 'low' : 'medium',
      ai_analysis: ai ? JSON.stringify(ai) : null,
      ai_suggested_price: ai?.odhad_ceny ? parseFloat(ai.odhad_ceny.replace(/[^0-9.]/g, '')) || null : null,
      notes: notes || '',
      organization_id: organization_id || null,
    };

    const created = await supaFetch('leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });

    // 3) Send notification email
    await sendLeadNotification(body, ai);

    return NextResponse.json({ success: true, lead: created?.[0], analysis: ai });
  } catch (e) {
    console.error('Lead creation error:', e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// ─── PATCH /api/leads — Update lead ───────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await supaFetch(`leads?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() }),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// ─── DELETE /api/leads — Delete lead ──────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await supaFetch(`leads?id=eq.${id}`, { method: 'DELETE' });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
