import { prisma } from '../database';
import { Prisma, Driver, DriverStatus } from '@prisma/client';

export interface DriverFilters {
  status?: DriverStatus;
  licenseCategory?: string;
  skip?: number;
  take?: number;
}

type PrismaClientOrTx = Prisma.TransactionClient | typeof prisma;

export const driverRepository = {
  async create(data: Prisma.DriverCreateInput, tx?: PrismaClientOrTx): Promise<Driver> {
    const client = tx || prisma;
    return client.driver.create({ data });
  },

  async findAll(filters: DriverFilters, tx?: PrismaClientOrTx): Promise<{ data: Driver[]; total: number }> {
    const client = tx || prisma;
    const where: Prisma.DriverWhereInput = {};
    if (filters.status) where.status = filters.status;
    if (filters.licenseCategory) where.licenseCategory = filters.licenseCategory;

    const [data, total] = await Promise.all([
      client.driver.findMany({
        where,
        skip: filters.skip,
        take: filters.take,
        orderBy: { name: 'asc' }
      }),
      client.driver.count({ where })
    ]);

    return { data, total };
  },

  async findById(id: string, tx?: PrismaClientOrTx): Promise<Driver | null> {
    const client = tx || prisma;
    return client.driver.findUnique({ where: { id } });
  },

  async findByLicenseNumber(licenseNumber: string, tx?: PrismaClientOrTx): Promise<Driver | null> {
    const client = tx || prisma;
    return client.driver.findUnique({ where: { licenseNumber } });
  },

  async update(id: string, data: Prisma.DriverUpdateInput, tx?: PrismaClientOrTx): Promise<Driver> {
    const client = tx || prisma;
    return client.driver.update({ where: { id }, data });
  },

  async remove(id: string, tx?: PrismaClientOrTx): Promise<Driver> {
    const client = tx || prisma;
    return client.driver.delete({ where: { id } });
  }
};
