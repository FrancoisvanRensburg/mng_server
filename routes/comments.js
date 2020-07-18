const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { commentValidator } = require('../validators/comment');

const { runValidation } = require('../validators/index');

const {
  createCommentProject,
  createCommentTask,
} = require('../controllers/commentController');

// POST api/comments/project/:projectId
// Private
router.post(
  '/project/:projectId',
  auth,
  commentValidator,
  runValidation,
  createCommentProject
);

// POST api/comments/task/:taskId
// Private
router.post(
  '/task/:taskId',
  auth,
  commentValidator,
  runValidation,
  createCommentTask
);

module.exports = router;
