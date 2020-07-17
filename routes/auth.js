const express = require('express');
const router = express.Router();

const { signIn } = require('../controllers/authController');

const { userSigninValidator } = require('../validators/auth');

const { runValidation } = require('../validators/index');

// @route   POST /api/auth
// @desc    Login route: authenticate a user and generate a JWT
// @access  Public
router.post('/', userSigninValidator, runValidation, signIn);

module.exports = router;
