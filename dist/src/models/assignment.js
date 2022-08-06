"use strict";
// --------------------------------------------------
// assignment.js contains the schema and behaviour of
// assignments
// --------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentModel = void 0;
const mongoose_1 = require("mongoose");
//! WORK IN PROGRESS
// Schema
const AssignmentSchema = new mongoose_1.Schema({
    _id: Number,
    course: { type: String, required: true },
    desc: { type: String, required: true },
    dateAdded: { type: Date, default: Date.now },
    dueDate: Date,
    expired: { type: Boolean, default: false },
});
const AssignmentModel = (0, mongoose_1.model)("Assignment", AssignmentSchema);
exports.AssignmentModel = AssignmentModel;
