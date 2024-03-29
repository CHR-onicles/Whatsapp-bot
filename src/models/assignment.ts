// --------------------------------------------------
// assignment.js contains the schema and behaviour of
// assignments
// --------------------------------------------------

import { Schema, model } from "mongoose";

//! WORK IN PROGRESS
// Schema
const AssignmentSchema = new Schema({
  _id: Number,
  course: { type: String, required: true },
  desc: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now },
  dueDate: Date,
  expired: { type: Boolean, default: false },
});

const AssignmentModel = model("Assignment", AssignmentSchema);

// const ass1 = new Assignment({ course: "CSCD 415", desc: "Compilers Assignment", dueDate: new Date(), expired: false });
// (async () => { await ass1.save() })();
// console.log([ASSIGNMENT MODEL] ass1.course);

export { AssignmentModel };
