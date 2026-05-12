import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});



/**
 * Create Razorpay Order
 *
 * @param {Object} options
 *
 * @returns {Promise<Object>}
 */
export const createOrder = async (
  options
) => {

  const order =
    await razorpay.orders.create(
      options
    );

  return order;
};





/**
 * Verify Razorpay Signature
 *
 * @param {Object} paymentData
 *
 * @returns {boolean}
 */
export const verifySignature = ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
}) => {

  const body =
    `${razorpay_order_id}|${razorpay_payment_id}`;


  const expectedSignature =
    crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body.toString())
      .digest("hex");


  return (
    expectedSignature ===
    razorpay_signature
  );
};