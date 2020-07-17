const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  createTaskValidator,
  updateTaskValidator,
} = require('../validators/task');

const { runValidation } = require('../validators/index');

const {
  createTaskForProject,
  updateTaskById,
} = require('../controllers/taskController');

router.post(
  '/:projectId',
  auth,
  createTaskValidator,
  runValidation,
  createTaskForProject
);

router.put(
  '/:taskId',
  auth,
  updateTaskValidator,
  runValidation,
  updateTaskById
);

module.exports = router;
