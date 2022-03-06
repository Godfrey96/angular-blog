import express from 'express';
import {
    createCategory,
    getAllCategories,
    getCategoryById
} from '../controllers/categoriesController.js';

const router = express.Router();

router
    .route('/')
    .post(createCategory)
    .get(getAllCategories)

router
    .route('/:id')
    .get(getCategoryById)


export default router