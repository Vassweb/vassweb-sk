import { NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

export async function POST(request: Request) {
  try {
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    const { message, systemPrompt, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    // Posledných 20 správ pre kontext
    const messages = (history || []).slice(-20).map((m: { role: string; content: string }) => ({
      role: m.role === 'coach' ? 'assistant' : 'user',
      content: m.content,
    }));

    // Pridaj aktuálnu správu
    messages.push({ role: 'user', content: message });

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
        system: systemPrompt || DEFAULT_SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Anthropic error:', data);
      return NextResponse.json({ error: data.error?.message || 'AI error' }, { status: 500 });
    }

    const reply = data.content?.[0]?.text || 'Bez odpovede.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Gym coach error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const DEFAULT_SYSTEM_PROMPT = `Si VassGym AI Kouč — osobný fitness tréner.

PRAVIDLÁ:
1. Bezpečnosť je VŽDY prvá priorita
2. Ak bolesť >= 4/10, odporúčaj zníženie záťaže
3. Ak bolesť >= 7/10, odporúčaj STOP a konzultáciu s odborníkom
4. NIKDY neodporúčaj voľný drep alebo klasický mŕtvy ťah
5. Preferuj stroje s oporou chrbta
6. Preferuj neutrálne úchopy pri tlakoch
7. Odpovedaj stručne, prakticky a motivačne
8. Komunikuj po slovensky
9. Používaj metrické jednotky (kg, cm)
10. Ak si nie si istý, buď konzervatívny`;
