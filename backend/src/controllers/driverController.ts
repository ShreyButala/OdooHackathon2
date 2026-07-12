import { Request, Response } from 'express';
import { driverService } from '../services/driverService';
import { createDriverSchema, updateDriverSchema, queryDriverSchema } from '../validators/driverValidator';
import { AppError } from '../utils/AppError';

export const driverController = {
  async create(req: Request, res: Response) {
    const parsed = createDriverSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(e => e.message).join(', ');
      throw new AppError(400, `Validation Error: ${errorMsg}`);
    }

    const driver = await driverService.create(parsed.data as any);
    res.status(201).json(driver);
  },

  async findAll(req: Request, res: Response) {
    const parsed = queryDriverSchema.safeParse(req.query);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(e => e.message).join(', ');
      throw new AppError(400, `Validation Error: ${errorMsg}`);
    }

    const result = await driverService.findAll(parsed.data);
    res.status(200).json(result);
  },

  async findById(req: Request, res: Response) {
    const driver = await driverService.findById(req.params.id);
    res.status(200).json(driver);
  },

  async update(req: Request, res: Response) {
    const parsed = updateDriverSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(e => e.message).join(', ');
      throw new AppError(400, `Validation Error: ${errorMsg}`);
    }

    const driver = await driverService.update(req.params.id, parsed.data as any);
    res.status(200).json(driver);
  },

  async remove(req: Request, res: Response) {
    await driverService.remove(req.params.id);
    res.status(204).send();
  }
};
