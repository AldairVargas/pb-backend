import { body } from 'express-validator';

export const roleValidator = [
  body('role_name')
    .notEmpty()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Role name must be between 3 and 50 characters')
];