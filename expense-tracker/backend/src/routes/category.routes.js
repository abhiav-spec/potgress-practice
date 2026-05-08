import express from 'express';
import {createCategoryController, getAllCategoriesController, deleteCategoryController, getCategoriesByTypeController} from '../controllers/category.controller.js';

const router = express.Router();

// Create category
router.post('/categories', createCategoryController);

// Get all categories
router.get('/categories', getAllCategoriesController);

// Get categories by type (income/expense)
router.get('/categories/type/:type', getCategoriesByTypeController);

// Delete category
router.delete('/categories/:id', deleteCategoryController);

export default router;