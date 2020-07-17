const Company = require('../models/Company');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');

exports.registerCompany = async (req, res) => {
  // Create objects from the body
  const {
    longname,
    shortname,
    // projectprefix,
    email,
    password,
    firstname,
    lastname,
  } = req.body;

  // Populate the company object with the request body
  const companyFields = {};
  if (longname) companyFields.longname = longname;
  if (shortname) companyFields.shortname = shortname;
  // if (projectprefix) companyFields.projectprefix = projectprefix;

  try {
    //   Create a new company entry
    let company = new Company(companyFields);

    const userFields = {};
    userFields.company = company._id;
    if (email) userFields.email = email;
    if (password) userFields.password = password;
    if (firstname) userFields.firstname = firstname;
    if (lastname) userFields.lastname = lastname;
    userFields.usertype = 'Adm';

    const user = new User(userFields);

    // Encrypt user password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    company.employees.unshift(user._id);
    await company.save();

    const payload = {
      data: {
        user: user._id,
        comp: user.company,
      },
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

exports.registerUser = async (req, res) => {
  const { email, password, firstname, lastname, usertype } = req.body;

  const userFields = {};
  if (email) userFields.email = email;
  if (password) userFields.password = password;
  if (firstname) userFields.firstname = firstname;
  if (lastname) userFields.lastname = lastname;
  if (usertype) userFields.usertype = usertype;
  userFields.company = req.data.comp;

  try {
    // Create new user object
    const user = new User(userFields);

    // Encrypt user password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Create dual link in company
    const company = await Company.findOne({ _id: req.data.comp });
    company.employees.unshift(user._id);

    // Save user and company
    await user.save();
    await company.save();

    const comp = await Company.findOne({ _id: req.data.comp }).populate(
      'employees',
      'firstname lastname email usertype'
    );

    res.json(comp.employees);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};
