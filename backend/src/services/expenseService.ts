import { expenseRepository, ExpenseFilters } from '../repositories/expenseRepository';
import { vehicleRepository } from '../repositories/vehicleRepository';
import { AppError } from '../utils/AppError';
import { ExpenseType } from '@prisma/client';

export const expenseService = {
  async create(data: { vehicleId: string; type: ExpenseType; amount: number; description: string; date?: string }) {
    const vehicle = await vehicleRepository.findById(data.vehicleId);
    if (!vehicle) throw new AppError(404, 'Vehicle not found');

    if (!Object.values(ExpenseType).includes(data.type)) {
      throw new AppError(400, `Invalid expense type: ${data.type}`);
    }

    return expenseRepository.create({
      vehicleId: data.vehicleId,
      type: data.type,
      amount: data.amount,
      description: data.description,
      date: data.date ? new Date(data.date) : new Date()
    });
  },

  async findAll(query: any) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filters: ExpenseFilters = {
      vehicleId: query.vehicleId,
      type: query.type,
      startDate: query.startDate,
      endDate: query.endDate,
      skip,
      take: limit
    };

    return expenseRepository.findAll(filters);
  }
};
