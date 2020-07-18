const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentTaskSchema = new Schema({
  date: { type: Date, default: Date.now },
  message: { type: String, trim: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  task: { type: Schema.Types.ObjectId, ref: 'Task' },
});

module.exports = mongoose.model('CommentTask', commentTaskSchema);
