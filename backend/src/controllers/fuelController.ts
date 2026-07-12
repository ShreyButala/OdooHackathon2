import { Request, Response } from 'express';
import { fuelService } from '../services/fuelService';
import { createFuelSchema, queryFuelSchema } from '../validators/fuelValidator';
import { AppError } from '../utils/AppError';

export const fuelController = {
  async create(req: Request, res: Response) {
    const parsed = createFuelSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(e => e.message).join(', ');
      throw new AppError(400, `Validation Error: ${errorMsg}`);
    }

    const log = await fuelService.create(parsed.data);
    res.status(201).json(log);
  },

  async findAll(req: Request, res: Response) {
    const parsed = queryFuelSchema.safeParse(req.query);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(e => e.message).join(', ');
      throw new AppError(400, `Validation Error: ${errorMsg}`);
    }

    const result = await fuelService.findAll(parsed.data);
    res.status(200).json(result);
  }
};
