import { z } from 'zod';

export const queryReportSchema = z.object({
  vehicleId: z.string().uuid().optional(),
  revenue: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional()
});
