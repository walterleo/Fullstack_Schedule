import express from "express";
import { scheduleJob } from "node-schedule";
import sendEmail from "./utils/email.js";
import sendSMS from "./utils/sms.js";
import config from "config";
import path from "path";
const app = express();

const port = process.env.PORT || 5000;
import "./dbConnect.js";

import Tasks from "./models/Tasks.js";
import Users from "./models/Users.js";

import {
  newTaskValidationRules,
  userRegistrationRules,
  errorMiddleware,
} from "./middlewares/validations/index.js";

app.use(express.json());
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "build")));
+app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

/*
API : /api/user/task
Method : POST
Desc : This API is to accept new task jobs and store the reminders
*/

app.post(
  "/api/user/task",
  newTaskValidationRules(),
  errorMiddleware,
  async (req, res) => {
    try {
      const taskData = new Tasks(req.body);

      let currentTime = new Date();
      let deadline = taskData.deadline;
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
      await taskData.save();

      //Send reminders to phone

      reminders.forEach((ele, index) => {
        scheduleJob(`job-${index}`, ele, function () {
          sendSMS({
            body: `Reminder ${index + 1} about your task: ${
              req.body.taskname
            }  `,
            to: req.body.taskphone,
          });
        });
      });

      //Send reminders to email
      reminders.forEach((ele, index) => {
        scheduleJob(`job-${index}`, ele, function () {
          sendEmail({
            subject: `Reminder ${index + 1} about your task: ${
              req.body.taskname
            }  `,
            to: req.body.taskemail,
            html: `Hi!! do not forget your task`,
          });
        });
      });

      res.status(200).json({ success: "Data received by the server" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "DB validation failed" });
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
API : /api/user/task
Method : POST
Desc : This API is to accept new task jobs and store the reminders
*/
app.post(
  "/api/users/register",
  userRegistrationRules(),
  errorMiddleware,

  async (req, res) => {
    try {
      const userData = new Users(req.body);

      userData.token.email = Math.random().toString(16).substring(2);
      userData.token.phone = Math.random().toString(16).substring(2);

      await userData.save();

      //Validation email and sms
      sendEmail({
        to: req.body.email,
        subject: "Welcome Email - Walter Leo Solutions",
        html: `Hi ${
          req.body.firstname
        } <br /> Thank you for registering with us.
        Please <a href="${config.get("url")}/user/verify/${
          userData.token.email
        }">click this link </a>
        to activate and verify your email address`,
      });
      // sendSMS({
      //   body: `Hi ${
      //     req.body.firstname
      //   }  Thank you for registering with us. Please click the link ${config.get(
      //     "url"
      //   )}/api/phone/verify/${userData.token.phone}
      //   to activate and verify your phone number`,
      //   to: req.body.phone,
      // });

      //send confirmation link to email and phone
      res.status(200).json({ success: "Data received by the server" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "DB validation failed" });
    }
  }
);

/*
API : /api/email/verify/:token
Method : GET
Desc : This API is to verify the email address
*/
app.get("/api/email/verify/:token", async (req, res) => {
  try {
    const userdata = await Users.findOne({
      "token.email": req.params.token,
    });
    if (!userdata)
      return res.redirect("/user/verifyerror");

    if (userdata.userVerified.email) {
      return res.redirect("/user/verifysuccess");
    }
    userdata.userVerified.email = true;
    await userdata.save();
    res.redirect("/user/verifysuccess");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

/*
API : /api/phone/verify/:token
Method : GET
Desc : This API is to verify the email address
*/
app.get("/api/phone/verify/:token", async (req, res) => {
  try {
    const userSmsdata = await Users.findOne({
      "token.phone": req.params.token,
    });
    if (!userSmsdata)
      return res.send("User Token is Invalid. Phone is not verified.");

    if (userSmsdata.userVerified.phone) {
      return res.send("User phone is already verified");
    }
    userSmsdata.userVerified.phone = true;
    await userSmsdata.save();
    res.send("User phone is successfully Verified");
  } catch (error) {
    console.log(error);
    res.status(500).send("DB Validation Failed");
  }
});

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
