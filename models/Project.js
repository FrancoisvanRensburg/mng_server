const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    projectname: { type: String, required: true, max: 32, trim: true },
    projectcode: { type: String, required: true, max: 10, trim: true },
    // We can look into the below again post POC
    // plannedStartDate: {type: Date, require: 'Project start date is required'},
    // plannedEndDate: {type: Date},
    actualstartdate: { type: Date },
    actualenddate: { type: Date },
    duration: { type: Number },
    ownercompany: { type: Schema.Types.ObjectId, ref: 'Company' },
    projectmanager: { type: Schema.Types.ObjectId, ref: 'User' },
    projectprogress: { type: Number, max: 100, default: 0 },
    // We can look at setting up proper types/sectors etc post POC. For now we can just
    // hardcode input values in the form
    tpe: { type: String, max: 32, tirm: true },
    sector: { type: String, max: 32, trim: true },
    // We can relook at this kak when we have frontend development for the linked programs
    // linkedProgram: {type: String},
    description: { type: String },
    resourcebudget: { type: Number },
    projectbudget: { type: Number },
    // Makes no sense to be here, will leave it in for shits and giggles for now
    document: { type: String },
    // Contributor will be set in the task detail by the assignee or the project manager
    contributors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    contactname: { type: String },
    contactnumber: { type: String },
    contactemail: { type: String },
    inhouse: { type: Boolean },
    comments: [{ type: Schema.Types.ObjectId, ref: 'CommentProject' }],
    created: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: 'created', updatedAt: false } }
);

module.exports = mongoose.model('Project', projectSchema);
