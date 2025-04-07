import { body } from 'express-validator';

export const siteValidator = [
  body('name')
    .notEmpty()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters'),
  body('location')
    .notEmpty()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Location must be between 5 and 200 characters'),
  body('status')
    .isInt({ min: 0, max: 1 })
    .withMessage('Status must be 0 or 1'),
  body('state')
    .isInt({ min: 1 })
    .withMessage('Invalid state'),
  body('municipality')
    .isInt({ min: 1 })
    .withMessage('Invalid municipality')
];