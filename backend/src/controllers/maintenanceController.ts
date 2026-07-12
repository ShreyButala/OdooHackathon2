import { Request, Response } from 'express';
import { maintenanceService } from '../services/maintenanceService';
import { createMaintenanceSchema, queryMaintenanceSchema } from '../validators/maintenanceValidator';
import { AppError } from '../utils/AppError';

export const maintenanceController = {
  async create(req: Request, res: Response) {
    const parsed = createMaintenanceSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(e => e.message).join(', ');
      throw new AppError(400, `Validation Error: ${errorMsg}`);
    }

    const record = await maintenanceService.create(parsed.data);
    res.status(201).json(record);
  },

  async close(req: Request, res: Response) {
    const record = await maintenanceService.close(req.params.id as string);
    res.status(200).json(record);
  },

  async findAll(req: Request, res: Response) {
    const parsed = queryMaintenanceSchema.safeParse(req.query);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(e => e.message).join(', ');
      throw new AppError(400, `Validation Error: ${errorMsg}`);
    }

    const result = await maintenanceService.findAll(parsed.data);
    res.status(200).json(result);
  },

  async findById(req: Request, res: Response) {
    const record = await maintenanceService.findById(req.params.id as string);
    res.status(200).json(record);
  }
};
