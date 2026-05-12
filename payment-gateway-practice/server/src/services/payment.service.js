import {
  createOrder,
  verifySignature
} from "./razorpay.service.js";



/**
 * Create Payment Order
 */
export const createRazorpayOrder =
  async (amount) => {

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };


    return await createOrder(
      options
    );
};





/**
 * Verify Payment
 */
export const verifyPaymentSignature =
  (paymentData) => {

    return verifySignature(
      paymentData
    );
};