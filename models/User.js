const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// We'll have to add in a lot of additional fields to this in order to facilitate any exstensive
// profile customization... For the purposes of the POC the bwlow should be fine
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true, bcrypt: true },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    usertype: { type: String, required: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    active: { type: Boolean, default: false },
  },
  { toJSON: { virtuals: true } }
);

userSchema
  .virtual('name')
  .get(function () {
    return `${this.firstname} ${this.lastname}`;
  })
  .set(function (v) {
    // v is the value being set, so use the value to set
    // firstName and lastName.
    const firstname = v;
    const lastname = v;
    this.set({ firstname, lastname });
  });

module.exports = mongoose.model('User', userSchema);
