/* ═══════════════════════════════════════════════════════════════
   VASSWEB AI API — Inteligentný asistent pre business management
   POST /api/ai
   ═══════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

const SYSTEM_PROMPT = `Si Vassweb AI Asistent — inteligentný business partner pre správu projektov, klientov a faktúr.

Tvoje schopnosti:
1. ANALÝZA DÁTUMU A PROJEKTOV — pomáhaš analyzovať stav projektov, deadliny, budget tracking
2. KLIENTSKÁ KOMUNIKÁCIA — píšeš profesionálne emaily, follow-upy, cenové ponuky
3. FINANČNÝ PREHĽAD — analyzuješ faktúry, platby, cash flow
4. SMART ODPORÚČANIA — navrhuješ kroky, upozorňuješ na riziká, optimalizuješ procesy
5. GENEROVANIE DOKUMENTOV — pomáhaš vytvárať cenové ponuky, zmluvy, reporty
6. PLÁNOVANIE — pomáhaš s plánovaním sprintov, priorizáciou úloh

Pravidlá:
- Odpovedaj VŽDY po slovensky (ak nie je špecifikované inak)
- Buď stručný a praktický
- Používaj dáta z kontextu na informované odporúčania
- Pri finančných otázkach vždy uvádzaj sumy v EUR
- Navrhuj konkrétne akcie, nie len teóriu
- Formátuj odpovede prehľadne pomocou markdown:
  - Používaj **tučné** pre dôležité časti
  - Používaj zoznamy (- alebo 1. 2. 3.) pre prehľadnosť
  - Používaj ### nadpisy pre sekcie
  - Používaj \`kód\` pre technické výrazy

Pri písaní emailov:
- Zahrň predmet (Subject) aj telo emailu
- Používaj profesionálny ale priateľský tón
- Zahrň konkrétne detaily z kontextu (mená projektov, sumy, dátumy)
- Formát: najprv "**Predmet:** ..." potom prázdny riadok a telo emailu

Pri cenových ponukách:
- Vždy rozdeľ na konkrétne položky s cenami
- Zahrň zľavy ak je to vhodné
- Uveď celkovú sumu
- Pridaj poznámku o platobných podmienkach

Firma: Vassweb s.r.o. — tvoríme weby, AI riešenia, automatizácie a aplikácie.`;

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key nie je nastavený' }, { status: 500 });
  }

  try {
    const { messages, context, mode = 'chat' } = await req.json();

    // Build context-aware system prompt
    let systemPrompt = SYSTEM_PROMPT;

    if (context) {
      systemPrompt += `\n\nAKTUÁLNY KONTEXT DÁTUMU (${new Date().toLocaleDateString('sk-SK')}):`;
      if (context.stats) {
        systemPrompt += `\n- Klienti: ${context.stats.clients}`;
        systemPrompt += `\n- Aktívne projekty: ${context.stats.activeProjects}`;
        systemPrompt += `\n- Celkový príjem: ${context.stats.revenue} €`;
        systemPrompt += `\n- Čakajúce platby: ${context.stats.pending} €`;
        systemPrompt += `\n- Faktúry po splatnosti: ${context.stats.overdue}`;
      }
      if (context.clients) {
        systemPrompt += `\n\nKLIENTI:\n${JSON.stringify(context.clients, null, 0)}`;
      }
      if (context.projects) {
        systemPrompt += `\n\nPROJEKTY:\n${JSON.stringify(context.projects, null, 0)}`;
      }
      if (context.invoices) {
        systemPrompt += `\n\nFAKTÚRY:\n${JSON.stringify(context.invoices, null, 0)}`;
      }
    }

    // Different modes
    if (mode === 'suggestions') {
      systemPrompt += `\n\nTERAZ: Analyzuj aktuálne dáta a navrhni 3-5 konkrétnych akcií, ktoré by mal používateľ urobiť. Formátuj ako JSON pole objektov s poliami: { "priority": "high"|"medium"|"low", "title": "...", "description": "...", "action": "..." }. Odpovedz LEN JSON pole, nič iné.`;
    }

    if (mode === 'email') {
      systemPrompt += `\n\nTERAZ: Napíš profesionálny email na základe požiadavky. Formátuj ako JSON objekt: { "subject": "...", "body": "..." }. Email má byť stručný a profesionálny. Používaj konkrétne mená klientov a projektov z kontextu.`;
    }

    if (mode === 'quote') {
      systemPrompt += `\n\nTERAZ: Vygeneruj cenovú ponuku na základe požiadavky. Formátuj ako JSON objekt: { "client": "názov klienta", "items": [{ "description": "popis položky", "quantity": 1, "unit_price": 0 }], "total": 0, "note": "poznámka k ponuke (platobné podmienky, platnosť ponuky a pod.)" }. Odpovedz LEN JSON objekt, nič iné. Ceny v EUR. Buď realistický s cenami pre slovenský trh (webové služby).`;
    }

    const openaiMessages = [
      { role: 'system', content: systemPrompt },
      ...(messages || [{ role: 'user', content: 'Ahoj' }]),
    ];

    const model = context?.settings?.ai_model || 'gpt-4o-mini';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: openaiMessages,
        temperature: mode === 'suggestions' || mode === 'quote' ? 0.3 : 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json({ error: err.error?.message || `OpenAI API error ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({
      reply,
      model,
      usage: data.usage,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}
