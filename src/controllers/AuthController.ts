import { Request, Response } from 'express';
import { authService } from '../services/AuthService';
import { loginSchema } from '../validators/auth.validator';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
      if (error) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.details.map((d) => d.message),
        });
        return;
      }

      const result = await authService.login(value);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(401).json({ error: err.message || 'Authentication failed' });
    }
  }
}

export const authController = new AuthController();
