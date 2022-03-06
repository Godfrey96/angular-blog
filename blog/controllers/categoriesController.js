import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';

// @desc    Create a category
// @route   POST /api/v1/categories
// @desc    Private/Admin
const createCategory = asyncHandler(async (req, res) => {
    const newCat = new Category(req.body);

    try {
        const createdCategory = await newCat.save();
        res.status(200).json(createdCategory);
    } catch (err) {
        res.status(500).json(err);
    }
})

// @desc    Get all categories
// @route   GET /api/categories/
// @desc    Public
const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json(err);
    }
})

// @desc    Fetch single category
// @route   Get /api/v1/categories/:id
// @desc    Public
const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id)

    if (!category) {
        res.status(500).json({ message: 'The category with the given ID was not found' })
    }
    res.status(200).send(category)
})

export {
    createCategory,
    getAllCategories,
    getCategoryById
}