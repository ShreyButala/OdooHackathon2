import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { registerSchema, loginSchema } from '../validators/authValidators';
import { AppError } from '../utils/AppError';

export const authController = {
  async register(req: Request, res: Response) {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(e => e.message).join(', ');
      throw new AppError(400, `Validation Error: ${errorMsg}`);
    }

    const user = await authService.register(parsed.data);
    res.status(201).json(user);
  },

  async login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(e => e.message).join(', ');
      throw new AppError(400, `Validation Error: ${errorMsg}`);
    }

    const { email, password } = parsed.data;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  },

  async me(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, 'Unauthorized');
    }

    const profile = await authService.getProfile(userId);
    res.status(200).json(profile);
  }
};
