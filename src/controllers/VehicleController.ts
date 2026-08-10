import { Request, Response } from 'express';
import { vehicleService } from '../services/VehicleService';
import {
  vehicleCreateSchema,
  vehicleUpdateSchema,
  vehicleQuerySchema,
} from '../validators/vehicle.validator';

export class VehicleController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = vehicleQuerySchema.validate(req.query, { abortEarly: false });
      if (error) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.details.map((d) => d.message),
        });
        return;
      }

      const result = await vehicleService.findAll(value);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch vehicles' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid vehicle ID' });
        return;
      }

      const vehicle = await vehicleService.findById(id);
      if (!vehicle) {
        res.status(404).json({ error: 'Vehicle not found' });
        return;
      }

      res.status(200).json(vehicle);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch vehicle' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const body = {
        name: req.body.name,
        plate_number: req.body.plate_number,
        category: req.body.category,
        daily_rate: req.body.daily_rate ? parseFloat(req.body.daily_rate) : undefined,
      };

      const { error, value } = vehicleCreateSchema.validate(body, { abortEarly: false });
      if (error) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.details.map((d) => d.message),
        });
        return;
      }

      const photoPath = req.file ? req.file.filename : undefined;
      const vehicle = await vehicleService.create({ ...value, photo_path: photoPath });
      res.status(201).json(vehicle);
    } catch (err: any) {
      if (err.code === '23505') {
        res.status(409).json({ error: 'A vehicle with this plate number already exists' });
        return;
      }
      res.status(500).json({ error: err.message || 'Failed to create vehicle' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid vehicle ID' });
        return;
      }

      const body: Record<string, unknown> = {};
      if (req.body.name !== undefined) body.name = req.body.name;
      if (req.body.plate_number !== undefined) body.plate_number = req.body.plate_number;
      if (req.body.category !== undefined) body.category = req.body.category;
      if (req.body.daily_rate !== undefined) body.daily_rate = parseFloat(req.body.daily_rate);

      const { error, value } = vehicleUpdateSchema.validate(body, { abortEarly: false });
      if (error) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.details.map((d) => d.message),
        });
        return;
      }

      if (req.file) {
        value.photo_path = req.file.filename;
      }

      const vehicle = await vehicleService.update(id, value);
      if (!vehicle) {
        res.status(404).json({ error: 'Vehicle not found' });
        return;
      }

      res.status(200).json(vehicle);
    } catch (err: any) {
      if (err.code === '23505') {
        res.status(409).json({ error: 'A vehicle with this plate number already exists' });
        return;
      }
      res.status(500).json({ error: err.message || 'Failed to update vehicle' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid vehicle ID' });
        return;
      }

      const deleted = await vehicleService.delete(id);
      if (!deleted) {
        res.status(404).json({ error: 'Vehicle not found' });
        return;
      }

      res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete vehicle' });
    }
  }
}

export const vehicleController = new VehicleController();
