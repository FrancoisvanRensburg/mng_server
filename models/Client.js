const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  company: { type: Schema.Types.ObjectId, ref: 'Company' },
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  name: { type: String, required: true },
  description: { type: String },
  contactperson: { type: String, required: true },
  email: { type: String, required: true },
  contnumber: { type: String },
});

module.exports = mongoose.model('Client', clientSchema);
