const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  companyInfo,
  companyUpdate,
} = require('../controllers/companyController');

// GET /api/company
// Private access
router.get('/', auth, companyInfo);

// POST /api/company
// Private access
router.post('/', auth, companyUpdate);

module.exports = router;
