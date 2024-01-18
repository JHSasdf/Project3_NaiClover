import express from 'express';
import * as controller from '../controllers/auth.controller';
export const authRouter = express();

authRouter.post('/login', controller.login);

authRouter.post('/signin', controller.signup);