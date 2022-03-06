import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import bcrypt from 'bcryptjs';

// @desc    Register a new user
// @route   POST /api/users/
// @desc    Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    const usernameExists = await User.findOne({ username });

    if (usernameExists) {
        res.status(400);
        throw new Error('User with this username already exists');
    }

    const user = await User.create({
        username,
        email,
        password
    });

    if (user) {
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
})

// @desc    Auth user & get token
// @route   POST /api/users/login
// @desc    Public
const authUser = asyncHandler(async (req, res) => {
    const { email, passowrd } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(req.body.password, user.password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
            token: generateToken(user._id)
        });
    } else {
        res.status(401);
        throw new Error('Invalid username or password');
    }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @desc    Private
const updateUser = asyncHandler(async (req, res) => {
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true })
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(401).json('You can only update your account!');
    }

})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @desc    Private
const deleteUser = asyncHandler(async (req, res) => {
    if (req.body.userId === req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            try {
                await Post.deleteMany({ username: user.username });
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json('User has been deleted...')
            } catch (err) {
                res.status(500).json(err)
            }
        } catch (err) {
            res.status(404).json('User not found');
        }
    } else {
        res.status(401).json('You can only delete your account!');
    }
})

// @desc    GET user
// @route   GET /api/users/:id
// @desc    Private
const getUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
})

// @desc    Get all categories
// @route   GET /api/categories/
// @desc    Public
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
})

export {
    registerUser,
    authUser,
    updateUser,
    deleteUser,
    getUser,
    getAllUsers
}