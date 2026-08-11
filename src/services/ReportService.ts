import { db } from '../config/database';
import { RentalReportItem, MonthlyReport } from '../types/report.types';

export class ReportService {
  async getMonthlyRentals(
    month: string,
    vehicleId?: number
  ): Promise<MonthlyReport> {
    const [year, monthNum] = month.split('-').map(Number);
    const monthStart = `${year}-${String(monthNum).padStart(2, '0')}-01`;

    const lastDay = new Date(year, monthNum, 0).getDate();
    const monthEnd = `${year}-${String(monthNum).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    let query = db('rentals as r')
      .join('vehicles as v', 'r.vehicle_id', 'v.id')
      .where('r.status', '!=', 'cancelled')
      .where('r.start_date', '<=', monthEnd)
      .where('r.end_date', '>=', monthStart)
      .select(
        'v.id as vehicle_id',
        'v.name',
        db.raw(`
          COUNT(*)::int as total_bookings
        `),
        db.raw(`
          SUM(
            (EXTRACT(DAY FROM (
              LEAST(r.end_date::date, DATE ?) -
              GREATEST(r.start_date::date, DATE ?)
            )) + 1)
          )::int as days_rented
        `, [monthEnd, monthStart]),
        db.raw(`
          SUM(
            (EXTRACT(DAY FROM (
              LEAST(r.end_date::date, DATE ?) -
              GREATEST(r.start_date::date, DATE ?)
            )) + 1) * v.daily_rate
          )::numeric(10,2) as revenue
        `, [monthEnd, monthStart])
      )
      .groupBy('v.id', 'v.name')
      .orderBy('revenue', 'desc');

    if (vehicleId) {
      query = query.where('v.id', vehicleId);
    }

    const rows = await query;

    const vehicles: RentalReportItem[] = rows.map((row: any) => ({
      vehicle_id: row.vehicle_id,
      name: row.name,
      total_bookings: row.total_bookings,
      days_rented: row.days_rented,
      revenue: parseFloat(row.revenue) || 0,
    }));

    const topVehicle = vehicles.length > 0 ? vehicles[0] : null;

    return {
      month,
      vehicles,
      top_vehicle: topVehicle,
    };
  }
}

export const reportService = new ReportService();
