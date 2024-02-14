import express from 'express';
import {checkSchema} from 'express-validator';
import {authController} from '../controllers/auth.controller.js';
import {loginSchema} from '../validators/user.schema.js';

export const authRouter = express.Router();

authRouter
  .route('/')
  .post(checkSchema(loginSchema), authController.authenticateUser)
  .delete(authController.logout);
