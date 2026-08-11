import Joi from 'joi';

export const reportQuerySchema = Joi.object({
  month: Joi.string()
    .pattern(/^\d{4}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'month must be in YYYY-MM format',
      'any.required': 'month is required',
    }),
  vehicle_id: Joi.number().integer().positive().optional(),
});
