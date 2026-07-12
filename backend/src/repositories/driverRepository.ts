import { prisma } from '../database';
import { Prisma, Driver, DriverStatus } from '@prisma/client';

export interface DriverFilters {
  status?: DriverStatus;
  licenseCategory?: string;
  skip?: number;
  take?: number;
}

export const driverRepository = {
  async create(data: Prisma.DriverCreateInput): Promise<Driver> {
    return prisma.driver.create({ data });
  },

  async findAll(filters: DriverFilters): Promise<{ data: Driver[]; total: number }> {
    const where: Prisma.DriverWhereInput = {};
    if (filters.status) where.status = filters.status;
    if (filters.licenseCategory) where.licenseCategory = filters.licenseCategory;

    const [data, total] = await Promise.all([
      prisma.driver.findMany({
        where,
        skip: filters.skip,
        take: filters.take,
        orderBy: { name: 'asc' }
      }),
      prisma.driver.count({ where })
    ]);

    return { data, total };
  },

  async findById(id: string): Promise<Driver | null> {
    return prisma.driver.findUnique({ where: { id } });
  },

  async findByLicenseNumber(licenseNumber: string): Promise<Driver | null> {
    return prisma.driver.findUnique({ where: { licenseNumber } });
  },

  async update(id: string, data: Prisma.DriverUpdateInput): Promise<Driver> {
    return prisma.driver.update({ where: { id }, data });
  },

  async remove(id: string): Promise<Driver> {
    return prisma.driver.delete({ where: { id } });
  }
};
