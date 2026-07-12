import { z } from 'zod';
import { TripStatus } from '@prisma/client';

export const createTripSchema = z.object({
  source: z.string().min(1, 'Source is required'),
  destination: z.string().min(1, 'Destination is required'),
  vehicleId: z.string().uuid('Invalid vehicle ID'),
  driverId: z.string().uuid('Invalid driver ID'),
  cargoWeight: z.number().min(0, 'Cargo weight must be >= 0'),
  plannedDistance: z.number().min(0, 'Planned distance must be >= 0')
});

export const completeTripSchema = z.object({
  actualOdometer: z.number().min(0),
  fuelUsed: z.number().min(0),
  actualDistance: z.number().min(0).optional()
});

export const queryTripSchema = z.object({
  status: z.nativeEnum(TripStatus).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});
