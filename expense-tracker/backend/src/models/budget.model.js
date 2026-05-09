import db from "../config/db.js";

//create budget
export const createBudget = async (user_id, amount, month, year) => {
  const result = await db.query(
    `INSERT INTO budgets
    (user_id, category_id, limit_amount, month, year)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [user_id, category_id, amount, month, year]
  );
  return result.rows[0];
}

//get all budgets
export const getAllBudgets = async () => {
  const result = await db.query(
    "SELECT * FROM budgets ORDER BY id DESC"
  );
  return result.rows;
}

//get budgets by user

export const getBudgetsByUser = async (user_id) => {
  const result = await db.query(
    `SELECT b.*, c.name AS category_name
     FROM budgets b
     JOIN categories c
     ON b.category_id = c.id
     WHERE b.user_id = $1
     ORDER BY b.month DESC, b.year DESC`,
    [user_id]
  );
  return result.rows;
}

//delete budget
export const deleteBudget = async (id) => {
  await db.query(
    "DELETE FROM budgets WHERE id = $1",
    [id]
  );
}