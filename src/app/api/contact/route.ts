import { NextRequest, NextResponse } from 'next/server';

// Rate limiting: simple in-memory store (resets on cold start, which is fine for Vercel)
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3; // max 3 submissions
const RATE_WINDOW = 60 * 1000; // per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Príliš veľa požiadaviek. Skúste to znova neskôr.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Všetky polia sú povinné.' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Neplatná e-mailová adresa.' },
        { status: 400 }
      );
    }

    // Honeypot check (if present in body, it's a bot)
    if (body.website) {
      // Silently succeed for bots (they think it worked)
      return NextResponse.json({ success: true });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json(
        { error: 'Služba dočasne nedostupná. Kontaktujte nás na info@vassweb.sk.' },
        { status: 500 }
      );
    }

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vassweb Formulár <formular@vassweb.sk>',
        to: ['info@vassweb.sk'],
        reply_to: email,
        subject: `Nový dopyt od ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ffeebb, #d4a843); padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #0a0908; margin: 0; font-size: 20px;">Nový dopyt z vassweb.sk</h1>
            </div>
            <div style="background: #1a1918; padding: 24px; color: #ffffff; border-radius: 0 0 12px 12px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #d4a843; font-weight: 600; width: 80px;">Meno:</td>
                  <td style="padding: 8px 0; color: #ffffff;">${escapeHtml(name)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #d4a843; font-weight: 600;">E-mail:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #ffeebb;">${escapeHtml(email)}</a></td>
                </tr>
              </table>
              <hr style="border: none; border-top: 1px solid rgba(212,168,67,0.2); margin: 16px 0;" />
              <div style="color: rgba(255,255,255,0.8); line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</div>
            </div>
            <p style="color: #666; font-size: 11px; text-align: center; margin-top: 16px;">
              Odoslané z kontaktného formulára na vassweb.sk
            </p>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json().catch(() => ({}));
      console.error('Resend error:', JSON.stringify(errorData));

      // Try fallback with Resend default sender
      const fallbackResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Vassweb <onboarding@resend.dev>',
          to: ['richard.vass@vassco.sk'],
          reply_to: email,
          subject: `Nový dopyt od ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #ffeebb, #d4a843); padding: 24px; border-radius: 12px 12px 0 0;">
                <h1 style="color: #0a0908; margin: 0; font-size: 20px;">Nový dopyt z vassweb.sk</h1>
              </div>
              <div style="background: #1a1918; padding: 24px; color: #ffffff; border-radius: 0 0 12px 12px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #d4a843; font-weight: 600; width: 80px;">Meno:</td>
                    <td style="padding: 8px 0; color: #ffffff;">${escapeHtml(name)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #d4a843; font-weight: 600;">E-mail:</td>
                    <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #ffeebb;">${escapeHtml(email)}</a></td>
                  </tr>
                </table>
                <hr style="border: none; border-top: 1px solid rgba(212,168,67,0.2); margin: 16px 0;" />
                <div style="color: rgba(255,255,255,0.8); line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</div>
              </div>
            </div>
          `,
        }),
      });

      if (fallbackResponse.ok) {
        return NextResponse.json({ success: true });
      }

      const fallbackError = await fallbackResponse.json().catch(() => ({}));
      console.error('Resend fallback error:', JSON.stringify(fallbackError));
      return NextResponse.json(
        { error: 'Nepodarilo sa odoslať správu. Skúste to znova alebo nás kontaktujte na info@vassweb.sk.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Nastala chyba. Skúste to znova neskôr.' },
      { status: 500 }
    );
  }
}

// Prevent XSS in email HTML
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
