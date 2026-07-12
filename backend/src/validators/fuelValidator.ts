import { z } from 'zod';

export const createFuelSchema = z.object({
  vehicleId: z.string().uuid('Invalid vehicle ID'),
  tripId: z.string().uuid('Invalid trip ID').optional(),
  liters: z.number().positive('Liters must be > 0'),
  cost: z.number().positive('Cost must be > 0'),
  date: z.string().datetime().optional()
});

export const queryFuelSchema = z.object({
  vehicleId: z.string().uuid().optional(),
  tripId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});
