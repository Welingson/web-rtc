import express from 'express';

import { userController } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/auth.js';

const user = express.Router();

user.get('/user', authMiddleware, userController.list);

export default user;
