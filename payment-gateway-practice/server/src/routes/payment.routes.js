import express from 'express';
import { createPaymentController, capturePaymentController } from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/create', createPaymentController);
router.post('/capture/:paymentId', capturePaymentController);

export default router;
