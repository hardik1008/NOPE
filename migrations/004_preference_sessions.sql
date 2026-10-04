CREATE TABLE IF NOT EXISTS nope_sessions (
  session_id text PRIMARY KEY,
  user_id text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now()
)