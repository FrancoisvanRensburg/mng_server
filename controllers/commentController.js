const Project = require('../models/Project');
const Task = require('../models/Task');
const CommentProject = require('../models/CommentProject');
const CommentTask = require('../models/CommentTask');

// Create a comment on a project
exports.createCommentProject = async (req, res) => {
  const { message } = req.body;
  const commentFields = {};
  if (message) commentFields.message = message;
  commentFields.author = req.data.user;
  try {
    //   Create new comment object
    const comment = new CommentProject(commentFields);

    // Create dual link to project
    const project = await Project.findOne({
      _id: req.params.projectId,
    });
    project.comments.unshift(comment._id);

    // Save comment to project
    await comment.save();
    await project.save();

    const prjcmts = await Project.findOne({ _id: req.params.projectId })
      .select('comments')
      .populate({
        path: 'comments',
        select: 'message date author',
        populate: { path: 'author', select: 'firstname lastname name' },
      });
    res.json(prjcmts.comments);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

// Create a comment on a task
exports.createCommentTask = async (req, res) => {
  const { message } = req.body;
  const commentFields = {};
  if (message) commentFields.message = message;
  commentFields.author = req.data.user;
  try {
    // Create a new comment object
    const comment = new CommentTask(commentFields);
    console.log(comment);
    // Create dual link to task
    const task = await Task.findOne({
      _id: req.params.taskId,
    });
    // console.log(task);
    task.comments.unshift(comment._id);

    // save comment to task
    await comment.save();
    await task.save();

    const tskcmts = await Task.findOne({ _id: req.params.taskId })
      .select('comments')
      .populate({
        path: 'comments',
        select: 'message date author',
        populate: { path: 'author', select: 'firstname lastname name' },
      });
    res.json(tskcmts.comments);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};
