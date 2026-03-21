-- ═══════════════════════════════════════════════════════════
-- VASSWEB APP — Etapa 3: Úlohy, Ponuky, Kalendár, Dokumenty
-- ═══════════════════════════════════════════════════════════

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  title text NOT NULL,
  description text DEFAULT '',
  status text DEFAULT 'nova' CHECK (status IN ('nova','v_procese','hotova','zrusena')),
  priority text DEFAULT 'stredna' CHECK (priority IN ('nizka','stredna','vysoka','urgentna')),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);

-- Quotes
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  number text NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft','sent','accepted','rejected','invoiced')),
  amount numeric(12,2) DEFAULT 0,
  valid_until date,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own quotes" ON quotes FOR ALL USING (auth.uid() = user_id);

-- Quote Items
CREATE TABLE IF NOT EXISTS quote_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid REFERENCES quotes(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  quantity numeric(10,2) DEFAULT 1,
  unit_price numeric(12,2) DEFAULT 0,
  sort_order int DEFAULT 0
);
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own quote items" ON quote_items FOR ALL
  USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = quote_items.quote_id AND quotes.user_id = auth.uid()));

-- Calendar Events
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  title text NOT NULL,
  description text DEFAULT '',
  type text DEFAULT 'meeting' CHECK (type IN ('meeting','deadline','followup','reminder')),
  date date NOT NULL,
  time text,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own events" ON calendar_events FOR ALL USING (auth.uid() = user_id);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  name text NOT NULL,
  file_url text NOT NULL,
  file_size bigint DEFAULT 0,
  category text DEFAULT 'podklady' CHECK (category IN ('zmluva','ponuka','faktura','podklady','assets')),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own documents" ON documents FOR ALL USING (auth.uid() = user_id);

-- Storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Users upload own docs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users read own docs" ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own docs" ON storage.objects FOR DELETE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
