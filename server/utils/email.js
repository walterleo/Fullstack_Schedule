import nodemailer from "nodemailer";

import config from "config";

const emailKeys = config.get("emailKeys");

async function sendEmail(emailData) {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "wallacetech.com.au",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: emailKeys.username, // generated ethereal user
        pass: emailKeys.password, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Walter 👻" <rh@wallacetech.com.au>', // sender address
      to: emailData.to, // list of receivers
      subject: emailData.subject, // Subject line

      html: emailData.html,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error(error);
  }
}

export default sendEmail;
