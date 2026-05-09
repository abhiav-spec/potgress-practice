import pool from '../config/db.js';

export const listTransactions = async (req, res) => {
  try{
    const { rows } = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
    res.json(rows);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}

export const createTransaction = async (req, res) => {
  try{
    const { order_id, amount, status } = req.body;
    const { rows } = await pool.query('INSERT INTO transactions (order_id, amount, status) VALUES ($1,$2,$3) RETURNING *', [order_id, amount, status]);
    res.status(201).json(rows[0]);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}
