import Joi from 'joi';

export const vehicleCreateSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  plate_number: Joi.string().min(1).max(100).required(),
  category: Joi.string().min(1).max(100).required(),
  daily_rate: Joi.number().positive().precision(2).required(),
});

export const vehicleUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  plate_number: Joi.string().min(1).max(100).optional(),
  category: Joi.string().min(1).max(100).optional(),
  daily_rate: Joi.number().positive().precision(2).optional(),
}).min(1);

export const vehicleQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  category: Joi.string().optional(),
  search: Joi.string().optional(),
});
