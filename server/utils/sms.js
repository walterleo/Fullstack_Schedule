import config from "config";
import twilio from "twilio";

const smsKeys = config.get("smsKeys");
const client = new twilio(smsKeys.accountSid, smsKeys.authToken);

async function sendSMS(smsData) {
  try {
    const message = await client.messages.create({
      body: smsData.body,
      from: smsKeys.myPhoneNumber,
      to: smsData.to,
    });
    console.log(message.sid);
  } catch (error) {
    console.error(error);
  }
}

export default sendSMS;