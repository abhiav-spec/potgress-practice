// server/models/transaction.model.js

import db from "../config/db.js";


// CREATE NEW TRANSACTION
export const createTransaction = async ({
  user_id,
  amount,
  status,
  razorpay_order_id
}) => {

  const query = `
    INSERT INTO transactions
    (
      user_id,
      amount,
      status,
      razorpay_order_id
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [
    user_id,
    amount,
    status,
    razorpay_order_id
  ];

  const res = await db.query(query, values);

  return res.rows[0];
};



// UPDATE TRANSACTION AFTER SUCCESSFUL PAYMENT
export const updateTransactionSuccess = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
}) => {

  const query = `
    UPDATE transactions
    SET
      status = 'success',
      razorpay_payment_id = $1,
      razorpay_signature = $2
    WHERE razorpay_order_id = $3
    RETURNING *
  `;

  const values = [
    razorpay_payment_id,
    razorpay_signature,
    razorpay_order_id
  ];

  const res = await db.query(query, values);

  return res.rows[0];
};



// UPDATE TRANSACTION AS FAILED
export const updateTransactionFailed = async (
  razorpay_order_id
) => {

  const query = `
    UPDATE transactions
    SET status = 'failed'
    WHERE razorpay_order_id = $1
    RETURNING *
  `;

  const values = [razorpay_order_id];

  const res = await db.query(query, values);

  return res.rows[0];
};



// GET ALL TRANSACTIONS
export const getAllTransactions = async () => {

  const query = `
    SELECT *
    FROM transactions
    ORDER BY created_at DESC
  `;

  const res = await db.query(query);

  return res.rows;
};



// GET TRANSACTION BY ORDER ID
export const getTransactionByOrderId = async (
  razorpay_order_id
) => {

  const query = `
    SELECT *
    FROM transactions
    WHERE razorpay_order_id = $1
  `;

  const values = [razorpay_order_id];

  const res = await db.query(query, values);

  return res.rows[0];
};



// GET USER TRANSACTIONS
export const getTransactionsByUser = async (
  user_id
) => {

  const query = `
    SELECT *
    FROM transactions
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;

  const values = [user_id];

  const res = await db.query(query, values);

  return res.rows;
};