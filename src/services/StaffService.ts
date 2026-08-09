import { db } from '../config/database';
import { Staff } from '../types/staff.types';

export class StaffService {
  private tableName = 'staff';

  async findByEmail(email: string): Promise<Staff | undefined> {
    return db(this.tableName).where({ email }).first();
  }

  async findById(id: number): Promise<Staff | undefined> {
    return db(this.tableName).where({ id }).first();
  }
}

export const staffService = new StaffService();
