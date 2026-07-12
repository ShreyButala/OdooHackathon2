import { prisma } from '../database';
import { Prisma, Trip, TripStatus } from '@prisma/client';

export interface TripFilters {
  status?: TripStatus;
  startDate?: string;
  endDate?: string;
  skip?: number;
  take?: number;
}

type PrismaClientOrTx = Prisma.TransactionClient | typeof prisma;

export const tripRepository = {
  async create(data: Prisma.TripCreateInput | Prisma.TripUncheckedCreateInput, tx?: PrismaClientOrTx): Promise<Trip> {
    const client = tx || prisma;
    return client.trip.create({ data });
  },

  async findAll(filters: TripFilters, tx?: PrismaClientOrTx): Promise<{ data: Trip[]; total: number }> {
    const client = tx || prisma;
    const where: Prisma.TripWhereInput = {};
    if (filters.status) where.status = filters.status;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }

    const [data, total] = await Promise.all([
      client.trip.findMany({
        where,
        skip: filters.skip,
        take: filters.take,
        orderBy: { createdAt: 'desc' },
        include: { vehicle: true, driver: true }
      }),
      client.trip.count({ where })
    ]);

    return { data, total };
  },

  async findById(id: string, tx?: PrismaClientOrTx): Promise<Trip | null> {
    const client = tx || prisma;
    return client.trip.findUnique({ 
      where: { id },
      include: { vehicle: true, driver: true } 
    });
  },

  async update(id: string, data: Prisma.TripUpdateInput | Prisma.TripUncheckedUpdateInput, tx?: PrismaClientOrTx): Promise<Trip> {
    const client = tx || prisma;
    return client.trip.update({ where: { id }, data });
  }
};
