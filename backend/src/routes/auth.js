import express from 'express';
import { authController } from '../controllers/authController.js';

const auth = express.Router();

auth.post('/login', authController.login);

auth.post('/logout', authController.logout);

export default auth;
