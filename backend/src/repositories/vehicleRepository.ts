import { prisma } from '../database';
import { Prisma, Vehicle, VehicleStatus } from '@prisma/client';

export interface VehicleFilters {
  status?: VehicleStatus;
  vehicleType?: string;
  skip?: number;
  take?: number;
}

type PrismaClientOrTx = Prisma.TransactionClient | typeof prisma;

export const vehicleRepository = {
  async create(data: Prisma.VehicleCreateInput, tx?: PrismaClientOrTx): Promise<Vehicle> {
    const client = tx || prisma;
    return client.vehicle.create({ data });
  },

  async findAll(filters: VehicleFilters, tx?: PrismaClientOrTx): Promise<{ data: Vehicle[]; total: number }> {
    const client = tx || prisma;
    const where: Prisma.VehicleWhereInput = {};
    if (filters.status) where.status = filters.status;
    if (filters.vehicleType) where.vehicleType = filters.vehicleType;

    const [data, total] = await Promise.all([
      client.vehicle.findMany({
        where,
        skip: filters.skip,
        take: filters.take,
        orderBy: { createdAt: 'desc' }
      }),
      client.vehicle.count({ where })
    ]);

    return { data, total };
  },

  async findById(id: string, tx?: PrismaClientOrTx): Promise<Vehicle | null> {
    const client = tx || prisma;
    return client.vehicle.findUnique({ where: { id } });
  },

  async findByRegistrationNumber(registrationNumber: string, tx?: PrismaClientOrTx): Promise<Vehicle | null> {
    const client = tx || prisma;
    return client.vehicle.findUnique({ where: { registrationNumber } });
  },

  async update(id: string, data: Prisma.VehicleUpdateInput, tx?: PrismaClientOrTx): Promise<Vehicle> {
    const client = tx || prisma;
    return client.vehicle.update({ where: { id }, data });
  },

  async remove(id: string, tx?: PrismaClientOrTx): Promise<Vehicle> {
    const client = tx || prisma;
    return client.vehicle.delete({ where: { id } });
  }
};
