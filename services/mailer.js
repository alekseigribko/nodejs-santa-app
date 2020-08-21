// TODO: get the email array and send email of each email data
// A function to process and send emails to Santa from Children

const nodemailer = require('nodemailer');

function sendEmails (request, response,user, uAddress ){  

    // a transporter to send emails via nodemailer
    const transporter = nodemailer.createTransport ({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: process.env.EMAIL,   // retrieve the email from .env file
          pass: process.env.PASSWORD // retrieve the password from .env file
        }
    });

    // set email options to send emails to Santa
    const mailOptions = {
        from: 'do_not_reply@northpole.com',
        to: 'santa@northpole.com', 
        subject: 'Merry Christmas!',
        text: `This email was sent from your fan: ${username},
         
              Who lives by the address: ${uAddress.get(uId.get(username))},

              Here's what they want for Chritsmas: 
                
              ${wish}
              
              Merry Christmas, everyone!`
    };

    // now this sends the email with the options above
    transporter.sendMail(mailOptions, (err, data)=>{
      if(err){
        
        console.log('Error occured! Oops..', err); // TODO: to remove
        
        //email cannot be sent error-screen
        response.sendFile(__dirname + '/views/not-sent.html');

      }else{

        console.log('Your email was successfully sent!') // TODO: to remove

        //email successfully sent screen
        response.sendFile(__dirname + '/views/sent.html');

      }
      /* TODO: double-check how to work it with Promice

      transporter.sendMail(mailOptions)
      .then(function (response){
         
        console.log('Your email was successfully sent!') // TODO: to remove

        // TODO: to uptade with the reference to an actual html page
        response.send("Yay! Your email is on the way to Santa now!");

      })
      .catch(function(error) {
       
        console.log('Error occured! Oops..', error); // TODO: to remove
        
        // TODO: to uptade with the reference to an actual html page
        response.send("There was a problem sending your email. Sorry for that!");

      });
      */

    });

};