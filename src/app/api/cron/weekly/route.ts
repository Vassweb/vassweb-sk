import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const CRON_SECRET = process.env.CRON_SECRET || '';

async function supaFetch(path: string) {
  return fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Accept-Profile': 'public',
      'Content-Profile': 'public',
    },
  }).then(r => r.json());
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) return;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'Vassweb <info@vassweb.sk>', to: [to], subject, html, reply_to: 'richard.vass@vassco.sk' }),
  });
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];

    // Gather weekly data
    const [clients, projects, invoices, tasks, activities] = await Promise.all([
      supaFetch(`/clients?created_at=gte.${weekAgo}&select=id,name,company`),
      supaFetch('/projects?status=not.in.(pozastaveny)&select=id,name,status,progress,deadline,budget,spent'),
      supaFetch(`/invoices?select=id,number,status,amount,issued,due`),
      supaFetch(`/tasks?updated_at=gte.${weekAgo}&select=id,title,status`),
      supaFetch(`/activities?created_at=gte.${weekAgo}&select=id,type,title&order=created_at.desc&limit=20`),
    ]);

    const newClients = Array.isArray(clients) ? clients.length : 0;
    const completedTasks = Array.isArray(tasks) ? tasks.filter((t: { status: string }) => t.status === 'hotova').length : 0;
    const totalTasks = Array.isArray(tasks) ? tasks.length : 0;

    const paidThisWeek = Array.isArray(invoices) ? invoices.filter((i: { status: string; issued: string }) => i.status === 'paid' && i.issued >= weekAgo) : [];
    const weekRevenue = paidThisWeek.reduce((s: number, i: { amount: number }) => s + i.amount, 0);

    const overdueInvoices = Array.isArray(invoices) ? invoices.filter((i: { status: string }) => i.status === 'overdue') : [];
    const pendingInvoices = Array.isArray(invoices) ? invoices.filter((i: { status: string }) => i.status === 'sent') : [];

    const activeProjects = Array.isArray(projects) ? projects.filter((p: { status: string }) => !['spusteny'].includes(p.status)) : [];

    const upcomingDeadlines = Array.isArray(projects) ? projects.filter((p: { deadline: string | null; status: string }) => {
      if (!p.deadline || p.status === 'spusteny') return false;
      return p.deadline >= today && p.deadline <= new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
    }) : [];

    // Build email
    const weekLabel = new Date().toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' });

    const html = `<div style="font-family:'Segoe UI',system-ui,sans-serif;max-width:640px;margin:0 auto;background:#0a0908;color:#e8e0d0;padding:40px 32px;border-radius:8px;">
      <div style="text-align:center;margin-bottom:32px;">
        <span style="font-size:20px;font-weight:700;color:#d4a843;letter-spacing:0.1em;">VASSWEB</span>
        <div style="font-size:11px;color:rgba(232,224,208,0.3);margin-top:4px;letter-spacing:0.15em;">TÝŽDENNÝ SÚHRN</div>
      </div>

      <h2 style="color:#d4a843;font-size:18px;margin-bottom:24px;">Týždeň do ${weekLabel}</h2>

      <!-- Stats Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:28px;">
        <div style="padding:16px;background:rgba(212,168,67,0.04);border:1px solid rgba(212,168,67,0.1);border-radius:8px;">
          <div style="font-size:24px;font-weight:700;color:#d4a843;">${weekRevenue} €</div>
          <div style="font-size:11px;color:rgba(232,224,208,0.4);">Príjem tento týždeň</div>
        </div>
        <div style="padding:16px;background:rgba(212,168,67,0.04);border:1px solid rgba(212,168,67,0.1);border-radius:8px;">
          <div style="font-size:24px;font-weight:700;color:#d4a843;">${newClients}</div>
          <div style="font-size:11px;color:rgba(232,224,208,0.4);">Noví klienti</div>
        </div>
        <div style="padding:16px;background:rgba(212,168,67,0.04);border:1px solid rgba(212,168,67,0.1);border-radius:8px;">
          <div style="font-size:24px;font-weight:700;color:#d4a843;">${completedTasks}/${totalTasks}</div>
          <div style="font-size:11px;color:rgba(232,224,208,0.4);">Úlohy dokončené</div>
        </div>
        <div style="padding:16px;background:rgba(212,168,67,0.04);border:1px solid rgba(212,168,67,0.1);border-radius:8px;">
          <div style="font-size:24px;font-weight:700;color:${overdueInvoices.length > 0 ? '#c41e2a' : '#d4a843'};">${overdueInvoices.length}</div>
          <div style="font-size:11px;color:rgba(232,224,208,0.4);">Po splatnosti</div>
        </div>
      </div>

      ${activeProjects.length > 0 ? `
        <h3 style="color:#d4a843;font-size:14px;margin-bottom:12px;">📋 Aktívne projekty (${activeProjects.length})</h3>
        ${activeProjects.map((p: { name: string; status: string; progress: number; deadline: string | null }) => `
          <div style="padding:12px 0;border-bottom:1px solid rgba(212,168,67,0.06);">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:13px;font-weight:600;color:#e8e0d0;">${p.name}</span>
              <span style="font-size:11px;color:rgba(232,224,208,0.4);">${p.progress}%</span>
            </div>
            <div style="height:4px;background:rgba(255,255,255,0.06);border-radius:2px;margin-top:6px;">
              <div style="height:100%;width:${p.progress}%;background:linear-gradient(90deg,#d4a843,#ffeebb);border-radius:2px;"></div>
            </div>
            ${p.deadline ? `<div style="font-size:11px;color:rgba(232,224,208,0.3);margin-top:4px;">Deadline: ${p.deadline}</div>` : ''}
          </div>
        `).join('')}
      ` : ''}

      ${upcomingDeadlines.length > 0 ? `
        <div style="margin-top:24px;">
          <h3 style="color:#d4a843;font-size:14px;margin-bottom:8px;">⏰ Blížiace sa deadliny</h3>
          ${upcomingDeadlines.map((p: { name: string; deadline: string }) => `<p style="font-size:13px;color:rgba(232,224,208,0.6);margin:4px 0;">• ${p.name} — ${p.deadline}</p>`).join('')}
        </div>
      ` : ''}

      ${pendingInvoices.length > 0 ? `
        <div style="margin-top:24px;">
          <h3 style="color:#d4a843;font-size:14px;margin-bottom:8px;">💰 Čakajúce platby (${pendingInvoices.reduce((s: number, i: { amount: number }) => s + i.amount, 0)} €)</h3>
          ${pendingInvoices.map((i: { number: string; amount: number; due: string }) => `<p style="font-size:13px;color:rgba(232,224,208,0.6);margin:4px 0;">• ${i.number} — ${i.amount} € (splatnosť ${i.due})</p>`).join('')}
        </div>
      ` : ''}

      <div style="margin-top:40px;padding-top:20px;border-top:1px solid rgba(212,168,67,0.15);text-align:center;">
        <a href="https://app.vassweb.sk" style="color:#d4a843;text-decoration:none;font-size:13px;">Otvoriť appku →</a>
      </div>
    </div>`;

    await sendEmail('richard.vass@vassco.sk', `📊 Týždenný súhrn — ${weekLabel}`, html);

    return NextResponse.json({ success: true, date: today, message: 'Weekly digest sent' });
  } catch (error) {
    console.error('Weekly cron error:', error);
    return NextResponse.json({ error: 'Weekly cron failed' }, { status: 500 });
  }
}
