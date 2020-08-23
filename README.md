# nodejs coding challenge

The project was completed according to the guide-lines given in this readme file.
This web-app sends emails from children to Santa. Sent emails are viewable in the inbox on ethernal.mail.

Before sending the actial email user-data and user-profile information is retrieved from the JSON objects 
and validated.

The validation is done on three levels:
- username and the text of user's wish are validated in HTML files using native HTML validation;
- username and the text of user's wish are validated on the client's side in the `public/client.js` file;
- username and the text of user's wish are validated on the server-side (username is in `user.js`, wish in `server.js`).

User's age is validated using Momentjs. The d.o.b. is parsed in YYYY/DD/MM format and substracted using .diff function.

Basic error messages are given for the cases:
- if the user is not registered (the name is not is the provided JSON files/null);
- a registered user is older than 10 y.o. ( 10 y.o. users are allowed to send emails to Santa);
- a registred user hasn't typed their wish in the corresponding field in the form.

## Some work done:

On the front-end,
-  `public/client.js` added form validation and counter for the characters in the textarea(wish);
-  `public/style.css`  edited the style sheet to more universal(in terms of this app) style, changed the color scheme ;
-  added extra files into `./views/`. Now there are available views for basic errors and successfully sent emails.

On the back-end:
- the app is in `server.js`
- needed packages were installed into `package.json` (nodemailer, moment, axios);
- updating and getting user infromation is done in `user.js` module;
- functions for sending emails are in `mailer.js` module;
- access the `.env` data through `example.env`.

## What could be done(extra):

- for editing and presenting the text of a user's wish a templating engine could be used (i.e. Mustache.js);

