import db from "../config/db.js";

// Create user
export const createUser = async (name, email) => {
  const res = await db.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
  return res.rows[0];
};

// Get all users
export const getAllUsers = async () => {
  const res = await db.query("SELECT * FROM users");
  return res.rows;
};

// Get user by id
export const getUserById = async (id) => {
  const res = await db.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return res.rows[0];
};

// Get user by email
export const getUserByEmail = async (email) => {
  const res = await db.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return res.rows[0];
};

// Delete user
export const deleteUser = async (id) => {
  await db.query("DELETE FROM users WHERE id = $1", [id]);
};