import { NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

export async function POST(request: Request) {
  try {
    const { clientName, clientEmail, purpose, context } = await request.json();

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    if (!clientName || !purpose) {
      return NextResponse.json({ error: 'clientName and purpose are required' }, { status: 400 });
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: `Si copywriter pre Vassweb s. r. o.. Generuješ profesionálne emaily v slovenčine.
Pravidlá:
- Formálny ale priateľský tón
- Stručné a výstižné
- Podpis: Richard Vass, Vassweb
- Kontakt: vass@vassweb.com, +421 918 668 728, vassweb.com
- Vráť VÝHRADNE JSON bez markdown: {"subject": "...", "body": "..."}
- Body je čistý text (nie HTML), s odstavcami oddelenými prázdnymi riadkami`,
        messages: [{
          role: 'user',
          content: `Vygeneruj email pre klienta:
Meno: ${clientName}
Email: ${clientEmail || 'neuvedený'}
Účel: ${purpose}
${context ? `Kontext: ${context}` : ''}`,
        }],
      }),
    });

    const data = await res.json();
    const aiText = data.content?.[0]?.text || '{}';

    let email;
    try {
      email = JSON.parse(aiText);
    } catch {
      email = { subject: `Email pre ${clientName}`, body: aiText };
    }

    return NextResponse.json({ success: true, email });
  } catch (error) {
    console.error('Generate email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
