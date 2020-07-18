const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const actionNotificationSchema = new Schema({
  //   sender: { type: Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  notificationType: { type: String },
  notificationTask: { type: Schema.Types.ObjectId, ref: 'Task' },
  notificationProject: { type: Schema.Types.ObjectId, ref: 'Project' },
  read: { type: Boolean, default: false },
});

module.exports = mongoose.model('ActionNotification', actionNotificationSchema);
