-- ═══════════════════════════════════════════════════════════════
-- VASSWEB APP — Etapa 4: Notifications Table
-- ═══════════════════════════════════════════════════════════════

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast unread queries
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Allow service role (cron jobs) to insert notifications without user_id check
CREATE POLICY "Service role can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (TRUE);

-- Add automation_settings columns to user_settings (if not exists)
DO $$ BEGIN
  ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS auto_invoices BOOLEAN DEFAULT TRUE;
  ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS auto_emails BOOLEAN DEFAULT TRUE;
  ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS daily_digest BOOLEAN DEFAULT TRUE;
  ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS weekly_digest BOOLEAN DEFAULT TRUE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Comment
COMMENT ON TABLE notifications IS 'In-app notification system for automated alerts';
