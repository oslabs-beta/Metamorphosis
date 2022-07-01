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

const messageCreator = (input) => {
  const defaultO = {
    to: 'test@test.com',
    subject: `${input} + ${Date.now()}`,
    text: 'please check your Kafka\'s health'
  };
  const ans = Object.assign({}, defaultO, input)
  return ans;
}

const callTransporter = (message) => {
  
  transporter.sendMail(messageCreator(message), (err, info)=>{
    if(err){
      console.log('nodemailer error');
      return process.exit(1);
    }
    console.log('success!');
    console.log(nodemailer.getTestMessageUrl(info));
    transporter.close();
  })
}

const throttle = (func, delay) => {
  let lastAlert = null;
  const throttled = (...args) => {
    let now = new Date().getTime();
    if(!lastAlert){
      lastAlert = now;
      return func(...args);
    } else {
      if(now - lastAlert < delay){
        return;
      } else {
        lastAlert = now;
        return func(...args);
      }
    }
  }
  return throttled;
}

const throttled_callTransport = throttle(callTransporter,1000*60*5);

module.exports = { throttled_callTransport, messageCreator };