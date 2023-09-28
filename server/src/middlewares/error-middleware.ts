import { NextFunction, Request, Response } from 'express';
import { APIError, IAPIError } from '../errors/api-error';

export const errorMiddleware = (
  err: IAPIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  if (err instanceof APIError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: 'Server error' });
};
