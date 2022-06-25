import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";


import Users from "../models/Users.js";
import sendEmail from "../utils/email.js";
import sendSMS from "../utils/sms.js";

const router = express.Router();

import {
    userRegistrationRules,
    userLoginRules,
    errorMiddleware
} from "../middlewares/validations/index.js";

/*
API : /api/user/register
Method : POST
Desc : This API is to register new user
*/
router.post(
    "/register",
    userRegistrationRules(),
    errorMiddleware,
  
    async (req, res) => {
      try {
        const users = await Users.findOne({ email: req.body.email });
        if (users)
          return res.status(500).json({ error: "User Registered Already" });
  
        const userData = new Users(req.body);
        userData.password = await bcrypt.hash(req.body.password, 12);
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
          Please <a href="${config.get("url")}/api/user/verify/email/${
            userData.token.email
          }">click this link </a>
          to activate and verify your email address`,
        });
        sendSMS({
          body: `Hi ${
            req.body.firstname
          }  Thank you for registering with us. Please click the link ${config.get(
            "url"
          )}/api/user/verify/phone/${userData.token.phone}
          to activate and verify your phone number`,
          to: req.body.phone,
        });
  
        //send confirmation link to email and phone
        res.status(200).json({ success: "User registered successfully" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Error." });
      }
    }
  );
  

/*
API : /api/user/verify/email/:token
Method : GET
Desc : This API is to verify the email address
*/
router.get("/verify/email/:token", async (req, res) => {
    try {
      const userdata = await Users.findOne({
        "token.email": req.params.token,
      });
      if (!userdata)
        return res.send("<h1>User Token is Invalid. Email is not verified.</h1>");
  
      if (userdata.userVerified.email) {
        return res.send("<h1>User Email is Already Verified</h1>");
      }
      userdata.userVerified.email = true;
      await userdata.save();
      res.send("<h1>User Email is Verified Succesfully</h1>");
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  });
  
  /*
  API : /api/user/verify/phone/:token
  Method : GET
  Desc : This API is to verify the phone number
  */
  router.get("/verify/phone/:token", async (req, res) => {
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
      res.status(500).send("Internal Server Error");
    }
  });
  
  /*
    API : /api/user/login
    Method : POST
    Desc : User Login Api
  
  */
  router.post(
    "/login",
    userLoginRules(),
    errorMiddleware,
  
    async (req, res) => {
      try {
        const user = await Users.findOne({ email: req.body.email });
        if (!user) {
          return res.status(401).json({ error: "Email is not in the DataBase." });
        }
        //Test for password
        const isValid = await bcrypt.compare(req.body.password, user.password);
        if (!isValid) {
          return res.status(401).json({ error: "Invalid Credentials" });
        }
        //payload
        let payload = {
          user: user._id,
          email: user.email,
          phone : user.phone
        };
        //send auth token to the client
        const token = jwt.sign(payload, "hackingwalter", { expiresIn: 60 * 60 });
  
        res.status(200).json({ token });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Error." });
      }
    }
  );
  


export default router;