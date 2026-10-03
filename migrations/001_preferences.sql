CREATE TABLE IF NOT EXISTS nope_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  preference TEXT NOT NULL,
  value TEXT NOT NULL,
  reason TEXT,
  confidence TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);