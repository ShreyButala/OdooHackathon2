import { prisma } from '../database';
import { Prisma, Maintenance, MaintenanceStatus } from '@prisma/client';

export interface MaintenanceFilters {
  status?: MaintenanceStatus;
  vehicleId?: string;
  skip?: number;
  take?: number;
}

type PrismaClientOrTx = Prisma.TransactionClient | typeof prisma;

export const maintenanceRepository = {
  async create(data: Prisma.MaintenanceUncheckedCreateInput, tx?: PrismaClientOrTx): Promise<Maintenance> {
    const client = tx || prisma;
    return client.maintenance.create({ data });
  },

  async findAll(filters: MaintenanceFilters, tx?: PrismaClientOrTx): Promise<{ data: Maintenance[]; total: number }> {
    const client = tx || prisma;
    const where: Prisma.MaintenanceWhereInput = {};
    if (filters.status) where.status = filters.status;
    if (filters.vehicleId) where.vehicleId = filters.vehicleId;

    const [data, total] = await Promise.all([
      client.maintenance.findMany({
        where,
        skip: filters.skip,
        take: filters.take,
        orderBy: { createdAt: 'desc' },
        include: { vehicle: true }
      }),
      client.maintenance.count({ where })
    ]);

    return { data, total };
  },

  async findById(id: string, tx?: PrismaClientOrTx): Promise<Maintenance | null> {
    const client = tx || prisma;
    return client.maintenance.findUnique({
      where: { id },
      include: { vehicle: true }
    });
  },

  async findActiveByVehicleId(vehicleId: string, tx?: PrismaClientOrTx): Promise<Maintenance | null> {
    const client = tx || prisma;
    return client.maintenance.findFirst({
      where: { vehicleId, status: MaintenanceStatus.ACTIVE }
    });
  },

  async update(id: string, data: Prisma.MaintenanceUncheckedUpdateInput, tx?: PrismaClientOrTx): Promise<Maintenance> {
    const client = tx || prisma;
    return client.maintenance.update({ where: { id }, data });
  }
};
