const { check } = require('express-validator');

exports.companySignUpValidator = [
  check('longname').not().isEmpty().withMessage('Comapny name is required'),
  check('shortname').not().isEmpty().withMessage('please add a domain'),
  // Add project prefix at a later stage
  // check('projectprefix', 'Long name is required').not().isEmpty(),
  check('firstname').not().isEmpty().withMessage('Firstname name is required'),
  check('lastname').not().isEmpty().withMessage('Surname add a domain'),
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least  6 characters long'),
];

exports.userRegistrationValidator = [
  // At a later stage, include user department and team.
  check('email', 'Email is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty(),
  check('firstname', 'First name is required').not().isEmpty(),
  check('lastname', 'Last name is required').not().isEmpty(),
  check('usertype', 'User type is required').not().isEmpty(),
];

exports.userSigninValidator = [
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least  6 characters long'),
];
