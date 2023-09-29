import { NextFunction, Request, Response } from 'express';
import { APIError } from '../errors/api-error';
import tokenService from '../services/token-service';
export const tokenCheckMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken) {
    return next(APIError.UnauthorizedError());
  }
  const userData = tokenService.verifyAccessToken(accessToken);
  if (!userData) {
    return next(APIError.UnauthorizedError());
  }
  return next();
};
