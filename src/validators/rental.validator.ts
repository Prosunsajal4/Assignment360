import Joi from 'joi';

export const rentalCreateSchema = Joi.object({
  vehicle_id: Joi.number().integer().positive().required(),
  customer_name: Joi.string().min(1).max(255).required(),
  customer_phone: Joi.string().min(1).max(100).required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().min(Joi.ref('start_date')).required().messages({
    'date.min': 'end_date must be on or after start_date',
  }),
});

export const rentalUpdateSchema = Joi.object({
  vehicle_id: Joi.number().integer().positive().optional(),
  customer_name: Joi.string().min(1).max(255).optional(),
  customer_phone: Joi.string().min(1).max(100).optional(),
  start_date: Joi.date().optional(),
  end_date: Joi.date().optional(),
  status: Joi.string().valid('booked', 'ongoing', 'completed', 'cancelled').optional(),
}).min(1);

export const rentalQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  vehicle_id: Joi.number().integer().positive().optional(),
  status: Joi.string().valid('booked', 'ongoing', 'completed', 'cancelled').optional(),
  start_date: Joi.date().optional(),
  end_date: Joi.date().optional(),
});
