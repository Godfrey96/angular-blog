import express from 'express';
import {
    // createPost,
    updatePost,
    deletePost,
    getPost,
    getAllPost
} from '../controllers/postsController.js';

const router = express.Router();

router
    .route('/')
    // .post(createPost)
    .get(getAllPost)

router
    .route('/:id')
    .put(updatePost)
    .delete(deletePost)
    .get(getPost)

export default router