import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { staffService } from './StaffService';
import { StaffLoginRequest, AuthResponse } from '../types/staff.types';

export class AuthService {
  async login(data: StaffLoginRequest): Promise<AuthResponse> {
    const staff = await staffService.findByEmail(data.email);
    if (!staff) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, staff.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const tokenPayload = {
      staffId: staff.id,
      email: staff.email,
      name: staff.name,
    };

    const token = jwt.sign(tokenPayload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as any,
    });

    return {
      token,
      staff: {
        id: staff.id,
        email: staff.email,
        name: staff.name,
      },
    };
  }
}

export const authService = new AuthService();
