import { Request, Response } from 'express';
import { reportService } from '../services/reportService';
import { queryReportSchema } from '../validators/reportValidator';
import { AppError } from '../utils/AppError';

export const reportController = {
  async getReports(req: Request, res: Response) {
    const parsed = queryReportSchema.safeParse(req.query);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(e => e.message).join(', ');
      throw new AppError(400, `Validation Error: ${errorMsg}`);
    }

    const reports = await reportService.getReports(parsed.data);
    res.status(200).json(reports);
  }
};
