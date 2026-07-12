import { driverRepository, DriverFilters } from '../repositories/driverRepository';
import { AppError } from '../utils/AppError';
import { Prisma, DriverStatus, Driver } from '@prisma/client';

export const isDriverAssignable = (driver: Driver): { assignable: boolean; reason?: string } => {
  if (driver.status === DriverStatus.SUSPENDED) {
    return { assignable: false, reason: 'Driver is currently SUSPENDED' };
  }
  if (driver.status === DriverStatus.ON_TRIP) {
    return { assignable: false, reason: 'Driver is already ON_TRIP' };
  }
  if (new Date(driver.licenseExpiry) < new Date()) {
    return { assignable: false, reason: 'Driver license has expired' };
  }
  if (driver.status === DriverStatus.OFF_DUTY) {
     return { assignable: false, reason: 'Driver is OFF_DUTY' };
  }
  return { assignable: true };
};

export const driverService = {
  async create(data: Prisma.DriverCreateInput) {
    const existing = await driverRepository.findByLicenseNumber(data.licenseNumber);
    if (existing) {
      throw new AppError(409, 'License number already exists');
    }

    let status = data.status || DriverStatus.AVAILABLE;

    return driverRepository.create({
      ...data,
      status,
    });
  },

  async findAll(query: any) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filters: DriverFilters = {
      status: query.status,
      licenseCategory: query.licenseCategory,
      skip,
      take: limit
    };

    return driverRepository.findAll(filters);
  },

  async findById(id: string) {
    const driver = await driverRepository.findById(id);
    if (!driver) {
      throw new AppError(404, 'Driver not found');
    }
    return driver;
  },

  async update(id: string, data: Prisma.DriverUpdateInput) {
    const driver = await driverRepository.findById(id);
    if (!driver) {
      throw new AppError(404, 'Driver not found');
    }

    if (data.licenseNumber && data.licenseNumber !== driver.licenseNumber) {
      const existing = await driverRepository.findByLicenseNumber(data.licenseNumber as string);
      if (existing) {
        throw new AppError(409, 'License number already exists');
      }
    }

    return driverRepository.update(id, data);
  },

  async remove(id: string) {
    const driver = await driverRepository.findById(id);
    if (!driver) {
      throw new AppError(404, 'Driver not found');
    }

    if (driver.status === DriverStatus.ON_TRIP) {
      throw new AppError(400, 'Cannot delete a driver who is currently ON_TRIP');
    }

    return driverRepository.remove(id);
  }
};
