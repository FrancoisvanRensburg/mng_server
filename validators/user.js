const { check } = require('express-validator');

exports.updateLoggedInUserValidator = [
  check('firstname').not().isEmpty().withMessage('First name is required'),
  check('lastname').not().isEmpty().withMessage('Surname is required'),
];
