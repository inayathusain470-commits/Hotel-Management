-- Create food_orders table
CREATE TABLE IF NOT EXISTS food_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  room VARCHAR(50),
  phone VARCHAR(20),
  items JSONB,
  total NUMERIC,
  payment_method VARCHAR(50),
  payment_txn_id VARCHAR(255),
  payment_reference VARCHAR(255),
  payment JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_food_orders_customer_email ON food_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_food_orders_status ON food_orders(status);
CREATE INDEX IF NOT EXISTS idx_food_orders_created_at ON food_orders(created_at DESC);
