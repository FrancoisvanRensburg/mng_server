const Company = require('../models/Company');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const router = require('../routes/tasks');

// Get all users for a company
exports.getAllUsersForCompany = async (req, res) => {
  try {
    const employees = await User.find({ company: req.data.comp }).select(
      '-password -company -actionnotifications'
    );
    res.json(employees);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

// Get the extended profile of the logged in user. Route used to POST updates as well
exports.getCurrentUser = async (req, res) => {
  try {
    const me = await User.findOne({ _id: req.data.user })
      .select('-password')
      .populate(
        'projects',
        'projectname progress actualstartdate actualenddate'
      )
      .populate('tasks', 'taskname progress actualstartdate actualenddate');

    res.json(me);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(400).send('Server Error');
    }
  }
};

// @desc    Get the extended profile of a single user.
//          This route is not intended to be used by the token user.
exports.getUserExtendedProfile = async (req, res) => {
  try {
    const employee = await User.findOne({ _id: req.params.userId })
      .select('-password')
      .populate('projects')
      .populate('tasks')
      .populate('company', 'shortname');

    res.json(employee);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

// Update logged in user inforamtion
exports.updateLoggenInUserInformation = async (req, res) => {
  const { password, firstname, lastname } = req.body;

  const userFields = {};
  if (firstname) userFields.firstname = firstname;
  if (lastname) userFields.lastname = lastname;

  try {
    const me = await User.findOneAndUpdate(
      { _id: req.data.user },
      {
        $set: {
          firstname: userFields.firstname,
          lastname: userFields.lastname,
        },
      },
      { new: true }
    );

    res.json(me);
  } catch (error) {
    if (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
};

// Update conditionals if projects and tasks array of user is null or undifined that the user still gets deleted
// Delete a specific user
exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });

    // find all tasks assigned to this user and update to null
    const { tasks } = await User.findOne({ _id: req.params.userId });
    let task = {};
    let taskId = '';

    for (t in tasks) {
      taskId = tasks[t];

      task = await Task.findOneAndUpdate(
        { _id: taskId },
        { $set: { assignee: null } },
        { new: true }
      );
      task.save();
    }

    // Find all of the project IDs and splice the user out of the squad for each
    const { projects } = await User.findOne({ _id: req.params.userId });
    let projectId = '';
    let project = {};
    let pos = -1;

    for (p in projects) {
      projectId = projects[p];
      const { contributors } = await Project.findOne({ _id: projectId });

      pos = contributors.indexOf(req.params.userId);
      if (pos > -1) {
        contributors.splice(pos, 1);
      }

      project = await Project.findOneAndUpdate(
        { _id: projectId },
        { $set: { contributors: contributors } },
        { new: true }
      );
      project.save();
    }

    // Find all employees linked to the company the user is associated with, i.e. the one in the token
    const { employees } = await Company.findOne({ _id: req.data.comp });

    // Splice the user out of the employees array
    const index = employees.indexOf(req.params.userId);
    if (index > -1) {
      employees.splice(index, 1);
    }

    const company = await Company.findOneAndUpdate(
      { _id: req.data.comp },
      { $set: { employees: employees } },
      { new: true }
    );
    company.save();

    user.remove();

    res.json({ msg: 'User Removed' });
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};
