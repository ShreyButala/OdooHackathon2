import { z } from 'zod';
import { MaintenanceStatus } from '@prisma/client';

export const createMaintenanceSchema = z.object({
  vehicleId: z.string().uuid('Invalid vehicle ID'),
  description: z.string().min(1, 'Description is required'),
  cost: z.number().min(0, 'Cost must be >= 0')
});

export const queryMaintenanceSchema = z.object({
  status: z.nativeEnum(MaintenanceStatus).optional(),
  vehicleId: z.string().uuid().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});
