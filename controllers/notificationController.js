const ActionNotification = require('../models/ActionNotification');
const User = require('../models/User');

exports.getActionNotificationsUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.data.user })
      .select('actionnotifications')
      .populate({
        path: 'actionnotifications',
        select: 'date notificationType notificationTask',
      });
    res.json(user.actionnotifications);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};
