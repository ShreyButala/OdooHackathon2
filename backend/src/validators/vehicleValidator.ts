import { z } from 'zod';
import { VehicleStatus } from '@prisma/client';

export const createVehicleSchema = z.object({
  registrationNumber: z.string().min(1, 'Registration number is required'),
  vehicleName: z.string().min(1, 'Vehicle name is required'),
  vehicleType: z.string().min(1, 'Vehicle type is required'),
  maxLoadCapacity: z.number().min(0, 'Must be >= 0'),
  odometer: z.number().min(0, 'Must be >= 0'),
  acquisitionCost: z.number().min(0, 'Must be >= 0'),
  status: z.nativeEnum(VehicleStatus).optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export const queryVehicleSchema = z.object({
  status: z.nativeEnum(VehicleStatus).optional(),
  vehicleType: z.string().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});
