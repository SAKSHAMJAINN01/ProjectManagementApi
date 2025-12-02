import { body, param } from 'express-validator';

export const validators = {
  createUser: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 255 })
      .withMessage('Name must be less than 255 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail()
  ],

  createProject: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 255 })
      .withMessage('Name must be less than 255 characters'),
    body('description')
      .optional()
      .trim(),
    body('owner_id')
      .notEmpty()
      .withMessage('Owner ID is required')
      .isUUID()
      .withMessage('Owner ID must be a valid UUID')
  ],

  createTask: [
    body('project_id')
      .notEmpty()
      .withMessage('Project ID is required')
      .isUUID()
      .withMessage('Project ID must be a valid UUID'),
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 255 })
      .withMessage('Title must be less than 255 characters'),
    body('description')
      .optional()
      .trim(),
    body('assigned_to')
      .optional()
      .isUUID()
      .withMessage('Assigned to must be a valid UUID')
  ],

  createComment: [
    param('id')
      .isUUID()
      .withMessage('Task ID must be a valid UUID'),
    body('user_id')
      .notEmpty()
      .withMessage('User ID is required')
      .isUUID()
      .withMessage('User ID must be a valid UUID'),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
  ],

  uuidParam: [
    param('id')
      .isUUID()
      .withMessage('ID must be a valid UUID')
  ]
};
