import { prisma } from '../database';
import { Prisma, Vehicle, VehicleStatus } from '@prisma/client';

export interface VehicleFilters {
  status?: VehicleStatus;
  vehicleType?: string;
  skip?: number;
  take?: number;
}

export const vehicleRepository = {
  async create(data: Prisma.VehicleCreateInput): Promise<Vehicle> {
    return prisma.vehicle.create({ data });
  },

  async findAll(filters: VehicleFilters): Promise<{ data: Vehicle[]; total: number }> {
    const where: Prisma.VehicleWhereInput = {};
    if (filters.status) where.status = filters.status;
    if (filters.vehicleType) where.vehicleType = filters.vehicleType;

    const [data, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        skip: filters.skip,
        take: filters.take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.vehicle.count({ where })
    ]);

    return { data, total };
  },

  async findById(id: string): Promise<Vehicle | null> {
    return prisma.vehicle.findUnique({ where: { id } });
  },

  async findByRegistrationNumber(registrationNumber: string): Promise<Vehicle | null> {
    return prisma.vehicle.findUnique({ where: { registrationNumber } });
  },

  async update(id: string, data: Prisma.VehicleUpdateInput): Promise<Vehicle> {
    return prisma.vehicle.update({ where: { id }, data });
  },

  async remove(id: string): Promise<Vehicle> {
    return prisma.vehicle.delete({ where: { id } });
  }
};
