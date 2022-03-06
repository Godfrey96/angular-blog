import express from 'express'
import {
    registerUser,
    authUser,
    updateUser,
    deleteUser,
    getUser,
    getAllUsers
} from '../controllers/usersController.js'

const router = express.Router();

router.route('/').post(registerUser).get(getAllUsers);
router.post('/login', authUser);
router
    .route('/:id')
    .put(updateUser)
    .delete(deleteUser)
    .get(getUser)

export default router