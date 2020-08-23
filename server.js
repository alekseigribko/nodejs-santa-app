/* eslint-disable no-console */

// init project
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const moment = require('moment');
const userService = require('./services/user');
const mailService = require('./services/mailer');

app.use(bodyParser());

// we've started you off with Express, ****Thanks! ***** :D
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
// Data parsing
app.use(bodyParser.urlencoded({ extended: true }));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

// POST methdod (fetch data from JSON check and compare it with the user data from the input form)
app.post('/wish', (request, response) => {
  const { username } = request.body; // variable to store username from request
  const { wish } = request.body; // variable to store user's with from request

  // updateData a function to fetch fresh data from JSON using axios module
  userService.updateData().then(() => {
    // validate username and if the user is registered get user profile data
    const userProfile = userService.getData(username);

    // if the user is not registered or a null is passed as a value for username show error screen
    if (!userProfile) {
      response.sendFile(`${__dirname}/views/not-registered.html`);
      return;
    }

    const dateToCheck = userProfile.birthdate; // get the user's birthdate from userService
    const today = moment(); // get today's date
    const age = today.diff(dateToCheck, 'years'); // calculate the user's age

    if (age > 10) {
      // if a user is over 10 y.o. his email cannot be sent to Santa
      response.sendFile(`${__dirname}/views/age-not-valid.html`);
      return;
    }

    if (!wish) { // validate the user's wish
      // if the user didn't type their wish show an error
      response.sendFile(`${__dirname}/views/not-sent.html`);
      return;
    }

    // prepare mailOptions and put the email into the pending array
    mailService.add(userProfile.username, userProfile.address, wish);
    // at this point the email will be successfully sent -> show the email sent screen
    response.sendFile(`${__dirname}/views/sent.html`);
  });
});

//
mailService.init(); //  send emails from the pending array every 15 seconds

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
