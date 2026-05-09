import { createOrder, capture } from './razorpay.service.js';

export const createPayment = async (amount) => {
  return createOrder(amount);
}

export const capturePayment = async (paymentId) => {
  return capture(paymentId);
}
