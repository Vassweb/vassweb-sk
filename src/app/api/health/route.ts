import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function GET() {
  const checks: Record<string, string> = {};

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/clients?select=id&limit=1`, {
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Accept-Profile': 'public' },
    });
    checks.supabase = res.ok ? 'ok' : `error (${res.status})`;
  } catch {
    checks.supabase = 'unreachable';
  }

  checks.env_supabase_url = SUPABASE_URL ? 'set' : 'missing';
  checks.env_supabase_key = SUPABASE_ANON_KEY ? 'set' : 'missing';
  checks.env_anthropic = process.env.ANTHROPIC_API_KEY ? 'set' : 'missing';
  checks.env_resend = process.env.RESEND_API_KEY ? 'set' : 'missing';
  checks.env_cron_secret = process.env.CRON_SECRET ? 'set' : 'missing';

  const allOk = checks.supabase === 'ok' && !Object.values(checks).includes('missing');

  return NextResponse.json({
    status: allOk ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    version: '0.8.0',
    checks,
  }, { status: allOk ? 200 : 503 });
}
