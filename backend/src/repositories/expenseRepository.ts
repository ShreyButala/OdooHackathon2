import { prisma } from '../database';
import { Prisma, Expense, ExpenseType } from '@prisma/client';

export interface ExpenseFilters {
  vehicleId?: string;
  type?: ExpenseType;
  startDate?: string;
  endDate?: string;
  skip?: number;
  take?: number;
}

type PrismaClientOrTx = Prisma.TransactionClient | typeof prisma;

export const expenseRepository = {
  async create(data: Prisma.ExpenseUncheckedCreateInput, tx?: PrismaClientOrTx): Promise<Expense> {
    const client = tx || prisma;
    return client.expense.create({ data });
  },

  async findAll(filters: ExpenseFilters, tx?: PrismaClientOrTx): Promise<{ data: Expense[]; total: number }> {
    const client = tx || prisma;
    const where: Prisma.ExpenseWhereInput = {};
    if (filters.vehicleId) where.vehicleId = filters.vehicleId;
    if (filters.type) where.type = filters.type;
    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = new Date(filters.startDate);
      if (filters.endDate) where.date.lte = new Date(filters.endDate);
    }

    const [data, total] = await Promise.all([
      client.expense.findMany({
        where,
        ...(filters.skip !== undefined && { skip: filters.skip }),
        ...(filters.take !== undefined && { take: filters.take }),
        orderBy: { date: 'desc' }
      }),
      client.expense.count({ where })
    ]);

    return { data, total };
  }
};
