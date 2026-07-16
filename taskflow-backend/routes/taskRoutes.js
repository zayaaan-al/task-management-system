const express = require('express');
const { body } = require('express-validator');
const { getTasks, getTask, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');

const router = express.Router();

// All task routes are protected
router.use(protect);

// GET /api/tasks — get all user tasks (supports ?status=&priority=&search= query params)
router.get('/', getTasks);

// GET /api/tasks/:id — get single task
router.get('/:id', getTask);

// POST /api/tasks — create new task
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Task title is required').isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    body('status').optional().isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status'),
    body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
    body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),
  ],
  validate,
  createTask
);

// PUT /api/tasks/:id — update a task
router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 200 }),
    body('status').optional().isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status'),
    body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
    body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),
  ],
  validate,
  updateTask
);

// DELETE /api/tasks/:id — delete a task
router.delete('/:id', deleteTask);

module.exports = router;
