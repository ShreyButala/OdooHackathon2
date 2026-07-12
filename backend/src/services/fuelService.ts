import { fuelLogRepository, FuelLogFilters } from '../repositories/fuelLogRepository';
import { vehicleRepository } from '../repositories/vehicleRepository';
import { tripRepository } from '../repositories/tripRepository';
import { AppError } from '../utils/AppError';

export const fuelService = {
  async create(data: { vehicleId: string; tripId?: string; liters: number; cost: number; date?: string }) {
    const vehicle = await vehicleRepository.findById(data.vehicleId);
    if (!vehicle) throw new AppError(404, 'Vehicle not found');

    if (data.tripId) {
      const trip = await tripRepository.findById(data.tripId);
      if (!trip) throw new AppError(404, 'Trip not found');

      if (trip.vehicleId !== data.vehicleId) {
        throw new AppError(400, 'Trip does not belong to the specified vehicle');
      }
    }

    return fuelLogRepository.create({
      vehicleId: data.vehicleId,
      tripId: data.tripId,
      liters: data.liters,
      cost: data.cost,
      date: data.date ? new Date(data.date) : new Date()
    });
  },

  async findAll(query: any) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filters: FuelLogFilters = {
      vehicleId: query.vehicleId,
      tripId: query.tripId,
      startDate: query.startDate,
      endDate: query.endDate,
      skip,
      take: limit
    };

    return fuelLogRepository.findAll(filters);
  }
};
