import Post from '../models/postModel.js';
import express from 'express';
import Category from '../models/categoryModel.js';
import mongoose from 'mongoose';
import multer from 'multer';
import User from '../models/userModel.js';

const router = express.Router();

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'uploads/');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

// @desc    Fetch all posts
// @route   Get /api/v1/posts
// @desc    Public
router.get(`/`, async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') };
    }

    // const user = await Post.find({ user: req.user._id })

    const postList = await Post.find(filter).populate('category').sort({ 'updatedAt': -1 });

    if (!postList) {
        res.status(500).json({ success: false });
    }
    res.send(postList);
});

// @desc    Create a post
// @route   POST /api/v1/posts
// @desc    Private/Admin 
router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const file = req.file;
    if (!file) {
        return res.status(400).send('No image in the request');
    }

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/uploads/`;

    // const apiUrl = 'http://localhost:5000/api/uploads/'

    let post = new Post({
        title: req.body.title,
        username: req.body.username,
        description: req.body.description,
        category: req.body.category,
        image: `${basePath}${fileName}`,
    });

    post = await post.save();

    if (!post) return res.status(500).send('The post cannot be created');

    res.send(post);
});

// @desc    Update a post
// @route   POST /api/v1/posts/:id
// @desc    Private/Admin
router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).send('Invalid Post!');

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = post.image;
    }

    const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            username: req.body.username,
            description: req.body.description,
            category: req.body.category,
            image: imagepath,
        },
        { new: true }
    );

    if (!updatedPost) return res.status(500).send('the post cannot be updated!');

    res.send(updatedPost);
});

// @desc    Fetch single post
// @route   Get /api/v1/posts/:id
// @desc    Public
router.get(`/:id`, async (req, res) => {
    const post = await Post.findById(req.params.id).populate('category');

    if (!post) {
        res.status(500).json({ success: false });
    }
    res.send(post);
});

// @desc    Fetch single post
// @route   Get /api/v1/posts/myposts/username
// @desc    Public
router.get(`/get/myposts/:username`, async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') };
    }
    const userPostList = await Post.find({ username: req.params.username }, filter).populate('category').sort({ 'updatedAt': -1 })
    // const userPostList = await Post.find().populate('username', 'username').sort({ 'createdAt': -1 })

    if (!userPostList) {
        res.status(500).json({ success: false })
    }
    res.send(userPostList)
});

// @desc    Fetch single post
// @route   Get /api/v1/posts/posts-by-category/category
// @desc    Public
router.get(`/get/posts-by-category/:category`, async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') };
    }
    const categoryPostList = await Post.find({ category: req.params.category }, filter).populate('category').sort({ 'updatedAt': -1 })
    // const userPostList = await Post.find().populate('username', 'username').sort({ 'createdAt': -1 })

    if (!categoryPostList) {
        res.status(500).json({ success: false })
    }
    res.send(categoryPostList)
});

// router.get(`/get/myposts/:userid`, async (req, res) => {
//     const userPostList = await Post.find({ user: req.params.userid }).sort({ 'createdAt': -1 })

//     if (!userPostList) {
//         res.status(500).json({ success: false })
//     }
//     res.send(userPostList)
// });

// @desc    Delete a post
// @route   POST /api/v1/posts/:id
// @desc    Private/Admin
router.delete('/:id', (req, res) => {
    Post.findByIdAndRemove(req.params.id)
        .then((post) => {
            if (post) {
                return res.status(200).json({
                    success: true,
                    message: 'the post is deleted!'
                });
            } else {
                return res.status(404).json({ success: false, message: 'post not found!' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ success: false, error: err });
        });
});

export default router