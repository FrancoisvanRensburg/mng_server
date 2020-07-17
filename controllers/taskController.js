const Company = require('../models/Company');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const router = require('../routes/tasks');

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
      .populate('tasks', 'taskname');
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

      user.save();
    }

    project.tasks.push(task);

    await task.save();
    await project.save();

    res.json(project.tasks);
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
        if (currentAssignee !== assignee) {
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

          taskFields.assignee = assignee;
        }
      }

      if (!currentAssignee) {
        taskFields.assignee = assignee;
        const newUser = await User.findOne({ _id: assignee });
        newUser.tasks.unshift(req.params.taskId);
        newUser.save();
      }
    }

    task = await Task.findOneAndUpdate(
      { _id: req.params.taskId },
      { $set: taskFields },
      { new: true }
    );
    task.save();

    res.json(task);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};
