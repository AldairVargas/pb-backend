import { body } from 'express-validator';

export const rentValidator = [
  body('start_date')
    .isDate()
    .withMessage('Invalid start date'),
  body('expiration_date')
    .isDate()
    .withMessage('Invalid expiration date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.start_date)) {
        throw new Error('Expiration date must be after start date');
      }
      return true;
    }),
  body('status')
    .isIn(['active', 'expired', 'finished'])
    .withMessage('Invalid status'),
  body('user_id')
    .isInt({ min: 1 })
    .withMessage('Invalid user ID'),
  body('warehouse_id')
    .isInt({ min: 1 })
    .withMessage('Invalid warehouse ID')
];

export const rentStatusValidator = [
  body('status')
    .isIn(['active', 'expired', 'finished'])
    .withMessage('Invalid status')
];