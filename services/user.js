
/* An API to fetch the data from the JSON objects provided 
/ using axios module
/the function updateData passed the JSON data to two priviously defined arrays 
/ the arrays are udata and bday
*/

const axios = require('axios');

function updateData () {

    var uData = []; // an array to store user data (username and userID) from json
    var uProfile = []; // an array to store profile data (userId, birthdate and address) from json
  
    
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
          uData = response.data //store the data in the array
          
          return axios({ 
            method: 'get',
            url: url2,
            responseType: 'json'
          })
            
        }).then(function (response) {
          uProfile= response.data // store the date in the array
          resolve(); // resolve promise
        });   
    });
  };