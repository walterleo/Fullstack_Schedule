import express from "express";
const router = express.Router();
import { scheduleJob, cancelJob, scheduledJobs } from "node-schedule";
import sendEmail from "../utils/email.js";
import sendSMS from "../utils/sms.js";
import {
  newTaskValidationRules,
  errorMiddleware,
} from "../middlewares/validations/index.js";
import authMiddleware from "../middlewares/auth/verifyToken.js";

import Tasks from "../models/Tasks.js";

/*
API : /api/tasks/add
Method : POST
Desc : This API is to accept new task jobs and store the reminders
*/

router.post(
  "/add",
  authMiddleware,
  newTaskValidationRules(),
  errorMiddleware,
  async (req, res) => {
    try {
      let payload = req.payload;

      const userTaskdata = await Tasks.findOne({ user: payload.user });
      let taskData = req.body;

      let currentTime = new Date();
      let deadline = new Date(taskData.deadline);
      let milliseconds = deadline - currentTime;
      let seconds = Math.floor(milliseconds / 1000);
      let minutes = Math.floor(seconds / 60);
      let hour = Math.floor(minutes / 60);
      let day = Math.floor(hour / 24);
      // test case 1 - backdated check
      if (milliseconds < 0) {
        return res.status(500).json({ error: "Deadline cannot be backdated" });
      }
      //test case 2 - checking if its within next 30 mins

      if (minutes < 2) {
        return res
          .status(500)
          .json({ error: "Deadline cannot be within next 30 mins" });
      }
      // test case 3 - It cannot be after 30 days from now
      if (day > 30) {
        return res
          .status(500)
          .json({ error: "Deadline cannot be after 30 days from now" });
      }
      let reminders = [];

      let firstReminder = milliseconds / 4;
      let secondReminder = milliseconds / 2;
      let thirdReminder = milliseconds * (3 / 4);

      firstReminder = new Date(+new Date() + firstReminder);
      secondReminder = new Date(+new Date() + secondReminder);
      thirdReminder = new Date(+new Date() + thirdReminder);

      reminders.push(firstReminder, secondReminder, thirdReminder);

      taskData.reminders = reminders;

      userTaskdata.tasks.push(taskData);
      let taskid =
        userTaskdata.tasks[userTaskdata.tasks.length - 1]._id.toString();
      await userTaskdata.save();
      res.status(200).json({ success: "Job are scheduled by the server." });
      //Send reminders to phone

      reminders.forEach((ele, index) => {
        scheduleJob(`job-${index}-${taskid}`, ele, function () {
          if (taskData.notificationType == "email") {
            sendEmail({
              subject: `Reminder ${index + 1} about your task: ${
                req.body.taskname
              }  `,
              to: payload.email,
              html: `Hi!! do not forget your task`,
            });
          } else if (taskData.notificationType == "sms") {
            sendSMS({
              body: `Reminder ${index + 1} about your task: ${
                req.body.taskname
              }  `,
              to: payload.phone,
            });
          } else {
            sendEmail({
              subject: `Reminder ${index + 1} about your task: ${
                req.body.taskname
              }  `,
              to: payload.email,
              html: `Hi!! do not forget your task`,
            });

            sendSMS({
              body: `Reminder ${index + 1} about your task: ${
                req.body.taskname
              }  `,
              to: payload.phone,
            });
          }
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server error" });
    }
  }
);

/* 
servers and dbs always show UTC zero format (time)

Step 1: Setup express server
Step 2: Setup /tasks post route
Step 3 : Create DB Models
Step 4 : Implement Data Validations

Input Deadline date validation rules :
  1) It cannot be backdated
  2) It cannot be within next 30 mins
  3) It cannot be after 30 days from now


*/

/*
API : /api/tasks/
Method : GET
Desc : This API is to to fetch all the tasks of a user
*/

router.get("/", authMiddleware, async (req, res) => {
  try {
    let payload = req.payload;

    const userTasks = await Tasks.findOne({ user: payload.user }).populate(
      "user"
    );
    let taskData = {
      email: userTasks.user.email,
      firstname: userTasks.user.firstname,
      tasks: userTasks.tasks,
    };
    res.status(200).json({ taskData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server error" });
  }
});

/*
API : /api/tasks/
Method : DELETE
Desc : we are gonna delete the records
*/

router.delete("/:taskid", authMiddleware, async (req, res) => {
  try {
    let payload = req.payload;

    const userTasks = await Tasks.findOne({ user: payload.user });
    console.log(userTasks.tasks);
    let matchIndex = userTasks.tasks.findIndex(
      (ele) => ele._id == req.params.taskid
    );
    if (matchIndex == -1) {
      return res.status(400).json({ error: "Invalid task id" });
    }
    //cancel jobs

    userTasks.tasks[matchIndex].reminders.forEach((ele, index) => {
      cancelJob(`job-${index}-${req.params.taskid}`);
    });

    userTasks.tasks = userTasks.tasks.filter(
      (ele) => ele._id != req.params.taskid
    );
    await userTasks.save()
    res.status(200).json({ success: "Task is deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server error" });
  }
});
export default router;
