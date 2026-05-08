import db from "../config/db.js";

// Create category
export const createCategory = async (name, type) => {
  const result = await db.query(
    `INSERT INTO categories (name, type)
     VALUES ($1, $2)
     RETURNING *`,
    [name, type]
  );

  return result.rows[0];
};

// Get all categories
export const getAllCategories = async () => {
  const result = await db.query(
    "SELECT * FROM categories ORDER BY id DESC"
  );

  return result.rows;
};

// Get categories by type (income/expense)
export const getCategoriesByType = async (type) => {
  const result = await db.query(
    "SELECT * FROM categories WHERE type = $1",
    [type]
  );

  return result.rows;
};

// Delete category
export const deleteCategory = async (id) => {
  await db.query(
    "DELETE FROM categories WHERE id = $1",
    [id]
  );
};