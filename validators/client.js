const { check } = require('express-validator');

exports.clientRegisterValidator = [
  check('name').not().isEmpty().withMessage('Client name is required'),
  check('contactperson')
    .not()
    .isEmpty()
    .withMessage('Client contact person is required'),
  check('email').isEmail().withMessage('Must be a valid email address'),
];
