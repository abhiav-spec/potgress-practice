-- USERS
INSERT INTO users (name, email) VALUES
('Abhinav Kumar', 'abhinav@gmail.com'),
('Rahul Sharma', 'rahul@gmail.com'),
('Priya Singh', 'priya@gmail.com');

-- CATEGORIES
INSERT INTO categories (name, type) VALUES
('Food', 'expense'),
('Travel', 'expense'),
('Shopping', 'expense'),
('Salary', 'income'),
('Freelancing', 'income');

-- TRANSACTIONS
INSERT INTO transactions (user_id, category_id, amount, type, note, transaction_date) VALUES
(1, 4, 50000, 'income', 'Monthly salary', '2026-05-01'),
(1, 1, 500, 'expense', 'Lunch', '2026-05-02'),
(1, 2, 2000, 'expense', 'Bus travel', '2026-05-03'),
(1, 3, 3000, 'expense', 'Clothes', '2026-05-04'),

(2, 4, 40000, 'income', 'Salary', '2026-05-01'),
(2, 1, 700, 'expense', 'Dinner', '2026-05-02'),

(3, 5, 15000, 'income', 'Freelance project', '2026-05-01'),
(3, 1, 300, 'expense', 'Snacks', '2026-05-02');

-- BUDGETS
INSERT INTO budgets (user_id, category_id, limit_amount, month, year) VALUES
(1, 1, 5000, 5, 2026),
(1, 2, 3000, 5, 2026),
(2, 1, 4000, 5, 2026),
(3, 1, 2000, 5, 2026);