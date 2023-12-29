const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: "ericksera4@gmail.com",
      pass: process.env.MAIL_PW,
  },
});

  // send mail with defined transport object
    exports.sendMail = async (options) => {
        try {
        const result = await transporter.sendMail(options);
        console.log("Message sent: %s", result.messageId);
        return result;
        } catch (error) {
            console.log("Error sending email");
        return error;
        }
    };
