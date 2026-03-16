-- ═══════════════════════════════════════════════════════════════
-- VASSWEB BUSINESS APP — Supabase Schema
-- Spusti tento script v Supabase SQL Editor (supabase.com/dashboard)
-- ═══════════════════════════════════════════════════════════════

-- ─── Enable UUID extension ───────────────────────────────────
create extension if not exists "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════
-- CLIENTS
-- ═══════════════════════════════════════════════════════════════
create table if not exists clients (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  company     text not null default '',
  email       text not null default '',
  phone       text not null default '',
  notes       text not null default '',
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_clients_user_id on clients(user_id);
create index if not exists idx_clients_email on clients(email);

-- ═══════════════════════════════════════════════════════════════
-- PROJECTS
-- ═══════════════════════════════════════════════════════════════
create type project_status as enum (
  'konzultacia', 'navrh', 'vyvoj', 'testovanie', 'spusteny', 'pozastaveny'
);

create table if not exists projects (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  client_id   uuid references clients(id) on delete set null,
  name        text not null,
  description text not null default '',
  status      project_status not null default 'konzultacia',
  budget      numeric(12,2) not null default 0,
  spent       numeric(12,2) not null default 0,
  progress    integer not null default 0 check (progress >= 0 and progress <= 100),
  start_date  date,
  deadline    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_projects_user_id on projects(user_id);
create index if not exists idx_projects_client_id on projects(client_id);
create index if not exists idx_projects_status on projects(status);

-- ═══════════════════════════════════════════════════════════════
-- INVOICES
-- ═══════════════════════════════════════════════════════════════
create type invoice_status as enum (
  'draft', 'sent', 'paid', 'overdue', 'cancelled'
);

create table if not exists invoices (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  client_id   uuid references clients(id) on delete set null,
  project_id  uuid references projects(id) on delete set null,
  number      text not null,
  status      invoice_status not null default 'draft',
  amount      numeric(12,2) not null default 0,
  issued      date not null default current_date,
  due         date,
  notes       text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_invoices_user_id on invoices(user_id);
create index if not exists idx_invoices_client_id on invoices(client_id);
create index if not exists idx_invoices_status on invoices(status);
create unique index if not exists idx_invoices_number on invoices(user_id, number);

-- ═══════════════════════════════════════════════════════════════
-- INVOICE ITEMS
-- ═══════════════════════════════════════════════════════════════
create table if not exists invoice_items (
  id          uuid primary key default uuid_generate_v4(),
  invoice_id  uuid not null references invoices(id) on delete cascade,
  description text not null default '',
  quantity    numeric(10,2) not null default 1,
  unit_price  numeric(12,2) not null default 0,
  sort_order  integer not null default 0
);

create index if not exists idx_invoice_items_invoice_id on invoice_items(invoice_id);

-- ═══════════════════════════════════════════════════════════════
-- ACTIVITIES (audit log + notifications)
-- ═══════════════════════════════════════════════════════════════
create type activity_type as enum (
  'client_created', 'client_updated',
  'project_created', 'project_updated', 'project_status_changed',
  'invoice_created', 'invoice_sent', 'invoice_paid', 'invoice_overdue',
  'ai_suggestion', 'reminder', 'note'
);

create table if not exists activities (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  type        activity_type not null,
  title       text not null,
  description text not null default '',
  entity_type text,
  entity_id   uuid,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists idx_activities_user_id on activities(user_id);
create index if not exists idx_activities_is_read on activities(user_id, is_read) where not is_read;
create index if not exists idx_activities_entity on activities(entity_type, entity_id);

-- ═══════════════════════════════════════════════════════════════
-- AI CONVERSATIONS
-- ═══════════════════════════════════════════════════════════════
create table if not exists ai_conversations (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null default 'Nová konverzácia',
  messages    jsonb not null default '[]',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_ai_conversations_user_id on ai_conversations(user_id);

-- ═══════════════════════════════════════════════════════════════
-- USER SETTINGS
-- ═══════════════════════════════════════════════════════════════
create table if not exists user_settings (
  user_id              uuid primary key references auth.users(id) on delete cascade,
  company_name         text not null default '',
  company_email        text not null default '',
  company_phone        text not null default '',
  company_address      text not null default '',
  company_ico          text not null default '',
  company_dic          text not null default '',
  company_ic_dph       text not null default '',
  company_iban         text not null default '',
  invoice_prefix       text not null default 'VW',
  invoice_next_number  integer not null default 1,
  ai_model             text not null default 'gpt-4o-mini',
  notifications_enabled boolean not null default true,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════
-- AUTO-UPDATE updated_at TRIGGER
-- ═══════════════════════════════════════════════════════════════
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_clients_updated_at
  before update on clients for each row execute function update_updated_at();

create trigger trg_projects_updated_at
  before update on projects for each row execute function update_updated_at();

create trigger trg_invoices_updated_at
  before update on invoices for each row execute function update_updated_at();

create trigger trg_ai_conversations_updated_at
  before update on ai_conversations for each row execute function update_updated_at();

create trigger trg_user_settings_updated_at
  before update on user_settings for each row execute function update_updated_at();

-- ═══════════════════════════════════════════════════════════════
-- AUTO-DETECT OVERDUE INVOICES (runs daily via pg_cron or manually)
-- ═══════════════════════════════════════════════════════════════
create or replace function mark_overdue_invoices()
returns void as $$
begin
  update invoices
  set status = 'overdue'
  where status = 'sent'
    and due < current_date;
end;
$$ language plpgsql;

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- Každý user vidí len svoje dáta
-- ═══════════════════════════════════════════════════════════════
alter table clients enable row level security;
alter table projects enable row level security;
alter table invoices enable row level security;
alter table invoice_items enable row level security;
alter table activities enable row level security;
alter table ai_conversations enable row level security;
alter table user_settings enable row level security;

-- Clients
create policy "Users can view own clients"
  on clients for select using (auth.uid() = user_id);
create policy "Users can insert own clients"
  on clients for insert with check (auth.uid() = user_id);
create policy "Users can update own clients"
  on clients for update using (auth.uid() = user_id);
create policy "Users can delete own clients"
  on clients for delete using (auth.uid() = user_id);

-- Projects
create policy "Users can view own projects"
  on projects for select using (auth.uid() = user_id);
create policy "Users can insert own projects"
  on projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects"
  on projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects"
  on projects for delete using (auth.uid() = user_id);

-- Invoices
create policy "Users can view own invoices"
  on invoices for select using (auth.uid() = user_id);
create policy "Users can insert own invoices"
  on invoices for insert with check (auth.uid() = user_id);
create policy "Users can update own invoices"
  on invoices for update using (auth.uid() = user_id);
create policy "Users can delete own invoices"
  on invoices for delete using (auth.uid() = user_id);

-- Invoice Items (access via invoice ownership)
create policy "Users can view own invoice items"
  on invoice_items for select using (
    exists (select 1 from invoices where invoices.id = invoice_items.invoice_id and invoices.user_id = auth.uid())
  );
create policy "Users can insert own invoice items"
  on invoice_items for insert with check (
    exists (select 1 from invoices where invoices.id = invoice_items.invoice_id and invoices.user_id = auth.uid())
  );
create policy "Users can update own invoice items"
  on invoice_items for update using (
    exists (select 1 from invoices where invoices.id = invoice_items.invoice_id and invoices.user_id = auth.uid())
  );
create policy "Users can delete own invoice items"
  on invoice_items for delete using (
    exists (select 1 from invoices where invoices.id = invoice_items.invoice_id and invoices.user_id = auth.uid())
  );

-- Activities
create policy "Users can view own activities"
  on activities for select using (auth.uid() = user_id);
create policy "Users can insert own activities"
  on activities for insert with check (auth.uid() = user_id);
create policy "Users can update own activities"
  on activities for update using (auth.uid() = user_id);
create policy "Users can delete own activities"
  on activities for delete using (auth.uid() = user_id);

-- AI Conversations
create policy "Users can view own conversations"
  on ai_conversations for select using (auth.uid() = user_id);
create policy "Users can insert own conversations"
  on ai_conversations for insert with check (auth.uid() = user_id);
create policy "Users can update own conversations"
  on ai_conversations for update using (auth.uid() = user_id);
create policy "Users can delete own conversations"
  on ai_conversations for delete using (auth.uid() = user_id);

-- User Settings
create policy "Users can view own settings"
  on user_settings for select using (auth.uid() = user_id);
create policy "Users can insert own settings"
  on user_settings for insert with check (auth.uid() = user_id);
create policy "Users can update own settings"
  on user_settings for update using (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- AUTO-CREATE USER SETTINGS ON SIGNUP
-- ═══════════════════════════════════════════════════════════════
create or replace function create_user_settings()
returns trigger as $$
begin
  insert into user_settings (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_create_user_settings
  after insert on auth.users for each row execute function create_user_settings();
