import express from 'express';
import { authController } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/auth.js';

const auth = express.Router();

auth.post('/login', authController.login);

auth.post('/logout', authMiddleware, authController.logout);

export default auth;
