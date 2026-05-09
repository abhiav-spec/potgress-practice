import express from 'express';
import { listTransactions, createTransaction } from '../controllers/transaction.controller.js';

const router = express.Router();

router.get('/', listTransactions);
router.post('/', createTransaction);

export default router;
