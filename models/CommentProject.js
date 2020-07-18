const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentProjectSchema = new Schema({
  date: { type: Date, default: Date.now },
  message: { type: String, trim: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
});

module.exports = mongoose.model('CommentProject', commentProjectSchema);
