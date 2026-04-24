import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

async function supaFetch(path: string, options: { method?: string; body?: unknown } = {}) {
  const { method = 'GET', body } = options;
  return fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    method,
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Accept-Profile': 'public',
      'Content-Profile': 'public',
      'Prefer': method !== 'GET' ? 'return=representation' : '',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) return;
  await fetch('https://api.resend.com/emails', {
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
}

function generateInvoiceNumber(year: number, seq: number): string {
  return `FV-${year}-${String(seq).padStart(3, '0')}`;
}

function emailTemplate(title: string, body: string): string {
  return `<div style="font-family:'Segoe UI',system-ui,sans-serif;max-width:600px;margin:0 auto;background:#0a0908;color:#e8e0d0;padding:40px 32px;">
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

// POST: Generate monthly invoices for clients with active paušál
export async function POST(request: Request) {
  try {
    const { type, projectId } = await request.json();

    if (type === 'monthly') {
      // Generate monthly invoices for active projects with paušál
      const now = new Date();
      const year = now.getFullYear();
      const month = now.toLocaleDateString('sk-SK', { month: 'long', year: 'numeric' });

      // Get active projects (status vyvoj or spusteny)
      const projRes = await supaFetch('/projects?status=in.(vyvoj,spusteny)&select=id,name,budget,client_id');
      const projects = await projRes.json();

      if (!Array.isArray(projects) || projects.length === 0) {
        return NextResponse.json({ message: 'No active projects found' });
      }

      // Get current invoice counter from settings
      const settingsRes = await supaFetch('/user_settings?select=invoice_next_number&limit=1');
      const settings = await settingsRes.json();
      let nextNum = Array.isArray(settings) && settings[0]?.invoice_next_number ? settings[0].invoice_next_number : 1;

      const generated = [];

      for (const project of projects) {
        // Get client info
        if (!project.client_id) continue;
        const clientRes = await supaFetch(`/clients?id=eq.${project.client_id}&select=name,email,company`);
        const clients = await clientRes.json();
        const client = Array.isArray(clients) ? clients[0] : null;
        if (!client) continue;

        const invoiceNumber = generateInvoiceNumber(year, nextNum);
        const dueDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

        // Create invoice
        const invRes = await supaFetch('/invoices', {
          method: 'POST',
          body: {
            client_id: project.client_id,
            project_id: project.id,
            number: invoiceNumber,
            status: 'draft',
            amount: 0, // Will be updated after items
            issued: now.toISOString().split('T')[0],
            due: dueDate,
            notes: `Mesačný paušál — ${month}`,
          },
        });
        const invoice = await invRes.json();
        const invId = Array.isArray(invoice) ? invoice[0]?.id : null;

        if (invId) {
          // Create activity
          await supaFetch('/activities', {
            method: 'POST',
            body: {
              type: 'invoice_created',
              title: `Faktúra ${invoiceNumber} vygenerovaná`,
              description: `Automaticky vygenerovaná mesačná faktúra pre ${client.company || client.name}.`,
              entity_type: 'invoice',
              entity_id: invId,
              is_read: false,
            },
          });

          // Create notification
          await supaFetch('/notifications', {
            method: 'POST',
            body: {
              type: 'invoice',
              title: `Nová faktúra ${invoiceNumber}`,
              message: `Mesačná faktúra pre ${client.company || client.name} bola vygenerovaná.`,
              is_read: false,
            },
          });

          generated.push({ number: invoiceNumber, client: client.name, project: project.name });
        }

        nextNum++;
      }

      // Update counter
      await supaFetch('/user_settings?user_id=not.is.null', {
        method: 'PATCH',
        body: { invoice_next_number: nextNum },
      });

      return NextResponse.json({ success: true, generated });

    } else if (type === 'milestone' && projectId) {
      // Generate final invoice when project is completed
      const projRes = await supaFetch(`/projects?id=eq.${projectId}&select=id,name,budget,spent,client_id`);
      const projects = await projRes.json();
      const project = Array.isArray(projects) ? projects[0] : null;

      if (!project || !project.client_id) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      const clientRes = await supaFetch(`/clients?id=eq.${project.client_id}&select=name,email,company`);
      const clients = await clientRes.json();
      const client = Array.isArray(clients) ? clients[0] : null;

      const settingsRes = await supaFetch('/user_settings?select=invoice_next_number&limit=1');
      const settings = await settingsRes.json();
      let nextNum = Array.isArray(settings) && settings[0]?.invoice_next_number ? settings[0].invoice_next_number : 1;

      const year = new Date().getFullYear();
      const invoiceNumber = generateInvoiceNumber(year, nextNum);
      const remaining = Math.max(0, project.budget - project.spent);
      const dueDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

      const invRes = await supaFetch('/invoices', {
        method: 'POST',
        body: {
          client_id: project.client_id,
          project_id: project.id,
          number: invoiceNumber,
          status: 'draft',
          amount: remaining,
          issued: new Date().toISOString().split('T')[0],
          due: dueDate,
          notes: `Záverečná faktúra — projekt ${project.name}`,
        },
      });
      const invoice = await invRes.json();
      const invId = Array.isArray(invoice) ? invoice[0]?.id : null;

      if (invId && remaining > 0) {
        // Add invoice item
        await supaFetch('/invoice_items', {
          method: 'POST',
          body: {
            invoice_id: invId,
            description: `Záverečná platba — ${project.name}`,
            quantity: 1,
            unit_price: remaining,
            sort_order: 1,
          },
        });

        // Update invoice amount
        await supaFetch(`/invoices?id=eq.${invId}`, {
          method: 'PATCH',
          body: { amount: remaining },
        });
      }

      // Update counter
      await supaFetch('/user_settings?user_id=not.is.null', {
        method: 'PATCH',
        body: { invoice_next_number: nextNum + 1 },
      });

      // Send email to client
      if (client?.email) {
        await sendEmail(
          client.email,
          `Faktúra ${invoiceNumber} — Vassweb`,
          emailTemplate('Nová faktúra', `
            <p>Dobrý deň,</p>
            <p>v prílohe posielame faktúru <strong>${invoiceNumber}</strong> za projekt <strong>${project.name}</strong>.</p>
            <table style="width:100%;margin:20px 0;border-collapse:collapse;">
              <tr style="border-bottom:1px solid rgba(212,168,67,0.15);">
                <td style="padding:12px 0;color:rgba(232,224,208,0.5);">Suma</td>
                <td style="padding:12px 0;text-align:right;color:#d4a843;font-weight:700;font-size:18px;">${remaining} €</td>
              </tr>
              <tr>
                <td style="padding:12px 0;color:rgba(232,224,208,0.5);">Splatnosť</td>
                <td style="padding:12px 0;text-align:right;color:#e8e0d0;">${dueDate}</td>
              </tr>
            </table>
            <p style="color:rgba(232,224,208,0.5);">IBAN: SK11 0900 0000 0052 3252 7162</p>
            <p>Ďakujeme za spoluprácu.</p>
            <p>S pozdravom,<br><strong style="color:#d4a843;">Richard Vass</strong><br>Vassweb</p>
          `)
        );
      }

      // Create notification
      await supaFetch('/notifications', {
        method: 'POST',
        body: {
          type: 'invoice',
          title: `Záverečná faktúra ${invoiceNumber}`,
          message: `Záverečná faktúra pre ${client?.company || client?.name} (${remaining} €) bola vygenerovaná a odoslaná.`,
          is_read: false,
        },
      });

      return NextResponse.json({ success: true, invoiceNumber, amount: remaining });
    }

    return NextResponse.json({ error: 'Invalid type. Use "monthly" or "milestone"' }, { status: 400 });
  } catch (error) {
    console.error('Auto-invoice error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
