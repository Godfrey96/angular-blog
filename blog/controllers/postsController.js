import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';
import Post from '../models/postModel.js';

// @desc    Create a new post
// @route   POST /api/posts/
// @desc    Public
const createPost = asyncHandler(async (req, res) => {
    // const category = await Category.findById(req.body.category);
    // if (!category) return res.status(400).send('Invalid Category');

    // let post = new Post({
    //     title: req.body.title,
    //     descruption: req.body.description,
    //     category: req.body.category,
    //     image: req.body.image,
    //     user: req.body.user
    // })
    // post = await post.save();

    // if (!post) {
    //     return res.status(400).send('The post cannot be save!');
    // }
    // res.send(post);

    const newPost = new Post(req.body);

    try {
        const createdPost = await newPost.save();
        res.status(200).json(createdPost);
    } catch (err) {
        res.status(500).json(err);
    }
})

// @desc    Update post
// @route   PUT /api/posts/:id
// @desc    Private
const updatePost = asyncHandler(async (req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, { new: true }
    );
    if (!post) {
        return res.status(404).send('The post cannot be updated!');
    }
    res.send(post)
    // try {
    //     const post = await Post.findById(req.params.id);
    //     try {
    //         if (post.username === req.body.username) {
    //             try {
    //                 const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
    //                     $set: req.body
    //                 }, {
    //                     new: true
    //                 });
    //                 res.status(200).json(updatedPost);
    //             } catch (err) {
    //                 res.status(500).json(err);
    //             }
    //         }
    //     } catch (err) {
    //         res.status(500).json(err);
    //     }
    // } catch (err) {
    //     res.status(500).json(err);
    // }
})

// @desc    Delete a post
// @route   DELETE /api/users/:id
// @desc    Private
const deletePost = asyncHandler(async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        try {
            if (post.username === req.body.username) {
                try {
                    await post.delete();
                    res.status(200).json('Post has been deleted...');
                } catch (err) {
                    res.status(500).json(err);
                }
            } else {
                res.status(401).json('You can delete only your post!');
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

// @desc    Get a single posts
// @route   GET /api/users/:id
// @desc    Private
const getPost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate('category');

    if (!post) {
        res.status(500).json({ success: false });
    }
    res.send(post);
    // try {
    //     const post = await Post.findById(req.params.id);
    //     res.status(200).json(post);
    // } catch (err) {
    //     res.status(500).json(err);
    // }
})

// @desc    Get all posts
// @route   GET /api/users/
// @desc    Private
const getAllPost = asyncHandler(async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split('.') }
    }
    const posts = await Post.find(filter).populate('category');

    if (!posts) {
        res.status(500).json({ success: false });
    }
    res.send(posts);
    // const username = req.query.user;
    // const catName = req.query.cat;

    // try {
    //     let posts;
    //     if (username) {
    //         posts = await Post.find({ username });
    //     } else if (catName) {
    //         posts = await Post.find({
    //             categories: {
    //                 $in: [catName]
    //             }
    //         });
    //     } else {
    //         posts = await Post.find({});
    //     }
    //     res.status(200).json(posts);
    // } catch (err) {
    //     res.status(500).json(err);
    // }
})

// @desc    Get a single posts
// @route   GET /api/posts/myposts
// @desc    Private
const getUserPost = asyncHandler(async (req, res) => {
    const userPostList = await Order.find({ user: req.params.userid }).sort({ 'createdAt': -1 })

    if (!userPostList) {
        res.status(500).json({ success: false })
    }
    res.send(userPostList)
})

export {
    createPost,
    updatePost,
    deletePost,
    getPost,
    getAllPost,
    getUserPost
}