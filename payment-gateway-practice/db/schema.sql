CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,

  user_id INT NOT NULL,

  amount NUMERIC(10,2) NOT NULL,

  status VARCHAR(50) NOT NULL,

  razorpay_order_id TEXT UNIQUE,

  razorpay_payment_id TEXT,

  razorpay_signature TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE payments (

  id SERIAL PRIMARY KEY,

  transaction_id INT NOT NULL,

  razorpay_payment_id TEXT UNIQUE NOT NULL,

  razorpay_order_id TEXT NOT NULL,

  razorpay_signature TEXT NOT NULL,

  payment_method VARCHAR(50),

  payment_status VARCHAR(50),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);