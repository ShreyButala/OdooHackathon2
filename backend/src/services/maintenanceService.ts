import { maintenanceRepository, MaintenanceFilters } from '../repositories/maintenanceRepository';
import { vehicleRepository } from '../repositories/vehicleRepository';
import { AppError } from '../utils/AppError';
import { Prisma, MaintenanceStatus, VehicleStatus } from '@prisma/client';
import { prisma } from '../database';

export const maintenanceService = {
  async create(data: { vehicleId: string; description: string; cost: number }) {
    return prisma.$transaction(async (tx) => {
      const vehicle = await vehicleRepository.findById(data.vehicleId, tx);
      if (!vehicle) throw new AppError(404, 'Vehicle not found');

      if (vehicle.status === VehicleStatus.ON_TRIP) {
        throw new AppError(400, 'Cannot send a vehicle to maintenance while it is ON_TRIP');
      }

      const activeMaintenance = await maintenanceRepository.findActiveByVehicleId(data.vehicleId, tx);
      if (activeMaintenance) {
        throw new AppError(409, 'Vehicle already has an ACTIVE maintenance record');
      }

      await vehicleRepository.update(vehicle.id, { status: VehicleStatus.IN_SHOP }, tx);

      return maintenanceRepository.create({
        vehicleId: data.vehicleId,
        description: data.description,
        cost: data.cost,
        status: MaintenanceStatus.ACTIVE
      }, tx);
    });
  },

  async close(id: string) {
    return prisma.$transaction(async (tx) => {
      const maintenance = await maintenanceRepository.findById(id, tx);
      if (!maintenance) throw new AppError(404, 'Maintenance record not found');

      if (maintenance.status === MaintenanceStatus.CLOSED) {
        throw new AppError(400, 'Maintenance record is already CLOSED');
      }

      const vehicle = await vehicleRepository.findById(maintenance.vehicleId, tx);
      if (!vehicle) throw new AppError(404, 'Associated vehicle not found');

      if (vehicle.status !== VehicleStatus.RETIRED) {
        await vehicleRepository.update(vehicle.id, { status: VehicleStatus.AVAILABLE }, tx);
      }

      return maintenanceRepository.update(id, {
        status: MaintenanceStatus.CLOSED,
        completedAt: new Date()
      }, tx);
    });
  },

  async findAll(query: any) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filters: MaintenanceFilters = {
      status: query.status,
      vehicleId: query.vehicleId,
      skip,
      take: limit
    };

    return maintenanceRepository.findAll(filters);
  },

  async findById(id: string) {
    const record = await maintenanceRepository.findById(id);
    if (!record) {
      throw new AppError(404, 'Maintenance record not found');
    }
    return record;
  }
};
