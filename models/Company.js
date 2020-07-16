const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Company default currency has to be set up during admin stuffs
const companySchema = new Schema({
  longname: { type: String, required: true, trim: true },
  shortname: { type: String, required: true, trim: true },
  projectprefix: { type: String, required: true, trim: true, min: 1, max: 3 },
  employees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  clients: [{ type: Schema.Types.ObjectId, ref: 'Client' }],
  addressline1: { type: String, trim: true },
  addressline2: { type: String, trim: true },
  addressline3: { type: String, trim: true },
  country: { type: String, trim: true },
  companylogo: { type: String },
});

module.exports = mongoose.model('Company', companySchema);
