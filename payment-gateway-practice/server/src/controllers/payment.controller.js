import { createPayment, capturePayment } from '../services/payment.service.js';

export const createPaymentController = async (req, res) => {
  try{
    const { amount } = req.body;
    const order = await createPayment(amount);
    res.status(201).json(order);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}

export const capturePaymentController = async (req, res) => {
  try{
    const { paymentId } = req.params;
    const result = await capturePayment(paymentId);
    res.json(result);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}
