CREATE TABLE IF NOT EXISTS nope_shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text,
  waybill text NOT NULL,
  status text NOT NULL DEFAULT 'Manifested',
  created_at timestamptz NOT NULL DEFAULT now()
);