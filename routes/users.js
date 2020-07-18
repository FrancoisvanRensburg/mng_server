const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { updateLoggedInUserValidator } = require('../validators/user');

const { runValidation } = require('../validators/index');

const {
  getAllUsersForCompany,
  getCurrentUser,
  getUserExtendedProfile,
  updateLoggenInUserInformation,
  deleteUserById,
} = require('../controllers/userController');

router.get('/', auth, getAllUsersForCompany);

router.get('/me', auth, getCurrentUser);

// Check the relevance of this route, i.e. if it is needed or can it be removed
router.get('/:userId', auth, getUserExtendedProfile);

router.post(
  '/me',
  auth,
  updateLoggedInUserValidator,
  runValidation,
  updateLoggenInUserInformation
);

router.delete('/:usedId', auth, deleteUserById);

module.exports = router;
