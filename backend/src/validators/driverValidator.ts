import { z } from 'zod';
import { DriverStatus } from '@prisma/client';

export const createDriverSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  licenseCategory: z.string().min(1, 'License category is required'),
  licenseExpiry: z.string().datetime({ message: "Invalid date format, use ISO 8601" }).transform((str) => new Date(str)),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  safetyScore: z.number().min(0, 'Safety score must be between 0 and 100').max(100).optional(),
  status: z.nativeEnum(DriverStatus).optional(),
});

export const updateDriverSchema = z.object({
  name: z.string().min(1).optional(),
  licenseNumber: z.string().min(1).optional(),
  licenseCategory: z.string().min(1).optional(),
  licenseExpiry: z.string().datetime({ message: "Invalid date format, use ISO 8601" }).transform((str) => new Date(str)).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  safetyScore: z.number().min(0).max(100).optional(),
  status: z.nativeEnum(DriverStatus).optional(),
});

export const queryDriverSchema = z.object({
  status: z.nativeEnum(DriverStatus).optional(),
  licenseCategory: z.string().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});
