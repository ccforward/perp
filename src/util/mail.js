const mail = require('../config').mail
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: mail
});

// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     return console.log(new Date() + ' ' + error);
//   }
// })

module.exports = transporter
