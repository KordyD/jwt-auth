import { NextFunction, Request, Response } from 'express';
import userService from '../services/user-service';
import { config } from 'dotenv';
import { join } from 'path';
import { validationResult } from 'express-validator';
import { APIError } from '../errors/api-error';

class userController {
  constructor() {
    config({ path: join(__dirname, '..', '..', 'src', '.env') });
  }
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw APIError.BadRequest(result.array()[0].msg, result.array());
      }
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
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw APIError.BadRequest(result.array()[0].msg, result.array());
      }
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData?.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenData = await userService.logout(req.cookies.refreshToken);
      res.clearCookie('refreshToken');
      res.json(tokenData);
    } catch (error) {
      next(error);
    }
  }
  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL || 'http://google.com');
    } catch (error) {
      next(error);
    }
  }
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = await userService.refresh(req.cookies.refreshToken);
      res.json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getUsers();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }
}

export default new userController();
