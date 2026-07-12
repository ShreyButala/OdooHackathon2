import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from '../utils/AppError';
import { UserRole } from '@prisma/client';

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'Unauthorized: Missing or invalid token'));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new AppError(401, 'Unauthorized: Missing token string'));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as unknown as JwtPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    next(new AppError(401, 'Unauthorized: Expired or invalid token'));
  }
};
