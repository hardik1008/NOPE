ALTER TABLE nope_preferences ADD COLUMN IF NOT EXISTS session_id text;
ALTER TABLE nope_preferences ADD COLUMN IF NOT EXISTS source text DEFAULT 'agent';
ALTER TABLE nope_preferences ADD COLUMN IF NOT EXISTS signal_type text DEFAULT 'explicit';