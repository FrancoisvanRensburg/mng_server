const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  registerCompany,
  registerUser,
} = require('../controllers/registerController');

const {
  companySignUpValidator,
  userRegistrationValidator,
} = require('../validators/auth');

const { runValidation } = require('../validators/index');

router.post('/company', companySignUpValidator, runValidation, registerCompany);

router.post(
  '/user',
  auth,
  userRegistrationValidator,
  runValidation,
  registerUser
);

module.exports = router;
