import { Router } from 'express';
import userController from '../controllers/user-controller';
import { body } from 'express-validator';
import { tokenCheckMiddleware } from '../middlewares/token-check-middleware';

export const router = Router();

router.post(
  '/registration',
  [body('email').isEmail(), body('password').notEmpty()],
  userController.register
);
router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  userController.login
);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', tokenCheckMiddleware, userController.getUsers);
