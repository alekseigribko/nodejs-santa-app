// server.js
// where your node app starts

// init project
const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const { get } = require('request');
const axios = require('axios');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();

app.use(bodyParser());
app.use(morgan());

// we've started you off with Express, ****Thanks! ***** :D
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
// Data parsing
app.use(bodyParser.urlencoded({ extended: true })); 


// http://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

var udata = []; // an array to store user data (username and userID) from json
var bday = []; // an array to store profile data (userId, birthdate and address) from json

let user = new Map(); // a map to store username => userID values 
let dDay = new Map(); // a map to store userID =>  birthdate values 
let uAddress = new Map(); // a map to store userID => address values

// POST methdod (fetch data from JSON check and compare it with the user data from the input form)
app.post('/wish',(request, response) => {
    
    // updateData a function to fetch fresh data from JSON using axios module
    updateData().then(function(){
      
      //put the data from udata array into user Map
      for(var username in udata){
        
        user.set(udata[username]["username"],udata[username]["uid"]);

      }

      // put the data from bday array into dDay and uAddress Maps
      for(var day in bday){
        
        dDay.set(bday[day]["userUid"],bday[day]["birthdate"]);
        uAddress.set(bday[day]["userUid"],bday[day]["address"]);

      }

      console.log(user) // TODO: to remove
      console.log(dDay) // TODO: to remove
      console.log(uAddress) // TODO: to remove
      
      // prepare variable dateToCheck to check if the user is over 10 y.o. or the d.o.b. provided in YYYY/MM/DD format
      var dateToCheck = new Date(dDay.get(user.get(request.body.userid)));
      
      console.log(isNaN(dateToCheck)) // TODO: to remove
      
      // check if the username from the input form is in the user Map
      if(user.has(request.body.userid)){

        // call the dateIsValid function to check if the user's d.o.b. is in the valid (YYYY/MM/DD) format
        // and to check if the user is over 10 y.o. or not
        dateIsValid(dateToCheck,request,response);
       
      }else{
        //if no user with such name registered show not-registered.html screen
        response.sendFile(__dirname + '/views/not-registered.html');
      }
      
      console.log(request.body.userid) // TODO: to remove
      console.log(request.body.wish)  // TODO: to remove
      console.log(udata); // TODO: to remove
      console.log(bday);  // TODO: to remove
    });    
});

/*
/ a function to check provided user's d.o.b. 
/ as such as to check the correct date format YYYY/MM/DD 
/ and chek if a user's age is >10 y.o. or not
/
/@param dateChecking -- the date to check
*/

function dateIsValid(dateChecking,request,response){

  // first check if the provided argument is in the correct format
  // i.e. not a NaN
  if(isNaN(dateChecking) == true){

    console.log('Invalid date format'); // TODO: to remove
    
    //if d.o.b. is not in yyyy/mm/dd format show the invalid-dob.html screen
    response.sendFile(__dirname + '/views/invalid-dob.html');

  }else { // if the agument is not a NaN then check the age of a user
    
    //today's date
    var today = new Date();
    
    //calculate the age of a user by substracting the year of birth from the current year 
    var age = today.getFullYear() - dateChecking.getFullYear();
    
    //check the months
    var m = today.getMonth() - dateChecking.getMonth();

    // the value of  m is negative that means a user's birthday is yet to come this year
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        
      // hence substract one year from the previously calculated user's age
        age--;
    }

    console.log(`Your age's ${age}`);  // TODO: to remove

    // check if a user is over 10 y.o. or not
    if(age>10){

      // if a user is over 10 y.o. his email cannot be sent to Santa
     response.sendFile(__dirname + '/views/age-not-valid.html');

    }else{

      // if a user is not 10 y.o. yet his email goes straight to Santa's inbox
      sendEmails(request, response, user, uAddress);
      setInterval(sendEmails, 10*1500); // 15 second interval on sending emails.
    }
  }

};

/* An API to fetch the data from the JSON objects provided 
/ using axios module
/the function updateData passed the JSON data to two priviously defined arrays 
/ the arrays are udata and bday
*/
function updateData () {
  
  // url1 is the link to a provided JSON object
  var url1 = 'https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json';

  // url2 is the link to a provided JSON objedt
  var url2 = 'https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json';

  // the function returns a Promise as due to the asyncronous nature of Node.JS
  // the JSON data cannot be stored in the arrays from the first run
  return new Promise((resolve, reject)=>{
   
    axios({ 
      method: 'get',
      url: url1,
      responseType: 'json'
    })
      .then(function (response) {
        udata = response.data //store the data in the array
        
        return axios({ 
          method: 'get',
          url: url2,
          responseType: 'json'
        })
          
      }).then(function (response) {
        bday= response.data // store the date in the array
        resolve(); // resolve promise
      });   
  });
};

// A function to process and send emails to Santa from Children
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
        text: `This email was sent from your fan: ${request.body.userid},
         
              Who lives by the address: ${uAddress.get(user.get(request.body.userid))},

              Here's what they want for Chritsmas: 
                
              ${request.body.wish}
              
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
// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
