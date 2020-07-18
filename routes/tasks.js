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
  deleteTaskById,
  getTaskById,
  getAllTasksForLoggedInUser,
  getAllTaskComments,
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

router.delete('/:taskId', auth, deleteTaskById);

router.get('/:taskId', auth, getTaskById);

router.get('/', auth, getAllTasksForLoggedInUser);

router.get('/comments/:taskId', auth, getAllTaskComments);

module.exports = router;
