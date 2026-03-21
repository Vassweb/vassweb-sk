import { NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

export async function POST(request: Request) {
  try {
    const { fileBase64, fileName, mimeType } = await request.json();

    if (!fileBase64) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    // Claude can analyze PDFs and images directly
    const isPdf = mimeType === 'application/pdf';
    const isImage = mimeType?.startsWith('image/');

    const content: Array<Record<string, unknown>> = [];

    if (isPdf) {
      content.push({
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: fileBase64 },
      });
    } else if (isImage) {
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: mimeType, data: fileBase64 },
      });
    } else {
      // For text files, decode and send as text
      const text = Buffer.from(fileBase64, 'base64').toString('utf-8');
      content.push({ type: 'text', text: `Obsah súboru ${fileName}:\n\n${text}` });
    }

    content.push({
      type: 'text',
      text: `Analyzuj tento dokument (${fileName}) a vráť JSON s týmito poľami:
{
  "type": "faktura" | "zmluva" | "cenova_ponuka" | "dodaci_list" | "objednavka" | "iny",
  "summary": "stručný popis dokumentu (max 2 vety, slovensky)",
  "category": "zmluva" | "ponuka" | "faktura" | "podklady" | "assets",
  "client_name": "meno firmy/klienta ak je v dokumente, inak null",
  "amount": číslo ak je v dokumente suma, inak null,
  "date": "YYYY-MM-DD ak je dátum, inak null",
  "due_date": "YYYY-MM-DD ak je splatnosť, inak null",
  "invoice_number": "číslo faktúry ak existuje, inak null",
  "key_items": ["zoznam hlavných položiek/bodov z dokumentu"],
  "suggested_actions": ["odporúčané akcie - napr. Vytvoriť faktúru, Priradiť ku klientovi, Nastaviť deadline"],
  "extracted_contacts": [{"name": "", "email": "", "phone": ""}],
  "tags": ["relevantné tagy pre kategorizáciu"]
}
Odpovedaj LEN čistým JSON, žiadny markdown ani komentáre.`,
    });

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content }],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Anthropic error:', data);
      return NextResponse.json({ error: data.error?.message || 'AI analysis failed' }, { status: 500 });
    }

    const responseText = data.content?.[0]?.text || '{}';

    // Parse JSON from response
    let analysis;
    try {
      // Extract JSON if wrapped in code blocks
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch {
      analysis = { summary: responseText, type: 'iny', category: 'podklady', tags: [] };
    }

    return NextResponse.json({ success: true, analysis, fileName });
  } catch (error) {
    console.error('Document analyze error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
