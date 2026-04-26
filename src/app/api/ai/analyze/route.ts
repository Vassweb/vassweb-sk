import { NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function supaFetch(path: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Accept-Profile': 'public',
      'Content-Profile': 'public',
    },
  });
  return res.json();
}

export async function GET() {
  try {
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    // Gather all business data
    const [clients, projects, invoices, tasks, quotes] = await Promise.all([
      supaFetch('/clients?select=id,name,company,created_at'),
      supaFetch('/projects?select=id,name,status,budget,spent,progress,deadline,client_id'),
      supaFetch('/invoices?select=id,number,status,amount,due,client_id'),
      supaFetch('/tasks?select=id,title,status,priority,due_date'),
      supaFetch('/quotes?select=id,number,status,amount,valid_until'),
    ]);

    const today = new Date().toISOString().split('T')[0];

    // Calculate metrics
    const activeProjects = Array.isArray(projects) ? projects.filter((p: { status: string }) => !['spusteny', 'pozastaveny'].includes(p.status)) : [];
    const overdueInvoices = Array.isArray(invoices) ? invoices.filter((i: { status: string }) => i.status === 'overdue') : [];
    const pendingInvoices = Array.isArray(invoices) ? invoices.filter((i: { status: string }) => i.status === 'sent') : [];
    const totalRevenue = Array.isArray(invoices) ? invoices.filter((i: { status: string }) => i.status === 'paid').reduce((s: number, i: { amount: number }) => s + i.amount, 0) : 0;
    const pendingTasks = Array.isArray(tasks) ? tasks.filter((t: { status: string }) => t.status === 'nova' || t.status === 'v_procese') : [];
    const pendingQuotes = Array.isArray(quotes) ? quotes.filter((q: { status: string }) => q.status === 'sent') : [];
    const upcomingDeadlines = Array.isArray(projects) ? projects.filter((p: { deadline: string | null; status: string }) => {
      if (!p.deadline || ['spusteny', 'pozastaveny'].includes(p.status)) return false;
      const daysLeft = Math.ceil((new Date(p.deadline).getTime() - Date.now()) / 86400000);
      return daysLeft >= 0 && daysLeft <= 14;
    }) : [];

    const contextSummary = `
Aktuálny stav biznisu (${today}):
- Klienti: ${Array.isArray(clients) ? clients.length : 0}
- Aktívne projekty: ${activeProjects.length}
- Celkový obrat (zaplatené): ${totalRevenue} €
- Čakajúce faktúry: ${pendingInvoices.length} (${pendingInvoices.reduce((s: number, i: { amount: number }) => s + i.amount, 0)} €)
- Po splatnosti: ${overdueInvoices.length} (${overdueInvoices.reduce((s: number, i: { amount: number }) => s + i.amount, 0)} €)
- Nevybavené úlohy: ${pendingTasks.length}
- Čakajúce ponuky: ${pendingQuotes.length}
- Blížiace sa deadliny (14 dní): ${upcomingDeadlines.length}

Projekty:
${activeProjects.map((p: { name: string; status: string; progress: number; deadline: string | null; budget: number; spent: number }) => `- ${p.name}: ${p.status}, ${p.progress}% hotové, deadline ${p.deadline || 'neurčený'}, budget ${p.budget}€ (minuté ${p.spent}€)`).join('\n')}

Po splatnosti:
${overdueInvoices.map((i: { number: string; amount: number; due: string }) => `- ${i.number}: ${i.amount}€, splatnosť ${i.due}`).join('\n') || 'Žiadne'}
`;

    // Ask AI for recommendations
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        system: `Si biznis analytik pre Vassweb. Analyzuj dáta a vráť JSON s odporúčaniami. Vždy po slovensky. Vráť VÝHRADNE platný JSON bez markdown formátovania, bez \`\`\`json blokov.

Formát odpovede (striktne JSON):
{
  "summary": "Krátky prehľad stavu biznisu (2-3 vety)",
  "urgent": ["Urgentná akcia 1", "Urgentná akcia 2"],
  "recommendations": ["Odporúčanie 1", "Odporúčanie 2", "Odporúčanie 3"],
  "health_score": 85,
  "focus_today": "Na čo sa dnes zamerať"
}

health_score je 0-100 podľa celkového stavu (faktúry zaplatené, projekty na čas, etc.)`,
        messages: [{ role: 'user', content: contextSummary }],
      }),
    });

    const data = await res.json();
    const aiText = data.content?.[0]?.text || '{}';

    // Parse AI response
    let analysis;
    try {
      analysis = JSON.parse(aiText);
    } catch {
      analysis = {
        summary: aiText,
        urgent: [],
        recommendations: [],
        health_score: 50,
        focus_today: 'Skontrolujte stav projektov.',
      };
    }

    return NextResponse.json({
      success: true,
      analysis,
      metrics: {
        clientCount: Array.isArray(clients) ? clients.length : 0,
        activeProjects: activeProjects.length,
        totalRevenue,
        pendingAmount: pendingInvoices.reduce((s: number, i: { amount: number }) => s + i.amount, 0),
        overdueAmount: overdueInvoices.reduce((s: number, i: { amount: number }) => s + i.amount, 0),
        overdueCount: overdueInvoices.length,
        pendingTasks: pendingTasks.length,
        pendingQuotes: pendingQuotes.length,
        upcomingDeadlines: upcomingDeadlines.length,
      },
    });
  } catch (error) {
    console.error('AI analyze error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
