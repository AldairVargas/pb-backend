import { body } from 'express-validator';

export const warehouseValidator = [
  body('code')
    .notEmpty()
    .isLength({ min: 3, max: 20 })
    .matches(/^[A-Za-z0-9-]+$/)
    .withMessage('Code must be alphanumeric with hyphens only'),
  body('dimensions')
    .notEmpty()
    .matches(/^\d+x\d+x\d+\s*(?:meters?|m)?$/i)
    .withMessage('Dimensions must be in format: LxWxH meters'),
  body('monthly_price')
    .isFloat({ min: 0 })
    .withMessage('Monthly price must be a positive number'),
  body('status')
    .isIn(['available', 'occupied', 'maintenance'])
    .withMessage('Invalid status'),
  body('site_id')
    .isInt({ min: 1 })
    .withMessage('Invalid site ID'),
  body(['photo1', 'photo2', 'photo3', 'photo4', 'photo5'])
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage('Invalid photo format')
];

export const warehouseStatusValidator = [
  body('status')
    .isIn(['available', 'occupied', 'maintenance'])
    .withMessage('Invalid status')
];