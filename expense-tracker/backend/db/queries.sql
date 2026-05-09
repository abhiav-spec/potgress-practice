-- =====================================================
-- USERS
-- =====================================================

-- Get all users
SELECT * FROM users;

-- Get user by email
SELECT * FROM users
WHERE email = 'abhinav@test.com';

-- Count total users
SELECT COUNT(*) AS total_users
FROM users;

-- =====================================================
-- CATEGORIES
-- =====================================================

-- Get all categories
SELECT * FROM categories;

-- Get only expense categories
SELECT * FROM categories
WHERE type = 'expense';

-- Get only income categories
SELECT * FROM categories
WHERE type = 'income';

-- Count categories
SELECT COUNT(*) AS total_categories
FROM categories;

-- =====================================================
-- TRANSACTIONS
-- =====================================================

-- Get all transactions
SELECT * FROM transactions;

-- Get transactions of a specific user
SELECT * FROM transactions
WHERE user_id = 1;

-- Get all expense transactions
SELECT * FROM transactions
WHERE type = 'expense';

-- Get all income transactions
SELECT * FROM transactions
WHERE type = 'income';

-- Get recent transactions
SELECT *
FROM transactions
ORDER BY created_at DESC
LIMIT 10;

-- Get transactions between dates
SELECT *
FROM transactions
WHERE transaction_date
BETWEEN '2026-05-01' AND '2026-05-31';

-- =====================================================
-- JOINS
-- =====================================================

-- Get transactions with category names
SELECT
    t.id,
    t.amount,
    t.type,
    t.note,
    t.transaction_date,
    c.name AS category_name
FROM transactions t
JOIN categories c
ON t.category_id = c.id;

-- Get transactions with user names
SELECT
    t.id,
    u.name AS user_name,
    t.amount,
    t.type,
    t.transaction_date
FROM transactions t
JOIN users u
ON t.user_id = u.id;

-- Full transaction details
SELECT
    t.id,
    u.name AS user_name,
    c.name AS category_name,
    t.amount,
    t.type,
    t.note,
    t.transaction_date
FROM transactions t
JOIN users u
ON t.user_id = u.id
JOIN categories c
ON t.category_id = c.id
ORDER BY t.transaction_date DESC;

-- =====================================================
-- AGGREGATION QUERIES
-- =====================================================

-- Total income of a user
SELECT
    SUM(amount) AS total_income
FROM transactions
WHERE user_id = 1
AND type = 'income';

-- Total expense of a user
SELECT
    SUM(amount) AS total_expense
FROM transactions
WHERE user_id = 1
AND type = 'expense';

-- Net balance of a user
SELECT
    SUM(
        CASE
            WHEN type = 'income' THEN amount
            ELSE -amount
        END
    ) AS balance
FROM transactions
WHERE user_id = 1;

-- Average expense amount
SELECT
    AVG(amount) AS average_expense
FROM transactions
WHERE type = 'expense';

-- Highest expense
SELECT
    MAX(amount) AS highest_expense
FROM transactions
WHERE type = 'expense';

-- Lowest expense
SELECT
    MIN(amount) AS lowest_expense
FROM transactions
WHERE type = 'expense';

-- =====================================================
-- GROUP BY QUERIES
-- =====================================================

-- Category-wise expenses
SELECT
    c.name AS category,
    SUM(t.amount) AS total_spent
FROM transactions t
JOIN categories c
ON t.category_id = c.id
WHERE t.type = 'expense'
GROUP BY c.name
ORDER BY total_spent DESC;

-- Category-wise income
SELECT
    c.name AS category,
    SUM(t.amount) AS total_income
FROM transactions t
JOIN categories c
ON t.category_id = c.id
WHERE t.type = 'income'
GROUP BY c.name
ORDER BY total_income DESC;

-- Monthly expense summary
SELECT
    EXTRACT(MONTH FROM transaction_date) AS month,
    SUM(amount) AS total_expense
FROM transactions
WHERE type = 'expense'
GROUP BY month
ORDER BY month;

-- Monthly income summary
SELECT
    EXTRACT(MONTH FROM transaction_date) AS month,
    SUM(amount) AS total_income
FROM transactions
WHERE type = 'income'
GROUP BY month
ORDER BY month;

-- User-wise total expenses
SELECT
    u.name,
    SUM(t.amount) AS total_expense
FROM users u
JOIN transactions t
ON u.id = t.user_id
WHERE t.type = 'expense'
GROUP BY u.name;

-- =====================================================
-- BUDGET QUERIES
-- =====================================================

-- Get all budgets
SELECT * FROM budgets;

-- Get budgets of a user
SELECT *
FROM budgets
WHERE user_id = 1;

-- Budget with category names
SELECT
    b.id,
    c.name AS category_name,
    b.limit_amount,
    b.month,
    b.year
FROM budgets b
JOIN categories c
ON b.category_id = c.id;

-- Budget vs spending
SELECT
    c.name AS category,
    b.limit_amount,
    COALESCE(SUM(t.amount), 0) AS spent,
    b.limit_amount - COALESCE(SUM(t.amount), 0) AS remaining
FROM budgets b
JOIN categories c
ON b.category_id = c.id
LEFT JOIN transactions t
ON t.category_id = b.category_id
AND t.user_id = b.user_id
WHERE b.user_id = 1
GROUP BY c.name, b.limit_amount;

-- Categories where spending exceeded budget
SELECT
    c.name AS category,
    b.limit_amount,
    SUM(t.amount) AS spent
FROM budgets b
JOIN categories c
ON b.category_id = c.id
JOIN transactions t
ON t.category_id = b.category_id
AND t.user_id = b.user_id
WHERE t.type = 'expense'
GROUP BY c.name, b.limit_amount
HAVING SUM(t.amount) > b.limit_amount;

-- =====================================================
-- ADVANCED QUERIES
-- =====================================================

-- Top 5 highest expenses
SELECT *
FROM transactions
WHERE type = 'expense'
ORDER BY amount DESC
LIMIT 5;

-- Top spending categories
SELECT
    c.name,
    SUM(t.amount) AS total
FROM transactions t
JOIN categories c
ON t.category_id = c.id
WHERE t.type = 'expense'
GROUP BY c.name
ORDER BY total DESC
LIMIT 5;

-- Users who spent more than 5000
SELECT
    u.name,
    SUM(t.amount) AS total_spent
FROM users u
JOIN transactions t
ON u.id = t.user_id
WHERE t.type = 'expense'
GROUP BY u.name
HAVING SUM(t.amount) > 5000;

-- Transactions count by type
SELECT
    type,
    COUNT(*) AS total_transactions
FROM transactions
GROUP BY type;

-- =====================================================
-- INDEX TESTING
-- =====================================================

-- Check transactions by indexed user_id
SELECT *
FROM transactions
WHERE user_id = 1;

-- Check transactions by indexed transaction_date
SELECT *
FROM transactions
WHERE transaction_date = '2026-05-07';

-- =====================================================
-- DELETE TESTING
-- =====================================================

-- Delete transaction by ID
DELETE FROM transactions
WHERE id = 1;

-- Delete category by ID
DELETE FROM categories
WHERE id = 1;

-- Delete budget by ID
DELETE FROM budgets
WHERE id = 1;

-- Delete user by ID
-- This will also delete related transactions and budgets
-- because of ON DELETE CASCADE
DELETE FROM users
WHERE id = 1;