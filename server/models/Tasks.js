import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema({
  taskemail: {
    type: String,
    required: true,
  },
  taskphone: {
    type: String,
    required: true,
  },
  taskname: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  agree: {
    type: Boolean,
    required: true,
  },
  reminders: {
    type: [Date],
    required: true,
  },
  notificationType: {
    type: Boolean,
    default: false,
  },
 
});

const tasksModel = new mongoose.model("Tasks", tasksSchema, "tasks");

export default tasksModel;
