import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { AppError } from '../utils/AppError';

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return next(new AppError(401, 'Unauthorized: User role not found'));
    }

    if (!allowedRoles.includes(userRole)) {
      return next(new AppError(403, 'Forbidden: Insufficient permissions'));
    }

    next();
  };
};
