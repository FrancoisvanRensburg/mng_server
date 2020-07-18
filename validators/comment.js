const { check } = require('express-validator');

exports.commentValidator = [
  check('message').not().isEmpty().withMessage('Please ender a message'),
];
