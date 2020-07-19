const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    // Referenced the new user schema, not the old ResUser schema
    assignee: { type: Schema.Types.ObjectId, ref: 'User' },
    tasknumber: { type: String, max: 7, trim: true },
    taskname: { type: String, required: true, max: 32, trim: true },
    description: { type: String },
    // We can look at this post POC
    // plannedStartDate: {type: Date,require: 'Task start date is required'},
    // plannedEndDate: {type: Date},
    actualstartdate: { type: Date },
    actualenddate: { type: Date },
    duration: { type: Number },
    effort: { type: Number },
    priority: { type: Number },
    predecessor: { type: String },
    constrainttype: { type: String },
    ragstatus: { type: String },
    progress: { type: Number, max: 100, min: 0, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'CommentTask' }],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    label: { type: Schema.Types.ObjectId, ref: 'Section' },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
);

module.exports = mongoose.model('Task', taskSchema);
