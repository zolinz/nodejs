const request = require('request');

request({
  url: 'https://maps.googleapis.com/maps/api/geocode/json?address=6%20Barandon%20Court%20Truganina%203029',
  json: true
}, (error, response, body) => {
  console.log(body);
 //console.log(response);
});
