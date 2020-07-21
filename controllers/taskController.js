const Company = require('../models/Company');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const ActionNotification = require('../models/ActionNotification');
const Section = require('../models/Section');

// Investigate duel linking for notifiations.
// Currently the notifications are saved to the user model,
// but the user id is not saved in the notification array, why the fuck not

// Create a new task linked to the project
exports.createTaskForProject = async (req, res) => {
  const {
    assignee,
    tasknumber,
    taskname,
    actualstartdate,
    actualenddate,
    duration,
    effort,
    priority,
    predecessor,
    constrainttype,
    ragstatus,
  } = req.body;

  try {
    // Get company and project in order to get the prefixes
    const project = await Project.findOne({
      _id: req.params.projectId,
    })
      .select(
        '-projectname -projectcode -actualstartdate -actualenddate -description'
      )
      .populate(
        'tasks',
        'taskname actualstartdate actualenddate effort ragstatus progress'
      );
    const company = await Company.findOne({ _id: req.data.comp });

    const { projectcode } = project;
    const { projectprefix } = company;

    const taskFields = {};
    taskFields.project = req.params.projectId;
    if (assignee) taskFields.assignee = assignee;
    // Use the project prefix, and code to build the task number
    if (tasknumber) {
      taskFields.tasknumber =
        projectprefix + '-' + projectcode + '-' + tasknumber;
    }
    if (taskname) taskFields.taskname = taskname;
    if (actualstartdate) taskFields.actualstartdate = actualstartdate;
    if (actualenddate) taskFields.actualenddate = actualenddate;
    if (duration) taskFields.duration = duration;
    if (effort) taskFields.effort = effort;
    if (priority) taskFields.priority = priority;
    if (predecessor) taskFields.predecessor = predecessor;
    if (constrainttype) taskFields.constrainttype = constrainttype;
    if (ragstatus) taskFields.ragstatus = ragstatus;

    const task = new Task(taskFields);

    // If a user is specified, then dual link to the task created
    if (assignee) {
      const taskId = task._id;

      const user = await User.findOne({ _id: assignee });
      user.tasks.push(taskId);
      const notificationFields = {
        receiver: assignee,
        notificationType: 'task assigned',
        notificationTask: taskId,
      };

      const notification = new ActionNotification(notificationFields);
      user.actionnotifications.push(notification);

      user.save();
      notification.save();
    }

    project.tasks.push(task);

    await task.save();
    await project.save();

    const prjtsks = await Project.findOne({ _id: req.params.projectId })
      .select('tasks')
      .populate({
        path: 'tasks',
      });

    res.json(project.tasks);
    // res.json(tasks);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

// Update current task
exports.updateTaskById = async (req, res) => {
  const {
    taskname,
    assignee,
    description,
    actualstartdate,
    actualenddate,
    duration,
    effort,
    priority,
    predecessor,
    constrainttype,
    ragstatus,
    progress,
  } = req.body;

  const taskFields = {};
  if (taskname) taskFields.taskname = taskname;
  if (actualstartdate) taskFields.actualstartdate = actualstartdate;
  if (description) taskFields.description = description;
  if (actualenddate) taskFields.actualenddate = actualenddate;
  //   Included assignee
  if (assignee) taskFields.assignee = assignee;
  if (duration) taskFields.duration = duration;
  if (effort) taskFields.effort = effort;
  if (priority) taskFields.priority = priority;
  if (predecessor) taskFields.predecessor = predecessor;
  if (constrainttype) taskFields.constrainttype = constrainttype;
  if (ragstatus) taskFields.ragstatus = ragstatus;
  if (progress) taskFields.progress = progress;

  try {
    let task = {};

    // Logic to evaluate the assignee of the task vs the body
    if (assignee) {
      task = await Task.findOne({ _id: req.params.taskId });
      const currentAssignee = task.assignee;

      if (currentAssignee) {
        console.log('Current assignee exists');
        if (!currentAssignee.equals(assignee)) {
          console.log('Assignees differ');
          const { tasks } = await User.findOne({ _id: currentAssignee });

          const index = tasks.indexOf(req.params.taskId);
          if (index > -1) {
            tasks.splice(index, 1);
          }

          const orgUser = await User.findOneAndUpdate(
            { _id: currentAssignee },
            { $set: { tasks: tasks } },
            { new: true }
          );
          orgUser.save();

          const newUser = await User.findOne({ _id: assignee });
          newUser.tasks.unshift(req.params.taskId);
          newUser.save();

          const notificationFields = {
            receiver: assignee,
            notificationType: 'task assigned',
            notificationTask: req.params.taskId,
          };

          const notification = new ActionNotification(notificationFields);
          newUser.actionnotifications.push(notification);
          notification.save();

          taskFields.assignee = assignee;
        }
      }

      if (!currentAssignee) {
        console.log('NoAssignee on task');
        taskFields.assignee = assignee;
        const newUser = await User.findOne({ _id: assignee });
        newUser.tasks.unshift(req.params.taskId);
        newUser.save();

        const notificationFields = {
          receiver: newUser._id,
          notificationType: 'task assigned',
          notificationTask: req.params.taskId,
        };

        const notification = new ActionNotification(notificationFields);
        newUser.actionnotifications.push(notification);
        notification.save();
      }
    }

    task = await Task.findOneAndUpdate(
      { _id: req.params.taskId },
      { $set: taskFields },
      { new: true }
    );

    if (!task.assignee.equals(req.data.user)) {
      console.log('PM Updated');
      task = await Task.findOne({ _id: req.params.taskId });
      const assignee = task.assignee;
      const newUser = await User.findOne({ _id: assignee });
      const notificationFields = {
        receiver: assignee,
        notificationType: 'task updated',
        notificationTask: req.params.taskId,
      };

      const notification = new ActionNotification(notificationFields);
      newUser.actionnotifications.push(notification);
      notification.save();
    }
    task.save();

    res.json(task);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

// Delete a task
exports.deleteTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId });
    const { assignee, project } = task;

    // If task is assigned, then remove the task from that users task array
    if (assignee) {
      // Get the array of tasks of the current assignee
      const { tasks } = await User.findById(assignee);

      // Update the array to not have the task
      const index = tasks.indexOf(req.params.taskId);
      if (index > -1) {
        tasks.splice(index, 1);
      }

      // Replace the updated array into the current assignee
      // Task will therfore no longer appear in the current assignees profile
      const user = await User.findOneAndUpdate(
        { _id: assignee },
        { $set: { tasks: tasks } },
        { new: true }
      );
      user.save();
    }

    const projectObject = await Project.findOne({ _id: project });
    const ptasks = projectObject.tasks;

    const index = ptasks.indexOf(req.params.taskId);
    if (index > -1) {
      ptasks.splice(index, 1);
    }

    const newProject = await Project.findOneAndUpdate(
      { _id: project },
      { $set: { tasks: ptasks } },
      { new: true }
    ).populate(
      'tasks',
      'taskname actualstartdate actualenddate effort ragstatus progress'
    );
    newProject.save();

    task.remove();

    res.json(newProject.tasks);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId }).populate(
      'assignee',
      'firstname lastname _id'
    );

    res.json(task);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

// Get all tasks for logged in user
exports.getAllTasksForLoggedInUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.data.user })
      .select('tasks')
      .populate({
        path: 'tasks',
        select: 'taskname progress actualstartdate actualenddate',
        populate: { path: 'project', select: 'projectname' },
      });

    res.json(user.tasks);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

exports.getAllTaskComments = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId })
      .select('comments')
      .populate({
        path: 'comments',
        select: 'date message author',
        populate: { path: 'author', select: 'firstname lastname name' },
      });
    res.json(task.comments);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

exports.addSectionToTask = async (req, res) => {
  const { section } = req.body;
  try {
    const taskFields = {};
    if (section) taskFields.section = section;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.taskId },
      {
        section,
      },
      { new: true }
    );
    const newSection = await Section.findOne({ _id: section });
    newSection.tasks.push(req.params.taskId);
    newSection.save();

    task.save();

    res.json(task);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

// Investigate reducing amount od data sent to frontend relating to task
// Will be used when the user filter the task by section
exports.getAllTasksInASection = async (req, res) => {
  try {
    const section = await Section.findOne({
      _id: req.params.sectionId,
    }).populate('tasks');

    res.json(section.tasks);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};
