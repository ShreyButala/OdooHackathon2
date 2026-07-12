import { prisma } from '../database';
import { Prisma, FuelLog } from '@prisma/client';

export interface FuelLogFilters {
  vehicleId?: string;
  tripId?: string;
  startDate?: string;
  endDate?: string;
  skip?: number;
  take?: number;
}

type PrismaClientOrTx = Prisma.TransactionClient | typeof prisma;

export const fuelLogRepository = {
  async create(data: Prisma.FuelLogUncheckedCreateInput, tx?: PrismaClientOrTx): Promise<FuelLog> {
    const client = tx || prisma;
    return client.fuelLog.create({ data });
  },

  async findAll(filters: FuelLogFilters, tx?: PrismaClientOrTx): Promise<{ data: FuelLog[]; total: number }> {
    const client = tx || prisma;
    const where: Prisma.FuelLogWhereInput = {};
    if (filters.vehicleId) where.vehicleId = filters.vehicleId;
    if (filters.tripId) where.tripId = filters.tripId;
    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = new Date(filters.startDate);
      if (filters.endDate) where.date.lte = new Date(filters.endDate);
    }

    const [data, total] = await Promise.all([
      client.fuelLog.findMany({
        where,
        ...(filters.skip !== undefined && { skip: filters.skip }),
        ...(filters.take !== undefined && { take: filters.take }),
        orderBy: { date: 'desc' }
      }),
      client.fuelLog.count({ where })
    ]);

    return { data, total };
  }
};
