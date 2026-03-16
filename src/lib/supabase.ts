/* ═══════════════════════════════════════════════════════════════
   VASSWEB — Supabase Client (fetch-based, no SDK needed)
   ═══════════════════════════════════════════════════════════════ */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// ─── Types ───────────────────────────────────────────────────
export type ProjectStatus = 'konzultacia' | 'navrh' | 'vyvoj' | 'testovanie' | 'spusteny' | 'pozastaveny';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type ActivityType =
  | 'client_created' | 'client_updated'
  | 'project_created' | 'project_updated' | 'project_status_changed'
  | 'invoice_created' | 'invoice_sent' | 'invoice_paid' | 'invoice_overdue'
  | 'ai_suggestion' | 'reminder' | 'note';

export interface Client {
  id: string;
  user_id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  client_id: string | null;
  name: string;
  description: string;
  status: ProjectStatus;
  budget: number;
  spent: number;
  progress: number;
  start_date: string | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  client_id: string | null;
  project_id: string | null;
  number: string;
  status: InvoiceStatus;
  amount: number;
  issued: string;
  due: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  sort_order: number;
}

export interface Activity {
  id: string;
  user_id: string;
  type: ActivityType;
  title: string;
  description: string;
  entity_type: string | null;
  entity_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface AIConversation {
  id: string;
  user_id: string;
  messages: { role: 'user' | 'assistant' | 'system'; content: string; timestamp: string }[];
  title: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  user_id: string;
  company_name: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  company_ico: string;
  company_dic: string;
  company_ic_dph: string;
  company_iban: string;
  invoice_prefix: string;
  invoice_next_number: number;
  ai_model: string;
  notifications_enabled: boolean;
}

// ─── Auth Session Management ─────────────────────────────────
let accessToken: string | null = null;
let refreshToken: string | null = null;

function setSession(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  if (typeof window !== 'undefined') {
    localStorage.setItem('vw-access-token', access);
    localStorage.setItem('vw-refresh-token', refresh);
  }
}

function getSession() {
  if (!accessToken && typeof window !== 'undefined') {
    accessToken = localStorage.getItem('vw-access-token');
    refreshToken = localStorage.getItem('vw-refresh-token');
  }
  return { accessToken, refreshToken };
}

function clearSession() {
  accessToken = null;
  refreshToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('vw-access-token');
    localStorage.removeItem('vw-refresh-token');
  }
}

// ─── Core Fetch Helper ───────────────────────────────────────
async function supaFetch<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
    isAuth?: boolean;
  } = {}
): Promise<{ data: T | null; error: string | null }> {
  const { method = 'GET', body, headers = {}, isAuth = false } = options;
  const baseUrl = isAuth ? `${SUPABASE_URL}/auth/v1` : `${SUPABASE_URL}/rest/v1`;
  const session = getSession();

  const reqHeaders: Record<string, string> = {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    ...headers,
  };

  if (session.accessToken && !isAuth) {
    reqHeaders['Authorization'] = `Bearer ${session.accessToken}`;
  }

  // For Supabase REST: prefer=return=representation to get back inserted/updated rows
  if ((method === 'POST' || method === 'PATCH') && !isAuth) {
    reqHeaders['Prefer'] = 'return=representation';
  }

  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: reqHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      return { data: null, error: errBody.message || errBody.error_description || errBody.msg || `Error ${res.status}` };
    }

    // DELETE may return empty
    if (res.status === 204) return { data: null, error: null };

    const data = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Network error' };
  }
}

// ─── Auth ────────────────────────────────────────────────────
export const auth = {
  async signUp(email: string, password: string) {
    const result = await supaFetch<{ access_token: string; refresh_token: string; user: { id: string; email: string } }>('/signup', {
      method: 'POST',
      body: { email, password },
      isAuth: true,
    });
    if (result.data?.access_token) {
      setSession(result.data.access_token, result.data.refresh_token);
    }
    return result;
  },

  async signIn(email: string, password: string) {
    const result = await supaFetch<{ access_token: string; refresh_token: string; user: { id: string; email: string } }>(
      '/token?grant_type=password',
      { method: 'POST', body: { email, password }, isAuth: true }
    );
    if (result.data?.access_token) {
      setSession(result.data.access_token, result.data.refresh_token);
    }
    return result;
  },

  async signOut() {
    const session = getSession();
    if (session.accessToken) {
      await supaFetch('/logout', {
        method: 'POST',
        isAuth: true,
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
    }
    clearSession();
  },

  async refreshSession() {
    const session = getSession();
    if (!session.refreshToken) return { data: null, error: 'No refresh token' };
    const result = await supaFetch<{ access_token: string; refresh_token: string }>(
      '/token?grant_type=refresh_token',
      { method: 'POST', body: { refresh_token: session.refreshToken }, isAuth: true }
    );
    if (result.data?.access_token) {
      setSession(result.data.access_token, result.data.refresh_token);
    }
    return result;
  },

  async getUser() {
    const session = getSession();
    if (!session.accessToken) return { data: null, error: 'Not authenticated' };
    return supaFetch<{ id: string; email: string }>('/user', {
      isAuth: true,
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
  },

  isAuthenticated() {
    return !!getSession().accessToken;
  },
};

// ─── Database CRUD ───────────────────────────────────────────
function createTable<T>(table: string) {
  return {
    async getAll(query = ''): Promise<{ data: T[] | null; error: string | null }> {
      return supaFetch<T[]>(`/${table}?select=*&order=created_at.desc${query ? '&' + query : ''}`);
    },

    async getById(id: string): Promise<{ data: T | null; error: string | null }> {
      const result = await supaFetch<T[]>(`/${table}?id=eq.${id}&select=*`);
      return { data: result.data?.[0] || null, error: result.error };
    },

    async create(data: Partial<T>): Promise<{ data: T | null; error: string | null }> {
      const result = await supaFetch<T[]>(`/${table}`, { method: 'POST', body: data });
      return { data: result.data?.[0] || null, error: result.error };
    },

    async update(id: string, data: Partial<T>): Promise<{ data: T | null; error: string | null }> {
      const result = await supaFetch<T[]>(`/${table}?id=eq.${id}`, { method: 'PATCH', body: data });
      return { data: result.data?.[0] || null, error: result.error };
    },

    async delete(id: string): Promise<{ error: string | null }> {
      return supaFetch(`/${table}?id=eq.${id}`, { method: 'DELETE' });
    },

    async count(query = ''): Promise<number> {
      const result = await supaFetch<T[]>(`/${table}?select=id${query ? '&' + query : ''}`, {
        headers: { Prefer: 'count=exact' },
      });
      return Array.isArray(result.data) ? result.data.length : 0;
    },
  };
}

export const db = {
  clients: createTable<Client>('clients'),
  projects: createTable<Project>('projects'),
  invoices: createTable<Invoice>('invoices'),
  invoiceItems: createTable<InvoiceItem>('invoice_items'),
  activities: createTable<Activity>('activities'),
  aiConversations: createTable<AIConversation>('ai_conversations'),

  settings: {
    async get(): Promise<{ data: UserSettings | null; error: string | null }> {
      const result = await supaFetch<UserSettings[]>('/user_settings?select=*');
      return { data: result.data?.[0] || null, error: result.error };
    },
    async upsert(data: Partial<UserSettings>): Promise<{ data: UserSettings | null; error: string | null }> {
      const result = await supaFetch<UserSettings[]>('/user_settings', {
        method: 'POST',
        body: data,
        headers: { Prefer: 'return=representation,resolution=merge-duplicates' },
      });
      return { data: result.data?.[0] || null, error: result.error };
    },
  },

  // Utility: get items for an invoice
  async getInvoiceItems(invoiceId: string) {
    return supaFetch<InvoiceItem[]>(`/invoice_items?invoice_id=eq.${invoiceId}&select=*&order=sort_order.asc`);
  },

  // Utility: get unread activities count
  async getUnreadCount() {
    const result = await supaFetch<Activity[]>('/activities?is_read=eq.false&select=id');
    return Array.isArray(result.data) ? result.data.length : 0;
  },

  // Utility: mark activities as read
  async markActivitiesRead() {
    return supaFetch('/activities?is_read=eq.false', {
      method: 'PATCH',
      body: { is_read: true },
    });
  },
};

// ─── Real-time Subscriptions (SSE via Supabase Realtime) ─────
export function subscribeToTable(
  table: string,
  callback: (event: { type: string; record: unknown }) => void
) {
  // Supabase realtime uses WebSocket. We'll use polling as a simpler alternative
  // since we can't install the SDK. Poll every 5 seconds.
  let lastCheck = new Date().toISOString();
  let active = true;

  const poll = async () => {
    if (!active || !auth.isAuthenticated()) return;
    try {
      const result = await supaFetch<Array<{ id: string; updated_at: string }>>(`/${table}?updated_at=gt.${lastCheck}&select=id,updated_at&order=updated_at.desc&limit=20`);
      if (result.data && result.data.length > 0) {
        lastCheck = new Date().toISOString();
        result.data.forEach(record => callback({ type: 'UPDATE', record }));
      }
    } catch {}
    if (active) setTimeout(poll, 5000);
  };

  setTimeout(poll, 5000);

  return () => { active = false; };
}

// ─── Check if Supabase is configured ────────────────────────
export function isSupabaseConfigured(): boolean {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
}
