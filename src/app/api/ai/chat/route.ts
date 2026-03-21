import { NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

const SYSTEM_PROMPT = `Si biznis asistent pre Vassweb (VVD s.r.o.) — slovenská firma zameraná na webový vývoj, AI riešenia a automatizáciu.

Tvoje úlohy:
- Pomáhaš generovať cenové ponuky a emaily pre klientov
- Analyzuješ projektové dáta a navrhuješ zlepšenia
- Radíš v oblasti podnikania, fakturácie a CRM
- Píšeš profesionálne texty v slovenčine
- Pomáhaš s plánovaním projektov a deadlines

Pravidlá:
- Odpovedaj vždy po slovensky
- Buď stručný a profesionálny
- Používaj formátovanie (odrážky, číslovanie)
- Ak generuješ email, použi formálny tón
- Sumy uvádzaj v EUR

Firemné údaje:
- Firma: VVD s. r. o. (brand: Vassweb)
- IČO: 56921021, DIČ: 2122501524, IČ DPH: SK2122501524
- IBAN: SK11 0900 0000 0052 3252 7162
- Konateľ: Richard Vass
- Email: richard.vass@vassco.sk, Web: vassweb.sk`;

export async function POST(request: Request) {
  try {
    const { messages, context, model } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array required' }, { status: 400 });
    }

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: 'AI asistent nie je nakonfigurovaný. Pridajte ANTHROPIC_API_KEY do environment variables na Vercel.',
        },
      });
    }

    // Build context-aware system message
    let systemMessage = SYSTEM_PROMPT;
    if (context) {
      systemMessage += `\n\nAktuálne štatistiky biznisu:\n- Počet klientov: ${context.clientCount || 0}\n- Aktívne projekty: ${context.activeProjects || 0}\n- Celkový obrat: ${context.totalRevenue || 0} €\n- Čakajúce platby: ${context.pendingRevenue || 0} €\n- Po splatnosti: ${context.overdueCount || 0} faktúr`;
    }

    // Convert messages to Anthropic format (no 'system' role in messages array)
    const anthropicMessages = messages.slice(-20).map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: systemMessage,
        messages: anthropicMessages,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Anthropic error:', data);
      return NextResponse.json({ error: data.error?.message || 'AI error' }, { status: 500 });
    }

    const content = data.content?.[0]?.text || 'Bez odpovede.';

    return NextResponse.json({
      message: {
        role: 'assistant',
        content,
      },
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
