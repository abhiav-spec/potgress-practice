import db from "../config/db.js";

// Create transaction
export const createTransaction = async (
  user_id,
  category_id,
  amount,
  type,
  note,
  transaction_date
) => {
  const res = await db.query(
    `INSERT INTO transactions 
     (user_id, category_id, amount, type, note, transaction_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [user_id, category_id, amount, type, note, transaction_date]
  );
  return res.rows[0];
};

// Get all transactions
export const getTransactions = async () => {
  const res = await db.query(`
    SELECT t.*, c.name AS category_name
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    ORDER BY t.transaction_date DESC
  `);
  return res.rows;
};

// Get transactions by user
export const getTransactionsByUser = async (user_id) => {
  const res = await db.query(
    `SELECT * FROM transactions 
     WHERE user_id = $1 
     ORDER BY transaction_date DESC`,
    [user_id]
  );
  return res.rows;
};

// Delete transaction
export const deleteTransaction = async (id) => {
  await db.query("DELETE FROM transactions WHERE id = $1", [id]);
};