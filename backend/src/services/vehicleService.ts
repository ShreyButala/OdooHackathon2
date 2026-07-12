import { vehicleRepository, VehicleFilters } from '../repositories/vehicleRepository';
import { AppError } from '../utils/AppError';
import { Prisma, VehicleStatus } from '@prisma/client';

export const vehicleService = {
  async create(data: Prisma.VehicleCreateInput) {
    const existing = await vehicleRepository.findByRegistrationNumber(data.registrationNumber);
    if (existing) {
      throw new AppError(409, 'Registration number already exists');
    }

    let status = data.status || VehicleStatus.AVAILABLE;

    return vehicleRepository.create({
      ...data,
      status,
    });
  },

  async findAll(query: any) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filters: VehicleFilters = {
      status: query.status,
      vehicleType: query.vehicleType,
      skip,
      take: limit
    };

    return vehicleRepository.findAll(filters);
  },

  async findById(id: string) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError(404, 'Vehicle not found');
    }
    return vehicle;
  },

  async update(id: string, data: Prisma.VehicleUpdateInput) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError(404, 'Vehicle not found');
    }

    if (data.registrationNumber && data.registrationNumber !== vehicle.registrationNumber) {
      const existing = await vehicleRepository.findByRegistrationNumber(data.registrationNumber as string);
      if (existing) {
        throw new AppError(409, 'Registration number already exists');
      }
    }

    if (vehicle.status === VehicleStatus.RETIRED && data.status === VehicleStatus.ON_TRIP) {
      throw new AppError(400, 'A retired vehicle cannot be dispatched');
    }

    return vehicleRepository.update(id, data);
  },

  async remove(id: string) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError(404, 'Vehicle not found');
    }

    if (vehicle.status === VehicleStatus.ON_TRIP) {
      throw new AppError(400, 'Cannot delete a vehicle that is currently ON_TRIP');
    }

    return vehicleRepository.remove(id);
  }
};
