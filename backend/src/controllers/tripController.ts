import { Request, Response } from 'express';
import { tripService } from '../services/tripService';
import { createTripSchema, completeTripSchema, queryTripSchema } from '../validators/tripValidator';
import { AppError } from '../utils/AppError';

export const tripController = {
  async create(req: Request, res: Response) {
    const parsed = createTripSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(e => e.message).join(', ');
      throw new AppError(400, `Validation Error: ${errorMsg}`);
    }

    const trip = await tripService.create(parsed.data);
    res.status(201).json(trip);
  },

  async dispatch(req: Request, res: Response) {
    const trip = await tripService.dispatch(req.params.id as string);
    res.status(200).json(trip);
  },

  async complete(req: Request, res: Response) {
    const parsed = completeTripSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(e => e.message).join(', ');
      throw new AppError(400, `Validation Error: ${errorMsg}`);
    }

    const { actualOdometer, fuelUsed, actualDistance } = parsed.data;
    const trip = await tripService.complete(req.params.id as string, actualOdometer, fuelUsed, actualDistance);
    res.status(200).json(trip);
  },

  async cancel(req: Request, res: Response) {
    const trip = await tripService.cancel(req.params.id as string);
    res.status(200).json(trip);
  },

  async findAll(req: Request, res: Response) {
    const parsed = queryTripSchema.safeParse(req.query);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(e => e.message).join(', ');
      throw new AppError(400, `Validation Error: ${errorMsg}`);
    }

    const result = await tripService.findAll(parsed.data);
    res.status(200).json(result);
  },

  async findById(req: Request, res: Response) {
    const trip = await tripService.findById(req.params.id as string);
    res.status(200).json(trip);
  }
};
