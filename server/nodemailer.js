const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const messageCreator = (input) => {
  const defaultO = {
    to: 'sonia.schinner85@ethereal.email',
    from: 'metamorphosisny33@gmail.com',
    subject: `${input} + ${Date.now()}`,
    text: 'please check your Kafka\'s health'
  };
  const ans = Object.assign({}, defaultO, input)
  return ans;
}

function throttle(func, delay){
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
// console.log('check processenv',process.env.NODE_ENV);
let throttled_callTransport;
if(process.env.LOCALMODE){
  const callSendGrid = (message) => {
    sgMail
    .send(messageCreator(message))
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error('errrrrr',error)
    })
  }
  
  throttled_callTransport = throttle(callSendGrid,1000*60*5);

} else {
  let  mailConfig = {
          host: 'smtp.ethereal.email',
          port: 587,
          auth: {
              user: 'sonia.schinner85@ethereal.email',
              pass: 'xMfxcFCCC43m9JSzH8'
          }
      };
  
  let transporter = nodemailer.createTransport(mailConfig);
  
  
  const callTransporter = (message) => {
    
    transporter.sendMail(messageCreator(message), (err, info)=>{
      if(err){
        console.log('nodemailer error');
        return process.exit(1);
      }
      console.log('re-route alert to backend - success!');
      console.log(nodemailer.getTestMessageUrl(info));
      transporter.close();
    })
  }
  throttled_callTransport = throttle(callTransporter,1000*60*5);

}

/////////////////////////////////////////////////////////for dev environment

////////////////////////////////////////////////////////////////

module.exports = { throttled_callTransport, messageCreator };