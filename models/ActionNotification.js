const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const actionNotificationSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  reciever: { type: Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  notificationData: { tyoe: Object },
  read: { type: Boolean, default: false },
});

module.exports = mongoose.model('ActionNotification', actionNotificationSchema);
