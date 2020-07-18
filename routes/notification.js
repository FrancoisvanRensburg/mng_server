const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  getActionNotificationsUser,
} = require('../controllers/notificationController');

router.get('/', auth, getActionNotificationsUser);

module.exports = router;
