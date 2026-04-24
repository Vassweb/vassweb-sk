import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const CRON_SECRET = process.env.CRON_SECRET || '';

async function supaFetch(path: string, options: { method?: string; body?: unknown } = {}) {
  const { method = 'GET', body } = options;
  const key = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
  return fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    method,
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Accept-Profile': 'public',
      'Content-Profile': 'public',
      'Prefer': method !== 'GET' ? 'return=representation' : '',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) return { success: false };
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Vassweb <info@vassweb.com>',
      to: [to],
      subject,
      html,
      reply_to: 'vass@vassweb.com',
    }),
  });
  return { success: res.ok };
}

function emailTemplate(title: string, body: string): string {
  return `<div style="font-family:'Segoe UI',system-ui,sans-serif;max-width:600px;margin:0 auto;background:#0a0908;color:#e8e0d0;padding:40px 32px;border-radius:8px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:18px;font-weight:700;color:#d4a843;letter-spacing:0.1em;">VASSWEB</span>
    </div>
    <h2 style="color:#d4a843;font-size:20px;margin-bottom:16px;">${title}</h2>
    ${body}
    <div style="margin-top:40px;padding-top:20px;border-top:1px solid rgba(212,168,67,0.15);text-align:center;">
      <p style="font-size:12px;color:rgba(232,224,208,0.3);">Vassweb s. r. o. · IČO: 56921021 · vassweb.com</p>
    </div>
  </div>`;
}

async function logActivity(type: string, title: string, description: string, entityType?: string, entityId?: string) {
  await supaFetch('/activities', {
    method: 'POST',
    body: { type, title, description, entity_type: entityType || null, entity_id: entityId || null, is_read: false },
  });
}

async function createNotification(type: string, title: string, message: string) {
  await supaFetch('/notifications', {
    method: 'POST',
    body: { type, title, message, is_read: false },
  });
}

// GET handler for Vercel Cron — runs automatic payment reminders and task notifications
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: string[] = [];

  try {
    // Auto-send payment reminders for overdue invoices
    const overdueRes = await supaFetch('/invoices?status=eq.overdue&select=id,number,client_id,amount,due');
    const overdueInvoices = await overdueRes.json();

    if (Array.isArray(overdueInvoices) && overdueInvoices.length > 0) {
      const clientIds = Array.from(new Set(overdueInvoices.map((inv: { client_id: string }) => inv.client_id).filter(Boolean)));
      for (const clientId of clientIds) {
        const clientRes = await supaFetch(`/clients?id=eq.${clientId}&select=name,email`);
        const clients = await clientRes.json();
        const client = Array.isArray(clients) ? clients[0] : null;
        if (client?.email) {
          const clientInvoices = overdueInvoices.filter((inv: { client_id: string }) => inv.client_id === clientId);
          const totalOwed = clientInvoices.reduce((sum: number, inv: { amount: number }) => sum + (inv.amount || 0), 0);
          const invoiceNumbers = clientInvoices.map((inv: { number: string }) => inv.number).join(', ');
          await sendEmail(client.email, `Pripomienka platby — ${invoiceNumbers}`,
            emailTemplate('Pripomienka platby', `
              <p>Dobrý deň ${client.name},</p>
              <p>dovoľujem si Vás upozorniť na nezaplatenú faktúru: <strong>${invoiceNumbers}</strong> v celkovej hodnote <strong>${totalOwed} EUR</strong>.</p>
              <p>Prosím o úhradu čo najskôr.</p>
              <p>S pozdravom,<br><strong style="color:#d4a843;">Richard Vass</strong><br>Vassweb</p>
            `)
          );
          results.push(`Payment reminder sent to ${client.email}`);
        }
      }
    }

    // Notify about tasks due today
    const today = new Date().toISOString().split('T')[0];
    const taskRes = await supaFetch(`/tasks?due_date=eq.${today}&status=in.(nova,v_procese)&select=id,title`);
    const dueTasks = await taskRes.json();
    if (Array.isArray(dueTasks) && dueTasks.length > 0) {
      const taskList = dueTasks.map((t: { title: string }) => `<li>${t.title}</li>`).join('');
      await sendEmail('vass@vassweb.com', `${dueTasks.length} úloh dnes splatných`,
        emailTemplate('Dnešné úlohy', `<ul>${taskList}</ul><p><a href="https://app.vassweb.com/?view=tasks" style="color:#d4a843;">Otvoriť úlohy →</a></p>`)
      );
      results.push(`Due tasks notification: ${dueTasks.length} tasks`);
    }

    return NextResponse.json({ success: true, results: results.length > 0 ? results : ['No automated emails needed'] });
  } catch (error) {
    console.error('Automation email error:', error);
    return NextResponse.json({ error: 'Automation failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, clientId, invoiceId, projectId } = await request.json();
    const results: string[] = [];

    // ── WELCOME EMAIL ──
    if (action === 'welcome' && clientId) {
      const clientRes = await supaFetch(`/clients?id=eq.${clientId}&select=name,email,company`);
      const clients = await clientRes.json();
      const client = Array.isArray(clients) ? clients[0] : null;
      if (!client?.email) return NextResponse.json({ error: 'Client not found or no email' }, { status: 404 });

      const firstName = client.name.split(' ')[0];
      await sendEmail(
        client.email,
        'Vitajte vo Vassweb — teší nás spolupráca!',
        emailTemplate('Vitajte vo Vassweb!', `
          <p>Dobrý deň ${firstName},</p>
          <p>ďakujeme za prejavenú dôveru. Sme radi, že ste sa rozhodli pre spoluprácu s nami.</p>
          <p>Vassweb je digitalizačný partner, ktorý vám pomôže so:</p>
          <ul style="color:rgba(232,224,208,0.6);line-height:2;">
            <li>Tvorbou moderných webstránok</li>
            <li>AI riešeniami a automatizáciou</li>
            <li>Správou a údržbou vašej online prítomnosti</li>
          </ul>
          <p>V najbližších dňoch vás budeme kontaktovať ohľadom ďalších krokov.</p>
          <p>Ak máte akékoľvek otázky, neváhajte nám napísať na <a href="mailto:vass@vassweb.com" style="color:#d4a843;">vass@vassweb.com</a> alebo zavolať na <a href="tel:+421918668728" style="color:#d4a843;">+421 918 668 728</a>.</p>
          <p style="margin-top:24px;">S pozdravom,<br><strong style="color:#d4a843;">Richard Vass</strong><br>Vassweb · vassweb.com</p>
        `)
      );
      await logActivity('note', `Welcome email odoslaný: ${client.name}`, `Uvítací email odoslaný na ${client.email}`, 'client', clientId);
      results.push('Welcome email sent');
    }

    // ── QUOTE FOLLOW-UP (3 days after sending) ──
    if (action === 'quote-followup') {
      const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];
      const quotesRes = await supaFetch(`/quotes?status=eq.sent&updated_at=lt.${threeDaysAgo}T23:59:59&select=id,number,client_id,amount`);
      const quotes = await quotesRes.json();

      if (Array.isArray(quotes)) {
        for (const quote of quotes) {
          if (!quote.client_id) continue;
          const clientRes = await supaFetch(`/clients?id=eq.${quote.client_id}&select=name,email,company`);
          const clients = await clientRes.json();
          const client = Array.isArray(clients) ? clients[0] : null;
          if (!client?.email) continue;

          const firstName = client.name.split(' ')[0];
          await sendEmail(
            client.email,
            `Cenová ponuka ${quote.number} — pripomienka`,
            emailTemplate('Pripomienka cenovej ponuky', `
              <p>Dobrý deň ${firstName},</p>
              <p>radi by sme sa opýtali, či ste mali možnosť pozrieť si našu cenovú ponuku <strong>${quote.number}</strong> v hodnote <strong>${quote.amount} €</strong>.</p>
              <p>Ak máte akékoľvek otázky alebo by ste chceli ponuku upraviť, neváhajte nás kontaktovať.</p>
              <p>Radi vám pomôžeme nájsť riešenie, ktoré presne zodpovedá vašim potrebám.</p>
              <p style="margin-top:24px;">S pozdravom,<br><strong style="color:#d4a843;">Richard Vass</strong><br>Vassweb</p>
            `)
          );
          await logActivity('reminder', `Follow-up ponuka ${quote.number}`, `Automatický follow-up email odoslaný pre ${client.name}`, 'quote', quote.id);
          results.push(`Follow-up sent for quote ${quote.number}`);
        }
      }
    }

    // ── PROJECT DEADLINE REMINDER (7 days before) ──
    if (action === 'deadline-reminder') {
      const sevenDaysLater = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
      const projRes = await supaFetch(`/projects?deadline=eq.${sevenDaysLater}&status=not.in.(spusteny,pozastaveny)&select=id,name,deadline,client_id`);
      const projects = await projRes.json();

      if (Array.isArray(projects)) {
        for (const proj of projects) {
          await sendEmail(
            'vass@vassweb.com',
            `📅 Deadline o 7 dní: ${proj.name}`,
            emailTemplate('Pripomienka deadline', `
              <p>Projekt <strong>${proj.name}</strong> má deadline <strong>${proj.deadline}</strong> (o 7 dní).</p>
              <p>Skontrolujte stav projektu a zabezpečte, že všetko prebieha podľa plánu.</p>
              <p><a href="https://app.vassweb.com/?view=projects" style="color:#d4a843;text-decoration:underline;">Otvoriť projekt →</a></p>
            `)
          );
          await createNotification('deadline', `Deadline o 7 dní`, `Projekt ${proj.name} má deadline ${proj.deadline}.`);
          results.push(`Deadline reminder: ${proj.name}`);
        }
      }
    }

    // ── PROJECT COMPLETION THANK-YOU ──
    if (action === 'project-complete' && projectId) {
      const projRes = await supaFetch(`/projects?id=eq.${projectId}&select=id,name,client_id`);
      const projects = await projRes.json();
      const project = Array.isArray(projects) ? projects[0] : null;
      if (!project?.client_id) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

      const clientRes = await supaFetch(`/clients?id=eq.${project.client_id}&select=name,email,company`);
      const clients = await clientRes.json();
      const client = Array.isArray(clients) ? clients[0] : null;
      if (!client?.email) return NextResponse.json({ error: 'Client email not found' }, { status: 404 });

      const firstName = client.name.split(' ')[0];
      await sendEmail(
        client.email,
        `Projekt ${project.name} je dokončený! 🎉`,
        emailTemplate('Váš projekt je dokončený!', `
          <p>Dobrý deň ${firstName},</p>
          <p>s radosťou vám oznamujeme, že projekt <strong>${project.name}</strong> je úspešne dokončený a odovzdaný.</p>
          <p>Ďakujeme za skvelú spoluprácu počas celého procesu. Bolo nám potešením pracovať s vami.</p>
          <p style="margin:24px 0;padding:20px;background:rgba(212,168,67,0.06);border:1px solid rgba(212,168,67,0.15);border-radius:8px;">
            <strong style="color:#d4a843;">Čo ďalej?</strong><br>
            <span style="color:rgba(232,224,208,0.6);">Ak budete potrebovať údržbu, úpravy alebo nové funkcie, sme tu pre vás. Stačí sa ozvať.</span>
          </p>
          <p>S pozdravom,<br><strong style="color:#d4a843;">Richard Vass</strong><br>Vassweb · vassweb.com</p>
        `)
      );
      await logActivity('note', `Ďakovací email: ${project.name}`, `Ďakovací email odoslaný klientovi ${client.name}`, 'project', projectId);
      results.push('Thank-you email sent');
    }

    // ── INVOICE OVERDUE REMINDERS (7, 14, 21 days) ──
    if (action === 'invoice-reminders') {
      const reminders = [
        { days: 7, urgency: 'prvá' },
        { days: 14, urgency: 'druhá' },
        { days: 21, urgency: 'tretia' },
      ];

      for (const reminder of reminders) {
        const targetDate = new Date(Date.now() - reminder.days * 86400000).toISOString().split('T')[0];
        const invRes = await supaFetch(`/invoices?status=eq.overdue&due=eq.${targetDate}&select=id,number,client_id,amount,due`);
        const invoices = await invRes.json();

        if (!Array.isArray(invoices)) continue;

        for (const inv of invoices) {
          if (!inv.client_id) continue;
          const clientRes = await supaFetch(`/clients?id=eq.${inv.client_id}&select=name,email`);
          const clients = await clientRes.json();
          const client = Array.isArray(clients) ? clients[0] : null;
          if (!client?.email) continue;

          const firstName = client.name.split(' ')[0];
          await sendEmail(
            client.email,
            `Pripomienka: Faktúra ${inv.number} po splatnosti (${reminder.urgency} upomienka)`,
            emailTemplate(`Faktúra ${inv.number} — ${reminder.urgency} upomienka`, `
              <p>Dobrý deň ${firstName},</p>
              <p>dovoľujeme si vás upozorniť, že faktúra <strong>${inv.number}</strong> v sume <strong>${inv.amount} €</strong> je po dátume splatnosti <strong>${inv.due}</strong> (${reminder.days} dní).</p>
              <p>Prosíme o úhradu na nasledujúci účet:</p>
              <p style="padding:16px;background:rgba(212,168,67,0.06);border:1px solid rgba(212,168,67,0.15);border-radius:8px;">
                <strong style="color:#d4a843;">IBAN:</strong> SK11 0900 0000 0052 3252 7162<br>
                <strong style="color:#d4a843;">VS:</strong> ${inv.number.replace(/\D/g, '')}<br>
                <strong style="color:#d4a843;">Suma:</strong> ${inv.amount} €
              </p>
              <p style="color:rgba(232,224,208,0.5);">Ak ste medzitým platbu už odoslali, prosím ignorujte túto správu.</p>
              <p>S pozdravom,<br><strong style="color:#d4a843;">Richard Vass</strong><br>Vassweb</p>
            `)
          );
          await logActivity('reminder', `Upomienka ${inv.number} (${reminder.urgency})`, `${reminder.urgency} upomienka odoslaná na ${client.email}`, 'invoice', inv.id);
          await createNotification('invoice', `Upomienka odoslaná: ${inv.number}`, `${reminder.urgency} upomienka pre faktúru ${inv.number} (${inv.amount} €)`);
          results.push(`Reminder (${reminder.days}d) sent for ${inv.number}`);
        }
      }
    }

    return NextResponse.json({ success: true, results: results.length > 0 ? results : ['No actions taken'] });
  } catch (error) {
    console.error('Auto-email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
