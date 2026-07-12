import { tripRepository, TripFilters } from '../repositories/tripRepository';
import { vehicleRepository } from '../repositories/vehicleRepository';
import { driverRepository } from '../repositories/driverRepository';
import { isVehicleDispatchable } from './vehicleService';
import { isDriverAssignable } from './driverService';
import { AppError } from '../utils/AppError';
import { Prisma, TripStatus, VehicleStatus, DriverStatus } from '@prisma/client';
import { prisma } from '../database';

export const tripService = {
  async create(data: { source: string; destination: string; vehicleId: string; driverId: string; cargoWeight: number; plannedDistance: number }) {
    const vehicle = await vehicleRepository.findById(data.vehicleId);
    if (!vehicle) throw new AppError(400, 'Vehicle not found');

    const vCheck = isVehicleDispatchable(vehicle);
    if (!vCheck.dispatchable) throw new AppError(400, `Vehicle ineligible: ${vCheck.reason}`);

    const driver = await driverRepository.findById(data.driverId);
    if (!driver) throw new AppError(400, 'Driver not found');

    const dCheck = isDriverAssignable(driver);
    if (!dCheck.assignable) throw new AppError(400, `Driver ineligible: ${dCheck.reason}`);

    if (new Prisma.Decimal(data.cargoWeight).greaterThan(vehicle.maxLoadCapacity)) {
      throw new AppError(400, `Cargo weight (${data.cargoWeight}) exceeds vehicle capacity (${vehicle.maxLoadCapacity})`);
    }

    return tripRepository.create({
      source: data.source,
      destination: data.destination,
      cargoWeight: data.cargoWeight,
      plannedDistance: data.plannedDistance,
      status: TripStatus.DRAFT,
      vehicle: { connect: { id: vehicle.id } },
      driver: { connect: { id: driver.id } },
    });
  },

  async dispatch(tripId: string) {
    return prisma.$transaction(async (tx) => {
      const trip = await tripRepository.findById(tripId, tx);
      if (!trip) throw new AppError(404, 'Trip not found');

      if (trip.status !== TripStatus.DRAFT) {
        throw new AppError(409, `Cannot dispatch trip in ${trip.status} status (must be DRAFT)`);
      }

      const vehicle = await vehicleRepository.findById(trip.vehicleId, tx);
      if (!vehicle) throw new AppError(409, 'Vehicle not found');
      
      const vCheck = isVehicleDispatchable(vehicle);
      if (!vCheck.dispatchable) throw new AppError(409, `Vehicle re-validation failed: ${vCheck.reason}`);

      const driver = await driverRepository.findById(trip.driverId, tx);
      if (!driver) throw new AppError(409, 'Driver not found');

      const dCheck = isDriverAssignable(driver);
      if (!dCheck.assignable) throw new AppError(409, `Driver re-validation failed: ${dCheck.reason}`);

      await vehicleRepository.update(vehicle.id, { status: VehicleStatus.ON_TRIP }, tx);
      await driverRepository.update(driver.id, { status: DriverStatus.ON_TRIP }, tx);

      return tripRepository.update(tripId, { status: TripStatus.DISPATCHED }, tx);
    });
  },

  async complete(tripId: string, actualOdometer: number, fuelUsed: number, actualDistance?: number) {
    return prisma.$transaction(async (tx) => {
      const trip = await tripRepository.findById(tripId, tx);
      if (!trip) throw new AppError(404, 'Trip not found');

      if (trip.status !== TripStatus.DISPATCHED) {
        throw new AppError(400, `Cannot complete trip in ${trip.status} status (must be DISPATCHED)`);
      }

      const vehicle = await vehicleRepository.findById(trip.vehicleId, tx);
      if (!vehicle) throw new AppError(400, 'Vehicle not found');

      const currentOdometer = Number(vehicle.odometer);
      if (actualOdometer < currentOdometer) {
        throw new AppError(400, `Data entry error: actual odometer (${actualOdometer}) cannot be less than current odometer (${currentOdometer})`);
      }

      // If actualDistance isn't provided, derive it from the odometer delta
      const calculatedDistance = actualDistance ?? (actualOdometer - currentOdometer);

      await vehicleRepository.update(vehicle.id, { 
        status: VehicleStatus.AVAILABLE,
        odometer: actualOdometer
      }, tx);

      await driverRepository.update(trip.driverId, { status: DriverStatus.AVAILABLE }, tx);

      return tripRepository.update(tripId, { 
        status: TripStatus.COMPLETED,
        completedAt: new Date(),
        actualDistance: calculatedDistance,
        fuelConsumed: fuelUsed
      }, tx);
    });
  },

  async cancel(tripId: string) {
    return prisma.$transaction(async (tx) => {
      const trip = await tripRepository.findById(tripId, tx);
      if (!trip) throw new AppError(404, 'Trip not found');

      if (trip.status === TripStatus.COMPLETED) {
        throw new AppError(400, 'A COMPLETED trip cannot be cancelled');
      }
      if (trip.status === TripStatus.CANCELLED) {
        throw new AppError(400, 'Trip is already cancelled');
      }

      if (trip.status === TripStatus.DISPATCHED) {
        await vehicleRepository.update(trip.vehicleId, { status: VehicleStatus.AVAILABLE }, tx);
        await driverRepository.update(trip.driverId, { status: DriverStatus.AVAILABLE }, tx);
      }

      return tripRepository.update(tripId, { status: TripStatus.CANCELLED }, tx);
    });
  },

  async findAll(query: any) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filters: TripFilters = {
      status: query.status,
      startDate: query.startDate,
      endDate: query.endDate,
      skip,
      take: limit
    };

    return tripRepository.findAll(filters);
  },

  async findById(id: string) {
    const trip = await tripRepository.findById(id);
    if (!trip) {
      throw new AppError(404, 'Trip not found');
    }
    return trip;
  }
};
