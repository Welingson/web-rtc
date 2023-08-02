import express from 'express';

import { userController } from '../controllers/userController.js';

const user = express.Router();

user.get('/user', userController.list);

export default user;
