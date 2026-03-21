import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function supaFetch(path: string, options: { method?: string; body?: unknown; headers?: Record<string, string> } = {}) {
  const { method = 'GET', body, headers = {} } = options;
  return fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    method,
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Accept-Profile': 'public',
      'Content-Profile': 'public',
      'Prefer': method !== 'GET' ? 'return=representation' : '',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

// GET: Fetch notifications (with optional unread filter)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread') === 'true';
    const limit = searchParams.get('limit') || '50';

    let query = `/notifications?select=*&order=created_at.desc&limit=${limit}`;
    if (unreadOnly) query += '&is_read=eq.false';

    const res = await supaFetch(query);
    const notifications = await res.json();

    // Also get unread count
    const countRes = await supaFetch('/notifications?is_read=eq.false&select=id');
    const unread = await countRes.json();

    return NextResponse.json({
      notifications: Array.isArray(notifications) ? notifications : [],
      unreadCount: Array.isArray(unread) ? unread.length : 0,
    });
  } catch (error) {
    console.error('Notifications GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Create notification
export async function POST(request: Request) {
  try {
    const { type, title, message } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    const res = await supaFetch('/notifications', {
      method: 'POST',
      body: {
        type: type || 'info',
        title,
        message: message || '',
        is_read: false,
      },
    });

    const data = await res.json();
    return NextResponse.json({ success: true, notification: Array.isArray(data) ? data[0] : data });
  } catch (error) {
    console.error('Notifications POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH: Mark notifications as read
export async function PATCH(request: Request) {
  try {
    const { id, markAll } = await request.json();

    if (markAll) {
      await supaFetch('/notifications?is_read=eq.false', {
        method: 'PATCH',
        body: { is_read: true },
      });
      return NextResponse.json({ success: true, message: 'All marked as read' });
    }

    if (id) {
      await supaFetch(`/notifications?id=eq.${id}`, {
        method: 'PATCH',
        body: { is_read: true },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Provide id or markAll: true' }, { status: 400 });
  } catch (error) {
    console.error('Notifications PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
