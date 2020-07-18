const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { signIn, signedIn } = require('../controllers/authController');

const { userSigninValidator } = require('../validators/auth');

const { runValidation } = require('../validators/index');

// @route   POST /api/auth
// @desc    Login route: authenticate a user and generate a JWT
// @access  Public
router.post('/', userSigninValidator, runValidation, signIn);

router.get('/', auth, signedIn);

module.exports = router;
