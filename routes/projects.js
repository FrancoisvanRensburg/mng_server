const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  createProjectValidator,
  setupProjectValidator,
} = require('../validators/project');

const { runValidation } = require('../validators/index');

const {
  createProject,
  addContributors,
  changeProjectManager,
  updateProjectSetup,
  addProjectClient,
  deleteProjectById,
  getAllProjects,
  getProjectById,
  getAllProjectForCurrentUser,
} = require('../controllers/projectController');

// POST api/projects
// Private
router.post('/', auth, createProjectValidator, runValidation, createProject);

router.post('/contributors/:projectId', auth, addContributors);

router.post('/manager/:projectId', auth, changeProjectManager);

router.post(
  '/setup/:projectId',
  auth,
  setupProjectValidator,
  runValidation,
  updateProjectSetup
);

router.post('/client/:projectId', auth, addProjectClient);

router.delete('/:projectId', auth, deleteProjectById);

router.get('/company', auth, getAllProjects);

router.get('/:projectId', auth, getProjectById);

router.get('/', auth, getAllProjectForCurrentUser);

module.exports = router;
