import express from 'express';
import {createTransactionController, getTransactionsByUserController, getAllTransactionsController, deleteTransactionController} from "../controllers/transaction.controller.js";

const router = express.Router();

// Create transaction
router.post("/create-transaction", createTransactionController);

// Get transactions by user
router.get("/get-transactions-by-user/:user_id", getTransactionsByUserController);

// Get all transactions
router.get("/get-all-transactions", getAllTransactionsController);

// Delete transaction
router.delete("/delete-transaction-by-id/:id", deleteTransactionController);

export default router;