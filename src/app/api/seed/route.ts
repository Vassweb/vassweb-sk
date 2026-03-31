import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const CRON_SECRET = process.env.CRON_SECRET || '';

async function supaInsert(table: string, data: Record<string, unknown>, token: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token || SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Accept-Profile': 'public',
      'Content-Profile': 'public',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`${table}: ${JSON.stringify(body)}`);
  return Array.isArray(body) ? body[0] : body;
}

async function supaSelect(table: string, filter: string, token: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}&limit=1`, {
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token || SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY}`,
      'Accept-Profile': 'public',
    },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`${table} select: ${JSON.stringify(body)}`);
  return Array.isArray(body) ? body : [];
}

export async function GET(request: Request) {
  // Auth: require CRON_SECRET or valid user token
  const authHeader = request.headers.get('authorization');
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');

  if (CRON_SECRET && secret !== CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized. Pass ?secret=YOUR_CRON_SECRET' }, { status: 401 });
  }

  // Use service_role_key to bypass RLS
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' }, { status: 500 });
  }
  const token = SUPABASE_SERVICE_ROLE_KEY;

  // Owner user ID from env — set in Vercel dashboard
  const OWNER_USER_ID = process.env.OWNER_USER_ID || '';
  if (!OWNER_USER_ID) {
    return NextResponse.json({ error: 'OWNER_USER_ID not configured' }, { status: 500 });
  }

  const results: string[] = [];
  const uf = { user_id: OWNER_USER_ID };

  try {
    // ─── IDEMPOTENCY CHECK ───
    // Skontroluj či klient Euphoria Nightclub už existuje
    const existingClients = await supaSelect(
      'clients',
      `user_id=eq.${OWNER_USER_ID}&company=eq.Euphoria+Nightclub+s.r.o.`,
      token
    );

    if (existingClients.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Dáta už existujú — seed bol preskočený. Euphoria Nightclub je už v databáze.',
        skipped: true,
        existing_client_id: existingClients[0].id,
      });
    }

    // ─── 1. Client: Euphoria Nightclub ───
    const client = await supaInsert('clients', {
      ...uf,
      name: 'Zoli',
      company: 'Euphoria Nightclub s.r.o.',
      email: 'euphorianightclub11@gmail.com',
      phone: '+421 950 480 799',
      notes: 'Luxusný nočný klub v Šamoríne. Kontakt: Zoli. Segment: Web Development. Adresa: Bratislavská 11, 931 01 Šamorín.',
      tags: ['Web', 'Nightclub', 'VIP'],
    }, token);
    results.push(`Client: ${client.id}`);

    // ─── 2. Project: Webstránka Euphoria ───
    const project = await supaInsert('projects', {
      ...uf,
      client_id: client.id,
      name: 'Webstránka Euphoria Nightclub',
      description: 'Kompletná webová prezentácia pre luxusný nočný klub — hero sekcia, menu, galéria, eventy, rezervačný formulár, kontakt, SEO, GDPR, responzívny dizajn.',
      status: 'navrh',
      budget: 2500,
      spent: 0,
      progress: 10,
      start_date: '2026-03-16',
      deadline: '2026-04-27',
    }, token);
    results.push(`Project: ${project.id}`);

    // ─── 3. Quote: 2026-WEB-001 ───
    const quote = await supaInsert('quotes', {
      ...uf,
      number: `2026-WEB-${String(Date.now()).slice(-4)}`,
      client_id: client.id,
      status: 'sent',
      total: 2500,
      valid_until: '2026-04-15',
    }, token);
    results.push(`Quote: ${quote.id}`);

    // Quote items
    const quoteItems = [
      { quote_id: quote.id, description: 'Dizajn UX/UI — wireframe, vizuálny návrh, responzívny layout', quantity: 1, unit_price: 450 },
      { quote_id: quote.id, description: 'Frontend vývoj — HTML/CSS/JS, animácie, particles, theme switcher', quantity: 1, unit_price: 650 },
      { quote_id: quote.id, description: 'Rezervačný systém — formulár s Formspree, validácia, GDPR', quantity: 1, unit_price: 350 },
      { quote_id: quote.id, description: 'SEO + GDPR + hosting setup + školenie + odovzdanie', quantity: 1, unit_price: 1050 },
    ];
    for (const item of quoteItems) {
      await supaInsert('quote_items', item, token);
    }
    results.push(`Quote items: ${quoteItems.length}`);

    // ─── 4. Invoice: Záloha ───
    const invoice = await supaInsert('invoices', {
      ...uf,
      number: `VW-2026-${String(Date.now()).slice(-4)}`,
      client_id: client.id,
      project_id: project.id,
      status: 'sent',
      amount: 1000,
      issued: '2026-03-16',
      due: '2026-03-30',
      notes: 'Záloha 40% za webstránku Euphoria Nightclub',
    }, token);
    results.push(`Invoice: ${invoice.id}`);

    await supaInsert('invoice_items', {
      invoice_id: invoice.id,
      description: 'Záloha 40% — Webstránka Euphoria Nightclub',
      quantity: 1,
      unit_price: 1000,
      sort_order: 1,
    }, token);

    // ─── 5. Tasks ───
    const taskData = [
      { ...uf, title: 'Odoslať cenovú ponuku + demo Zolimu', description: 'Poslať CP emailom spolu s linkom na demo verziu webu, dohodnúť stretnutie', priority: 'urgentna', status: 'nova', client_id: client.id, project_id: project.id, due_date: '2026-03-22' },
    ];
    for (const t of taskData) {
      await supaInsert('tasks', t, token);
    }
    results.push(`Tasks: ${taskData.length}`);

    // ─── 6. Calendar Events ───
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const in3days = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
    const in2weeks = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

    const calData = [
      { ...uf, title: 'Stretnutie so Zolim — Euphoria demo prezentácia', description: 'Prezentovať demo verziu webu, prejsť cenovú ponuku, dohodnúť ďalší postup', type: 'meeting', start_at: `${tomorrow}T14:00:00`, client_id: client.id, project_id: project.id },
      { ...uf, title: 'Deadline: dizajn Euphoria schválenie', description: 'Zoli musí schváliť finálny dizajn webu', type: 'deadline', start_at: `${in2weeks}T09:00:00`, client_id: client.id, project_id: project.id },
      { ...uf, title: 'Follow-up Zoli — odpoveď na ponuku', description: 'Ak Zoli neodpovie na CP, zavolať mu', type: 'followup', start_at: `${in3days}T10:00:00`, client_id: client.id, project_id: project.id },
    ];
    for (const e of calData) {
      await supaInsert('calendar_events', e, token);
    }
    results.push(`Calendar events: ${calData.length}`);

    // ─── 7. Activity log ───
    await supaInsert('activities', {
      ...uf,
      type: 'client_created',
      title: 'Nový klient: Euphoria Nightclub s.r.o.',
      description: 'Klient pridaný do CRM — nočný klub v Šamoríne, kontakt Zoli.',
      entity_type: 'client',
      entity_id: client.id,
      is_read: false,
    }, token);

    await supaInsert('activities', {
      ...uf,
      type: 'project_created',
      title: 'Nový projekt: Webstránka Euphoria Nightclub',
      description: 'Projekt vytvorený — rozpočet 2500€, deadline 27.04.2026.',
      entity_type: 'project',
      entity_id: project.id,
      is_read: false,
    }, token);

    results.push('Activities: 2');

    return NextResponse.json({
      success: true,
      message: 'Euphoria Nightclub data seeded successfully!',
      results,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({
      error: 'Seed failed',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
