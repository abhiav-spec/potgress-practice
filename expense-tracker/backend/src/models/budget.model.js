import db from "../config/db.js";

// Create budget
export const createBudget = async (
  user_id,
  category_id,
  limit_amount,
  month,
  year
) => {
  const res = await db.query(
    `INSERT INTO budgets 
     (user_id, category_id, limit_amount, month, year)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [user_id, category_id, limit_amount, month, year]
  );
  return res.rows[0];
};

// Get budgets for user
export const getBudgetsByUser = async (user_id) => {
  const res = await db.query(
    "SELECT * FROM budgets WHERE user_id = $1",
    [user_id]
  );
  return res.rows;
};