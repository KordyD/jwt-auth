import { NextFunction, Request, Response } from 'express';
import userService from '../services/user-service';
import { config } from 'dotenv';
import { join } from 'path';

class userController {
  constructor() {
    config({ path: join(__dirname, '..', '..', 'src', '.env') });
  }
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const userData = await userService.register(email, password);
      res.cookie('refreshToken', userData?.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {}
  async logout(req: Request, res: Response, next: NextFunction) {}
  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL || 'http://google.com');
    } catch (error) {
      next(error);
    }
  }
  async refresh(req: Request, res: Response, next: NextFunction) {}
  async getUsers(req: Request, res: Response, next: NextFunction) {}
}

export default new userController();
