import { NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

export async function POST(request: Request) {
  try {
    const { projectDescription, clientName, budget } = await request.json();

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    if (!projectDescription) {
      return NextResponse.json({ error: 'projectDescription is required' }, { status: 400 });
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
        max_tokens: 1500,
        system: `Si cenový analytik pre Vassweb s. r. o.. Generuješ cenové ponuky pre webové projekty.
Tvoja cenová stratégia:
- Jednoduchý web (landing page): 500-800€
- Firemný web (5-10 podstránok): 1000-2000€
- E-shop: 2000-4000€
- Webová aplikácia: 3000-8000€
- AI integrácia: +500-1500€
- SEO optimalizácia: 200-400€
- GDPR/cookies: 100-200€
- Hosting + doména (ročne): 120-180€
- Údržba (mesačne): 20-50€
- Dodávateľ NIE JE platiteľom DPH

Vráť VÝHRADNE platný JSON:
{
  "items": [
    {"description": "UX/UI dizajn", "quantity": 1, "unit_price": 450},
    {"description": "Frontend vývoj", "quantity": 1, "unit_price": 800}
  ],
  "total": 1250,
  "delivery_weeks": 4,
  "payment_schedule": "40% záloha, 30% po dizajne, 30% pri odovzdaní",
  "notes": "Voliteľné poznámky k ponuke"
}`,
        messages: [{
          role: 'user',
          content: `Vygeneruj cenovú ponuku:
Popis projektu: ${projectDescription}
${clientName ? `Klient: ${clientName}` : ''}
${budget ? `Orientačný rozpočet klienta: ${budget}€` : ''}`,
        }],
      }),
    });

    const data = await res.json();
    const aiText = data.content?.[0]?.text || '{}';

    let quote;
    try {
      quote = JSON.parse(aiText);
    } catch {
      quote = {
        items: [{ description: 'Webový projekt', quantity: 1, unit_price: 1500 }],
        total: 1500,
        delivery_weeks: 6,
        payment_schedule: '40% záloha, 30% po dizajne, 30% pri odovzdaní',
        notes: aiText,
      };
    }

    return NextResponse.json({ success: true, quote });
  } catch (error) {
    console.error('Generate quote error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
