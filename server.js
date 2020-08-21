// server.js
// where your node app starts

// init project
const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const { get } = require('request');
const dotenv = require('dotenv').config();
const moment = require('moment');

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



let uId = new Map(); // a map to store username => userID values 
let dDay = new Map(); // a map to store userID =>  birthdate values 
let uAddress = new Map(); // a map to store userID => address values

// POST methdod (fetch data from JSON check and compare it with the user data from the input form)
app.post('/wish',(request, response) => {
  
  // TODO: revalidate username and wish;
  var username = request.body.username;
  var wish = request.body.wish;

    // updateData a function to fetch fresh data from JSON using axios module
    updateData().then(function(){
      
      // TODO: Move mapping in update data
      //put the data from udata array into user Map
      for(var uInfo in uData){
        
        uId.set(uData[uInfo]["username"],uData[uInfo]["uid"]);

      }

      // put the data from bday array into dDay and uAddress Maps
      for(var data in uProfile){
        

        // TODO: use only one map with userID -> profile
        dDay.set(uProfile[data]["userUid"],uProfile[data]["birthdate"]);
        uAddress.set(uProfile[data]["userUid"],uProfile[data]["address"]);

      }

      console.log(user) // TODO: to remove
      console.log(dDay) // TODO: to remove
      console.log(uAddress) // TODO: to remove
      
      /*
        TODO: Replace this age validation with moment js
      ****************************************************

      // prepare variable dateToCheck to check if the user is over 10 y.o. or the d.o.b. provided in YYYY/MM/DD format
      var dateToCheck = new Date(dDay.get(user.get(username)));
      
      Date.parse()
      // TODO: change date convertion to moment
      moment('24/12/2019', "DD MM YYYY hh:mm:ss");
      console.log(isNaN(dateToCheck)) // TODO: to remove
      
      // check if the username from the input form is in the user Map
      if(user.has(username)){

        // call the dateIsValid function to check if the user's d.o.b. is in the valid (YYYY/MM/DD) format
        // and to check if the user is over 10 y.o. or not
        // TODO: do not use request and response in an utility function
        dateIsValid(dateToCheck,request,response);
       
      }else{
        //if no user with such name registered show not-registered.html screen
        response.sendFile(__dirname + '/views/not-registered.html');
      }
      
      console.log(username) // TODO: to remove
      console.log(wish)  // TODO: to remove
      console.log(udata); // TODO: to remove
      console.log(bday);  // TODO: to remove

      */
    });    
});

// TODO: use moment.diff to check the age
 /* ***************************************************************************************************
TODO: remove this function replacing it with moment js
********************************************************************************************************
/ a function to check provided user's d.o.b. 
/ as such as to check the correct date format YYYY/MM/DD 
/ and chek if a user's age is >10 y.o. or not
/
/@param dateChecking -- the date to check


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
      // TODO: push email in data in array
      sendEmails(request, response, user, uAddress);
      
      
    }
  }

};
************************************************************************************************************************* */
setInterval(sendEmails, 15*1000); // 15 second interval on sending emails.

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

