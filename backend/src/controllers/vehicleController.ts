import { Request, Response } from 'express';
import { vehicleService } from '../services/vehicleService';
import { createVehicleSchema, updateVehicleSchema, queryVehicleSchema } from '../validators/vehicleValidator';
import { AppError } from '../utils/AppError';

export const vehicleController = {
  async create(req: Request, res: Response) {
    const parsed = createVehicleSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(e => e.message).join(', ');
      throw new AppError(400, `Validation Error: ${errorMsg}`);
    }

    const vehicle = await vehicleService.create(parsed.data as any);
    res.status(201).json(vehicle);
  },

  async findAll(req: Request, res: Response) {
    const parsed = queryVehicleSchema.safeParse(req.query);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(e => e.message).join(', ');
      throw new AppError(400, `Validation Error: ${errorMsg}`);
    }

    const result = await vehicleService.findAll(parsed.data);
    res.status(200).json(result);
  },

  async findById(req: Request, res: Response) {
    const vehicle = await vehicleService.findById(req.params.id);
    res.status(200).json(vehicle);
  },

  async update(req: Request, res: Response) {
    const parsed = updateVehicleSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(e => e.message).join(', ');
      throw new AppError(400, `Validation Error: ${errorMsg}`);
    }

    const vehicle = await vehicleService.update(req.params.id, parsed.data as any);
    res.status(200).json(vehicle);
  },

  async remove(req: Request, res: Response) {
    await vehicleService.remove(req.params.id);
    res.status(204).send();
  }
};
