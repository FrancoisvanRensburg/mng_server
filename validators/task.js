const { check } = require('express-validator');

exports.createTaskValidator = [
  check('taskname').not().isEmpty().withMessage('Task name is required'),
  check('actualenddate').custom((value, { req }) => {
    if (new Date(value) <= new Date(req.body.actualstartdate)) {
      throw new Error('End date must be after start date');
    }
    return true;
  }),
];

exports.updateTaskValidator = [
  // check('taskname').not().isEmpty().withMessage('Task name is required'),
  check('actualenddate').custom((value, { req }) => {
    if (new Date(value) <= new Date(req.body.actualstartdate)) {
      throw new Error('End date must be after start date');
    }
    return true;
  }),
  //   Predecessor validation goes here
  // finish to start
  // if task run simultaniously
  // if task starts when predecessor is allready running
  // etc.
  // Have to define with Wilhelm/Naas

  //   Include task start date and task end date limits to project start date and and date
];
