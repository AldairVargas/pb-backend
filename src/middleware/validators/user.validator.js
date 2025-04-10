import { body } from 'express-validator';

export const userValidator = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
  
  body('first_name')
    .notEmpty()
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[A-Za-zÀ-ÿ\s]+$/)
    .withMessage('First name must be between 2 and 50 characters and contain only letters'),
  
  body('last_name')
    .notEmpty()
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[A-Za-zÀ-ÿ\s]+$/)
    .withMessage('Last name must be between 2 and 50 characters and contain only letters'),
  
  body('phone')
    .notEmpty()
    .matches(/^\d{10}$/)
    .withMessage('Phone number must be 10 digits'),
  
  body('role_id')
    .isInt({ min: 1, max: 3 })
    .withMessage('Invalid role ID (must be between 1 and 3)')
];

export const userUpdateValidator = [
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),
  
  body('password')
    .optional()
    .isLength({ min: 6 })
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
  
  body('first_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[A-Za-zÀ-ÿ\s]+$/)
    .withMessage('First name must be between 2 and 50 characters and contain only letters'),
  
  body('last_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[A-Za-zÀ-ÿ\s]+$/)
    .withMessage('Last name must be between 2 and 50 characters and contain only letters'),
  
  body('phone')
    .optional()
    .matches(/^\d{10}$/)
    .withMessage('Phone number must be 10 digits'),
  
  body('role_id')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('Invalid role ID (must be between 1 and 3)')
];