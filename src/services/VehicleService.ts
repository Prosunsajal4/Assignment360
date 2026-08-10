import { db } from '../config/database';
import { Vehicle, PaginatedResponse } from '../types/vehicle.types';

export class VehicleService {
  private tableName = 'vehicles';

  async findAll(query: {
    page: number;
    limit: number;
    category?: string;
    search?: string;
  }): Promise<PaginatedResponse<Vehicle>> {
    const { page, limit, category, search } = query;
    const offset = (page - 1) * limit;

    let baseQuery = db(this.tableName).whereNull('deleted_at');

    if (category) {
      baseQuery = baseQuery.where('category', category);
    }
    if (search) {
      baseQuery = baseQuery.where('name', 'ilike', `%${search}%`);
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

  async findById(id: number): Promise<Vehicle | undefined> {
    return db(this.tableName).where({ id }).whereNull('deleted_at').first();
  }

  async create(data: {
    name: string;
    plate_number: string;
    category: string;
    daily_rate: number;
    photo_path?: string;
  }): Promise<Vehicle> {
    const [result] = await db(this.tableName).insert(data).returning('*');
    return result;
  }

  async update(
    id: number,
    data: {
      name?: string;
      plate_number?: string;
      category?: string;
      daily_rate?: number;
      photo_path?: string;
    }
  ): Promise<Vehicle | undefined> {
    const vehicle = await this.findById(id);
    if (!vehicle) return undefined;

    const [updated] = await db(this.tableName)
      .where({ id })
      .update({ ...data, updated_at: db.fn.now() })
      .returning('*');
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    const vehicle = await this.findById(id);
    if (!vehicle) return false;

    const updated = await db(this.tableName)
      .where({ id })
      .update({ deleted_at: new Date(), updated_at: db.fn.now() });
    return updated > 0;
  }
}

export const vehicleService = new VehicleService();
