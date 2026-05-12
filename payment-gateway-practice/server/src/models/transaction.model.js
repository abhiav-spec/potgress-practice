// server/models/payment.model.js

import db from "../config/db.js";


/**
 * Save payment details after successful payment verification
 * 
 * @param {Object} paymentData
 * @param {number} paymentData.transaction_id
 * @param {string} paymentData.razorpay_payment_id
 * @param {string} paymentData.razorpay_order_id
 * @param {string} paymentData.razorpay_signature
 * @param {string} paymentData.payment_method
 * @param {string} paymentData.payment_status
 * 
 * @returns {Object} Created payment record
 */
export const createPayment = async ({
  transaction_id,
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
  payment_method,
  payment_status
}) => {

  const query = `
    INSERT INTO payments
    (
      transaction_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      payment_method,
      payment_status
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const values = [
    transaction_id,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    payment_method,
    payment_status
  ];

  const res = await db.query(query, values);

  return res.rows[0];
};



/**
 * Get payment by Razorpay payment ID
 * 
 * @param {string} razorpay_payment_id
 * 
 * @returns {Object} Payment details
 */
export const getPaymentByPaymentId = async (
  razorpay_payment_id
) => {

  const query = `
    SELECT *
    FROM payments
    WHERE razorpay_payment_id = $1
  `;

  const values = [razorpay_payment_id];

  const res = await db.query(query, values);

  return res.rows[0];
};




/**
 * Get all payments
 * 
 * @returns {Array} List of all payments
 */
export const getAllPayments = async () => {

  const query = `
    SELECT *
    FROM payments
    ORDER BY created_at DESC
  `;

  const res = await db.query(query);

  return res.rows;
};