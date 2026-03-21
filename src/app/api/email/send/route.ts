/* ═══════════════════════════════════════════════════════════════
   VASSWEB EMAIL SEND API — Odosielanie emailov cez Resend
   POST /api/email/send
   ═══════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export async function POST(req: NextRequest) {
  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: 'Resend API key nie je nastavený' }, { status: 500 });
  }

  try {
    const { to, subject, html, from, replyTo } = (await req.json()) as EmailRequest;

    if (!to || !subject || !html) {
      return NextResponse.json({ error: 'Chýba to, subject alebo html' }, { status: 400 });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: from || 'Vassweb <noreply@vassweb.sk>',
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        reply_to: replyTo || 'richard.vass@vassco.sk',
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.message || `Resend API error ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, id: data.id });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
