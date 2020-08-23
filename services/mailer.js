/* eslint-disable no-unused-vars */
// A function to process and send emails to Santa from Children

const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();

// add emails-to-send into the pending array
const pending = [];
// declare the timeout variable which will prevent setting 15 seconds interval more than once
let timeout;

// a transporter to send emails via nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: process.env.EMAIL, // retrieve server email from .env
    pass: process.env.PASSWORD, // retrieve the password from .env
  },
});

// adds to pending
function add(username, address, wish) {
  // set email options to send emails to Santa
  pending.push({
    from: 'do_not_reply@northpole.com',
    to: 'santa@northpole.com',
    subject: 'Merry Christmas!',
    text: `This email was sent from your fan: ${username},
    
          Who lives by the address: ${address},

          Here's what they want for Chritsmas: 
            
          ${wish}
          
          Merry Christmas, everyone!`,

  });
}

function sendEmail(mailOptions) {
  // now this sends the email with the options above
  // eslint-disable-next-line no-unused-vars
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log('Error occured! Oops..', err);
    }
  });
}

// sends all pending (called every 15s)
function sendPending() {
  while (pending.length > 0) {
    sendEmail(pending.pop());
  }
}

// a function to send emails with the 15 seconds interval
function init() {
  if (!timeout) {
    timeout = setInterval(sendPending, 15 * 1000); // 15 second interval on sending emails.
  }
}

module.exports = {

  init,
  add,
};
