import express from 'express';
import { createBudget,getAllBudgets,getBudgetsByUser,deleteBudget} from '../controllers/category.controller.js';

const router = express.Router();

// Create budget
router.post('/budgets', createBudget);

// Get all budgets
router.get('/budgets', getAllBudgets);

// Get budgets by user
router.get('/budgets/user/:user_id', getBudgetsByUser);

// Delete budget
router.delete('/budgets/:id', deleteBudget);

export default router;