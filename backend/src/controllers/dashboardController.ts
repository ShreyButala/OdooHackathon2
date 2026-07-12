import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboardService';

export const dashboardController = {
  async getSummary(req: Request, res: Response) {
    const summary = await dashboardService.getSummary();
    res.status(200).json(summary);
  }
};
