import { Request, Response } from 'express';
import { expenseService } from '../services/expenseService';
import { createExpenseSchema, queryExpenseSchema } from '../validators/expenseValidator';
import { AppError } from '../utils/AppError';

export const expenseController = {
  async create(req: Request, res: Response) {
    const parsed = createExpenseSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(e => e.message).join(', ');
      throw new AppError(400, `Validation Error: ${errorMsg}`);
    }

    const expense = await expenseService.create(parsed.data);
    res.status(201).json(expense);
  },

  async findAll(req: Request, res: Response) {
    const parsed = queryExpenseSchema.safeParse(req.query);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(e => e.message).join(', ');
      throw new AppError(400, `Validation Error: ${errorMsg}`);
    }

    const result = await expenseService.findAll(parsed.data);
    res.status(200).json(result);
  }
};
