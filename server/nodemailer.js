const nodemailer = require('nodemailer');

let mailConfig;
if (process.env.NODE_ENV === 'production' ){
    // all emails are delivered to destination
    mailConfig = {
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
            user: 'real.user',
            pass: 'verysecret'
        }
    };
} else {
    // all emails are catched by ethereal.email
    mailConfig = {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'sonia.schinner85@ethereal.email',
            pass: 'xMfxcFCCC43m9JSzH8'
        }
    };
}
let transporter = nodemailer.createTransport(mailConfig);

const messageCreator = (email, subject, text) => {
  return {
    to: email,
    subject: `${subject} + ${Date.now()}`,
    text: text
  }
}

const callTransporter = (message) => {
  transporter.sendMail(message, (err, info)=>{
    if(err){
      console.log('nodemailer error');
      return process.exit(1);
    }
    console.log('success!');
    console.log(nodemailer.getTestMessageUrl(info));
    transporter.close();
  })
}

module.exports = { callTransporter, messageCreator };