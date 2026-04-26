import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const CRON_SECRET = process.env.CRON_SECRET || '';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

async function supaFetch(path: string, options: { method?: string; body?: unknown; headers?: Record<string, string> } = {}) {
  const { method = 'GET', body, headers = {} } = options;
  return fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    method,
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Accept-Profile': 'public',
      'Content-Profile': 'public',
      'Prefer': method !== 'GET' ? 'return=representation' : '',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) return;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'Vassweb <info@vassweb.com>', to: [to], subject, html, reply_to: 'vass@vassweb.com' }),
  });
}

async function getAIRecommendation(context: string): Promise<string> {
  if (!ANTHROPIC_API_KEY) return '';
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: 'Si biznis poradca pre Vassweb. Napíš 3-5 krátkych odporúčaní na dnešný deň v HTML formáte (ul/li). Slovenčina. Stručne.',
        messages: [{ role: 'user', content: context }],
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || '';
  } catch { return ''; }
}

function emailTemplate(content: string): string {
  return `<div style="font-family:'Segoe UI',system-ui,sans-serif;max-width:640px;margin:0 auto;background:#0a0908;color:#e8e0d0;padding:40px 32px;border-radius:8px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:20px;font-weight:700;color:#d4a843;letter-spacing:0.1em;">VASSWEB</span>
      <div style="font-size:11px;color:rgba(232,224,208,0.3);margin-top:4px;letter-spacing:0.15em;">DENNÝ PREHĽAD</div>
    </div>
    ${content}
    <div style="margin-top:40px;padding-top:20px;border-top:1px solid rgba(212,168,67,0.15);text-align:center;">
      <a href="https://app.vassweb.com" style="color:#d4a843;text-decoration:none;font-size:13px;">Otvoriť appku →</a>
    </div>
  </div>`;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = new Date().toISOString().split('T')[0];
  const results: string[] = [];
  const digestSections: string[] = [];

  try {
    // ── 1. Mark overdue invoices ──
    const overdueRes = await supaFetch(`/invoices?status=eq.sent&due=lt.${today}&select=id,number,client_id,amount,due`);
    const overdueInvoices = await overdueRes.json();

    if (Array.isArray(overdueInvoices) && overdueInvoices.length > 0) {
      for (const inv of overdueInvoices) {
        await supaFetch(`/invoices?id=eq.${inv.id}`, { method: 'PATCH', body: { status: 'overdue' } });
        await supaFetch('/activities', {
          method: 'POST',
          body: {
            type: 'invoice_overdue',
            title: `Faktúra ${inv.number} po splatnosti`,
            description: `Faktúra ${inv.number} (${inv.amount} €) prekročila dátum splatnosti ${inv.due}.`,
            entity_type: 'invoice', entity_id: inv.id, is_read: false,
          },
        });
        await supaFetch('/notifications', {
          method: 'POST',
          body: { type: 'invoice', title: `Faktúra ${inv.number} po splatnosti`, message: `${inv.amount} € po splatnosti od ${inv.due}`, is_read: false },
        });
      }
      results.push(`Marked ${overdueInvoices.length} invoices as overdue`);
      digestSections.push(`<div style="margin-bottom:24px;"><h3 style="color:#c41e2a;font-size:15px;margin-bottom:8px;">⚠ Po splatnosti (${overdueInvoices.length})</h3>${overdueInvoices.map((i: { number: string; amount: number; due: string }) => `<p style="color:rgba(232,224,208,0.6);font-size:13px;margin:4px 0;">• ${i.number} — ${i.amount} € (splatnosť ${i.due})</p>`).join('')}</div>`);
    }

    // ── 2. Deadline reminders (3 and 7 days) ──
    for (const dayOffset of [3, 7]) {
      const targetDate = new Date(Date.now() + dayOffset * 86400000).toISOString().split('T')[0];
      const deadlineRes = await supaFetch(`/projects?deadline=eq.${targetDate}&status=not.in.(spusteny,pozastaveny)&select=id,name,deadline`);
      const deadlineProjects = await deadlineRes.json();

      if (Array.isArray(deadlineProjects) && deadlineProjects.length > 0) {
        for (const proj of deadlineProjects) {
          await supaFetch('/activities', {
            method: 'POST',
            body: {
              type: 'reminder',
              title: `Deadline o ${dayOffset} dní: ${proj.name}`,
              description: `Projekt ${proj.name} má deadline ${proj.deadline}.`,
              entity_type: 'project', entity_id: proj.id, is_read: false,
            },
          });
          await supaFetch('/notifications', {
            method: 'POST',
            body: { type: 'deadline', title: `Deadline o ${dayOffset} dní`, message: `${proj.name} — ${proj.deadline}`, is_read: false },
          });
        }
        results.push(`Sent ${deadlineProjects.length} deadline reminders (${dayOffset}d)`);
        digestSections.push(`<div style="margin-bottom:24px;"><h3 style="color:#d4a843;font-size:15px;margin-bottom:8px;">📅 Deadline o ${dayOffset} dní</h3>${deadlineProjects.map((p: { name: string; deadline: string }) => `<p style="color:rgba(232,224,208,0.6);font-size:13px;margin:4px 0;">• ${p.name} — ${p.deadline}</p>`).join('')}</div>`);
      }
    }

    // ── 3. Auto follow-up for unpaid invoices (7+ days) ──
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const followupRes = await supaFetch(`/invoices?status=eq.sent&issued=lt.${sevenDaysAgo}&select=id,number,client_id,amount`);
    const followupInvoices = await followupRes.json();

    if (Array.isArray(followupInvoices) && followupInvoices.length > 0) {
      for (const inv of followupInvoices) {
        await supaFetch('/activities', {
          method: 'POST',
          body: {
            type: 'reminder',
            title: `Follow-up: Faktúra ${inv.number}`,
            description: `Faktúra ${inv.number} (${inv.amount} €) odoslaná pred 7+ dňami, stále nezaplatená.`,
            entity_type: 'invoice', entity_id: inv.id, is_read: false,
          },
        });
      }
      results.push(`Created ${followupInvoices.length} follow-up reminders`);
    }

    // ── 4. Trigger invoice overdue reminders (7, 14, 21 days) ──
    await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || 'https://app.vassweb.com'}/api/automation/emails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'invoice-reminders' }),
    }).catch(() => {});

    // ── 5. Trigger quote follow-ups ──
    await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || 'https://app.vassweb.com'}/api/automation/emails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'quote-followup' }),
    }).catch(() => {});

    // ── 6. Trigger deadline reminders (7 days) ──
    await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || 'https://app.vassweb.com'}/api/automation/emails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deadline-reminder' }),
    }).catch(() => {});

    // ── 7. Today's tasks ──
    const tasksRes = await supaFetch(`/tasks?due_date=eq.${today}&status=in.(nova,v_procese)&select=title,priority`);
    const todayTasks = await tasksRes.json();
    if (Array.isArray(todayTasks) && todayTasks.length > 0) {
      digestSections.push(`<div style="margin-bottom:24px;"><h3 style="color:#d4a843;font-size:15px;margin-bottom:8px;">✅ Dnešné úlohy (${todayTasks.length})</h3>${todayTasks.map((t: { title: string; priority: string }) => `<p style="color:rgba(232,224,208,0.6);font-size:13px;margin:4px 0;">• ${t.title} <span style="color:${t.priority === 'urgentna' ? '#c41e2a' : t.priority === 'vysoka' ? '#f59e0b' : '#d4a843'};font-size:11px;">[${t.priority}]</span></p>`).join('')}</div>`);
    }

    // ── 8. Pending payments summary ──
    const pendingRes = await supaFetch(`/invoices?status=in.(sent,overdue)&select=number,amount,status,due`);
    const pendingInvoices = await pendingRes.json();
    if (Array.isArray(pendingInvoices) && pendingInvoices.length > 0) {
      const totalPending = pendingInvoices.reduce((s: number, i: { amount: number }) => s + i.amount, 0);
      digestSections.push(`<div style="margin-bottom:24px;"><h3 style="color:#d4a843;font-size:15px;margin-bottom:8px;">💰 Čakajúce platby: ${totalPending} €</h3>${pendingInvoices.map((i: { number: string; amount: number; status: string; due: string }) => `<p style="color:rgba(232,224,208,0.6);font-size:13px;margin:4px 0;">• ${i.number} — ${i.amount} € <span style="color:${i.status === 'overdue' ? '#c41e2a' : '#d4a843'}">(${i.status === 'overdue' ? 'po splatnosti' : `splatnosť ${i.due}`})</span></p>`).join('')}</div>`);
    }

    // ── 9. AI Recommendations ──
    const aiContext = `Dnes: ${today}\nÚlohy: ${Array.isArray(todayTasks) ? todayTasks.length : 0}\nPo splatnosti: ${Array.isArray(overdueInvoices) ? overdueInvoices.length : 0}\nČakajúce platby: ${Array.isArray(pendingInvoices) ? pendingInvoices.length : 0}`;
    const aiRec = await getAIRecommendation(aiContext);
    if (aiRec) {
      digestSections.push(`<div style="margin-bottom:24px;"><h3 style="color:#d4a843;font-size:15px;margin-bottom:8px;">🤖 AI odporúčania</h3><div style="color:rgba(232,224,208,0.6);font-size:13px;line-height:1.8;">${aiRec}</div></div>`);
    }

    // ── 10. Send daily digest email ──
    if (digestSections.length > 0) {
      const dateStr = new Date().toLocaleDateString('sk-SK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      await sendEmail(
        'vass@vassweb.com',
        `📋 Denný prehľad — ${dateStr}`,
        emailTemplate(`<h2 style="color:#d4a843;font-size:18px;margin-bottom:24px;">Prehľad na ${dateStr}</h2>${digestSections.join('')}`)
      );
      results.push('Daily digest email sent');
    }

    return NextResponse.json({ success: true, date: today, results: results.length > 0 ? results : ['No actions needed'] });
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
