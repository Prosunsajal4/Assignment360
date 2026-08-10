import { Request, Response } from 'express';
import { rentalService } from '../services/RentalService';
import {
  rentalCreateSchema,
  rentalUpdateSchema,
  rentalQuerySchema,
} from '../validators/rental.validator';

export class RentalController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = rentalQuerySchema.validate(req.query, { abortEarly: false });
      if (error) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.details.map((d) => d.message),
        });
        return;
      }

      const result = await rentalService.findAll(value);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch rentals' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid rental ID' });
        return;
      }

      const rental = await rentalService.findById(id);
      if (!rental) {
        res.status(404).json({ error: 'Rental not found' });
        return;
      }

      res.status(200).json(rental);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch rental' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = rentalCreateSchema.validate(req.body, { abortEarly: false });
      if (error) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.details.map((d) => d.message),
        });
        return;
      }

      const rental = await rentalService.create(value);
      res.status(201).json(rental);
    } catch (err: any) {
      if (err.message && err.message.startsWith('CONFLICT')) {
        res.status(409).json({ error: err.message.replace('CONFLICT: ', '') });
        return;
      }
      res.status(500).json({ error: err.message || 'Failed to create rental' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid rental ID' });
        return;
      }

      const { error, value } = rentalUpdateSchema.validate(req.body, { abortEarly: false });
      if (error) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.details.map((d) => d.message),
        });
        return;
      }

      const rental = await rentalService.update(id, value);
      if (!rental) {
        res.status(404).json({ error: 'Rental not found' });
        return;
      }

      res.status(200).json(rental);
    } catch (err: any) {
      if (err.message && err.message.startsWith('CONFLICT')) {
        res.status(409).json({ error: err.message.replace('CONFLICT: ', '') });
        return;
      }
      res.status(500).json({ error: err.message || 'Failed to update rental' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid rental ID' });
        return;
      }

      const deleted = await rentalService.delete(id);
      if (!deleted) {
        res.status(404).json({ error: 'Rental not found' });
        return;
      }

      res.status(200).json({ message: 'Rental deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete rental' });
    }
  }
}

export const rentalController = new RentalController();
