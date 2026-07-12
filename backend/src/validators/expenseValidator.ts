import { z } from 'zod';
import { ExpenseType } from '@prisma/client';

export const createExpenseSchema = z.object({
  vehicleId: z.string().uuid('Invalid vehicle ID'),
  type: z.nativeEnum(ExpenseType),
  amount: z.number().positive('Amount must be > 0'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().datetime().optional()
});

export const queryExpenseSchema = z.object({
  vehicleId: z.string().uuid().optional(),
  type: z.nativeEnum(ExpenseType).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});
