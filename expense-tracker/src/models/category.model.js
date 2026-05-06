import db from "../config/db.js";

// Create category
export const createCategory = async (name, type) => {
  const res = await db.query(
    "INSERT INTO categories (name, type) VALUES ($1, $2) RETURNING *",
    [name, type]
  );
  return res.rows[0];
};

// Get all categories
export const getCategories = async () => {
  const res = await db.query("SELECT * FROM categories");
  return res.rows;
};

// Get categories by type
export const getCategoriesByType = async (type) => {
  const res = await db.query(
    "SELECT * FROM categories WHERE type = $1",
    [type]
  );
  return res.rows;
};