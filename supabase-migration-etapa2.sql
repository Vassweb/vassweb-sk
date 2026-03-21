-- ═══════════════════════════════════════════════════════════════
-- VASSWEB ETAPA 2 — Migrácia pre automatizáciu a email
-- Spusti v Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ─── Nové stĺpce pre user_settings (automatizácia) ──────────
ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS auto_followup_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS auto_followup_days integer NOT NULL DEFAULT 7,
  ADD COLUMN IF NOT EXISTS deadline_reminder_days integer NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS daily_report_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_signature text NOT NULL DEFAULT '';

-- ─── Email templates tabuľka ─────────────────────────────────
CREATE TABLE IF NOT EXISTS email_templates (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  subject     text NOT NULL DEFAULT '',
  body        text NOT NULL DEFAULT '',
  category    text NOT NULL DEFAULT 'general',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_templates_user_id ON email_templates(user_id);

-- RLS pre email_templates
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own templates"
  ON email_templates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own templates"
  ON email_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own templates"
  ON email_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own templates"
  ON email_templates FOR DELETE USING (auth.uid() = user_id);

-- Trigger pre updated_at
CREATE TRIGGER trg_email_templates_updated_at
  BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Sent emails log ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sent_emails (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id   uuid REFERENCES clients(id) ON DELETE SET NULL,
  to_email    text NOT NULL,
  subject     text NOT NULL,
  status      text NOT NULL DEFAULT 'sent',
  resend_id   text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sent_emails_user_id ON sent_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_sent_emails_client_id ON sent_emails(client_id);

-- RLS pre sent_emails
ALTER TABLE sent_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sent emails"
  ON sent_emails FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sent emails"
  ON sent_emails FOR INSERT WITH CHECK (auth.uid() = user_id);
