import { Request, Response } from 'express';
import { reportService } from '../services/ReportService';
import { reportQuerySchema } from '../validators/report.validator';

export class ReportController {
  async getRentalReport(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = reportQuerySchema.validate(req.query, { abortEarly: false });
      if (error) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.details.map((d) => d.message),
        });
        return;
      }

      const report = await reportService.getMonthlyRentals(value.month, value.vehicle_id);
      res.status(200).json(report);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to generate report' });
    }
  }
}

export const reportController = new ReportController();
