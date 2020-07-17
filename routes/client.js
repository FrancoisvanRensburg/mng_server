const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  createClient,
  updateClient,
  getAllClients,
  getClientById,
} = require('../controllers/clientController');

const { clientRegisterValidator } = require('../validators/client');

const { runValidation } = require('../validators/index');

// POST /api/clients
// Private
router.post('/', auth, clientRegisterValidator, runValidation, createClient);

// POST /api/clients/:clientId
// Private
router.post('/:clientId', auth, updateClient);

// GET /api/clients
// Private
router.get('/', auth, getAllClients);

// GET /api/clients/:clientId
// Private
router.get('/:clientId', auth, getClientById);

module.exports = router;
