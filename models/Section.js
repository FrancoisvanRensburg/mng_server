const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sectionSchema = new Schema({
  label: { type: String, trim: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
});

module.exports = mongoose.model('Section', sectionSchema);
