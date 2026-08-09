export interface RentalReportItem {
  vehicle_id: number;
  name: string;
  total_bookings: number;
  days_rented: number;
  revenue: number;
}

export interface MonthlyReport {
  month: string;
  vehicles: RentalReportItem[];
  top_vehicle: RentalReportItem | null;
}
