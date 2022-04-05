const { Schema, model } = require('mongoose');


// Schema
const AssignmentSchema = new Schema({
    _id: Number,
    course: { type: String, required: true },
    desc: { type: String, required: true },
    dateAdded: { type: Date, default: Date.now },
    dueDate: Date,
    done: { type: Boolean, default: false }
});

const AssignmentModel = model("AssignmentModel", AssignmentSchema);

// const ass1 = new Assignment({ course: "CSCD 415", desc: "Compilers Assignment", dueDate: new Date(), done: false });
// (async () => { await ass1.save() })();
// console.log(ass1.course);

module.exports = AssignmentModel 