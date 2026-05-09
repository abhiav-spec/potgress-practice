-- payments/orders table
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  order_id TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  order_id TEXT,
  amount NUMERIC(10,2),
  status TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
