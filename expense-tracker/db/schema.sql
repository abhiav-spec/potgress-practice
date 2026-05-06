-- USERS TABLE
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CATEGORIES TABLE
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL
);

-- TRANSACTIONS TABLE
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  note TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_user
    FOREIGN KEY(user_id) REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_category
    FOREIGN KEY(category_id) REFERENCES categories(id)
);

-- BUDGETS TABLE
CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  limit_amount NUMERIC(10,2) NOT NULL CHECK (limit_amount > 0),
  month INT CHECK (month BETWEEN 1 AND 12),
  year INT CHECK (year >= 2000),

  CONSTRAINT fk_budget_user
    FOREIGN KEY(user_id) REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_budget_category
    FOREIGN KEY(category_id) REFERENCES categories(id)
);


CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);