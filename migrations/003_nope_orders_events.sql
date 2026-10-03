CREATE TABLE IF NOT EXISTS nope_orders (
  order_id text PRIMARY KEY,
  user_id text NOT NULL,
  product_id text,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  state text NOT NULL DEFAULT 'DISCOVERED',
  payment_status text NOT NULL DEFAULT 'PENDING',
  shipment_waybill text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
)