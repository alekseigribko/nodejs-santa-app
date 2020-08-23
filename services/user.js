/* eslint-disable no-undef */
/* eslint-disable no-restricted-syntax */

/* An API to fetch the data from the JSON objects provided
/ using axios module
/the function updateData passed the JSON data to two arrays
/
the function getData retrieves the data from the maps and validates the user name
*/

const axios = require('axios');
const moment = require('moment');

let uIdMap = new Map(); // a map to store username => userID values ;
let userMap = new Map(); // a map to store userID =>  birthdate values and address values;

function updateData() {
  uIdMap = new Map(); // a map to store username => userID values ;
  userMap = new Map(); // a map to store userID =>  birthdate values and address values

  // url1 is the link to a provided JSON object
  const url1 = 'https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json';

  // url2 is the link to a provided JSON objedt
  const url2 = 'https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json';

  // the function returns a Promise as due to the asyncronous nature of Node.JS
  // the JSON data cannot be stored in the maps from the first run
  return new Promise((resolve, reject) => {
    axios({

      method: 'get',
      url: url1,
      responseType: 'json',

    })
      .then((response) => {
        const uData = response.data; // store the data in the map

        // put the data from uData array into uIdMap
        for (info of uData) {
          uIdMap.set(info.username, info.uid);
        }

        return axios({

          method: 'get',
          url: url2,
          responseType: 'json',

        });
      }).then((response) => {
        const uProfile = response.data; // store the date in the array

        // put the data from uProfile array into userMap
        for (data of uProfile) {
          userMap.set(data.userUid, data);
        }

        resolve();
      }).catch((err) => {
        reject(err);
      });
  });
}

function getData(username) {
  // validate the username
  if (!username || !uIdMap.has(username)) {
    return null;
  }

  const userId = uIdMap.get(username); // get the userId from the uIdMap

  const birthdate = moment(userMap.get(userId).birthdate, 'YYYY/DD/MM'); // get the birthdate and parse it to YYYY/DD/MM format

  const { address } = userMap.get(userId); // get the user's address

  return {
    username, userId, birthdate, address,
  };
}

module.exports = {

  updateData,
  getData,

};
