import { db } from '../config/database';
import { Rental, RentalStatus, PaginatedResponse } from '../types/rental.types';

export class RentalService {
  private tableName = 'rentals';

  async findAll(query: {
    page: number;
    limit: number;
    vehicle_id?: number;
    status?: RentalStatus;
    start_date?: string;
    end_date?: string;
  }): Promise<PaginatedResponse<Rental>> {
    const { page, limit, vehicle_id, status, start_date, end_date } = query;
    const offset = (page - 1) * limit;

    let baseQuery = db(this.tableName);

    if (vehicle_id) {
      baseQuery = baseQuery.where('vehicle_id', vehicle_id);
    }
    if (status) {
      baseQuery = baseQuery.where('status', status);
    }
    if (start_date) {
      baseQuery = baseQuery.where('start_date', '>=', start_date);
    }
    if (end_date) {
      baseQuery = baseQuery.where('end_date', '<=', end_date);
    }

    const countResult = await baseQuery.clone().count('id as total').first();
    const total = Number(countResult?.total) || 0;

    const data = await baseQuery
      .select('*')
      .orderBy('id', 'desc')
      .limit(limit)
      .offset(offset);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number): Promise<Rental | undefined> {
    return db(this.tableName).where({ id }).first();
  }

  async hasOverlap(
    vehicleId: number,
    startDate: string,
    endDate: string,
    excludeRentalId?: number
  ): Promise<boolean> {
    let query = db(this.tableName)
      .where('vehicle_id', vehicleId)
      .whereNot('status', 'cancelled')
      .where(function () {
        this.where('start_date', '<=', endDate).andWhere('end_date', '>=', startDate);
      });

    if (excludeRentalId) {
      query = query.andWhereNot('id', excludeRentalId);
    }

    const overlap = await query.first();
    return !!overlap;
  }

  async calculateTotalAmount(vehicleId: number, startDate: string, endDate: string): Promise<number> {
    const vehicle = await db('vehicles').where({ id: vehicleId }).first();
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return Number(vehicle.daily_rate) * days;
  }

  async create(data: {
    vehicle_id: number;
    customer_name: string;
    customer_phone: string;
    start_date: string;
    end_date: string;
  }): Promise<Rental> {
    const hasOverlap = await this.hasOverlap(data.vehicle_id, data.start_date, data.end_date);
    if (hasOverlap) {
      throw new Error('CONFLICT: Vehicle already has an active rental overlapping these dates');
    }

    const totalAmount = await this.calculateTotalAmount(data.vehicle_id, data.start_date, data.end_date);

    const [result] = await db(this.tableName)
      .insert({
        ...data,
        total_amount: totalAmount,
        status: 'booked',
      })
      .returning('*');
    return result;
  }

  async update(
    id: number,
    data: {
      vehicle_id?: number;
      customer_name?: string;
      customer_phone?: string;
      start_date?: string;
      end_date?: string;
      status?: RentalStatus;
    }
  ): Promise<Rental | undefined> {
    const existing = await this.findById(id);
    if (!existing) return undefined;

    const vehicleId = data.vehicle_id ?? existing.vehicle_id;
    const startDate = data.start_date ?? existing.start_date;
    const endDate = data.end_date ?? existing.end_date;

    if (data.start_date || data.end_date || data.vehicle_id) {
      const hasOverlap = await this.hasOverlap(vehicleId, startDate, endDate, id);
      if (hasOverlap) {
        throw new Error('CONFLICT: Vehicle already has an active rental overlapping these dates');
      }
    }

    let totalAmount = existing.total_amount;
    if (data.start_date || data.end_date || data.vehicle_id) {
      totalAmount = await this.calculateTotalAmount(vehicleId, startDate, endDate);
    }

    const [updated] = await db(this.tableName)
      .where({ id })
      .update({
        ...data,
        total_amount: totalAmount,
        updated_at: db.fn.now(),
      })
      .returning('*');
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing) return false;

    const deleted = await db(this.tableName).where({ id }).del();
    return deleted > 0;
  }
}

export const rentalService = new RentalService();
