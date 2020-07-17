const { check, sanitize } = require('express-validator');

exports.createProjectValidator = [
  check('projectname').not().isEmpty().withMessage('Project name is required'),
  check('projectcode').not().isEmpty().withMessage('Project code is required'),
];

exports.setupProjectValidator = [
  check('actualenddate').custom((value, { req }) => {
    if (new Date(value) <= new Date(req.body.actualstartdate)) {
      throw new Error('End date must be after start date');
    }
    return true;
  }),
];
