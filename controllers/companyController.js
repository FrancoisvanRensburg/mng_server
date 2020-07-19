const Company = require('../models/Company');

// Get all company info, i.e. company, employees, projects
exports.companyInfo = async (req, res) => {
  try {
    const company = await Company.findOne({ _id: req.data.comp })
      .populate('employees', 'firstname lastname email _id usertype')
      .populate('projects', 'projectname projectcode _id');

    res.json(company);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

// Update company information
exports.companyUpdate = async (req, res) => {
  const {
    longname,
    shortname,
    // projectprefix,
    addressline1,
    addressline2,
    addressline3,
    country,
    companylogo,
  } = req.body;

  const companyFields = {};
  if (longname) companyFields.longname = longname;
  if (shortname) companyFields.shortname = shortname;
  //   if (projectprefix) companyFields.projectprefix = projectprefix;
  if (addressline1) companyFields.addressline1 = addressline1;
  if (addressline2) companyFields.addressline2 = addressline2;
  if (addressline3) companyFields.addressline3 = addressline3;
  if (country) companyFields.country = country;
  if (companylogo) companyFields.companylogo = companylogo;

  try {
    let company = await Company.findOne({ _id: req.data.comp });

    company = await Company.findOneAndUpdate(
      { _id: req.data.comp },
      { $set: companyFields },
      { new: true }
    ).select('-employees -projects -clients');
    company.save();
    res.json(company);
    // console.log(company);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};
