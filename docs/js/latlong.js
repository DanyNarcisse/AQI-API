var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var prompt = require('prompt');
var async = require('async');

var addressData = {}

//Checking if file exists. If true, clears data
if (fs.existsSync('./data-location.json')) {
  fs.truncate('./data-location.json', 0, function() {
  })
}

//URL Google Map API
function url(address)
{
  const APIkey = 'YOUR_API_KEY'
  return 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address.city + address.country + '&key=' + APIkey
}

//Prompts user for city and country
async function getData()
{
  return new Promise(function(resolve, reject){
    prompt.start();
    prompt.addProperties(addressData, ['city', 'country'], function (err) {
      if (err)
      return onErr(err);
      resolve(addressData)
    });
  })
}

async function Main()
{
  var address = await getData();
  var coordinates = {'city': address.city, 'country': address.country, 'lat' : '', 'long': ''};
  url = url(address);

  console.log('Requesting:' + url)

  request(url, function(error, response, body){
    if(!error){
      var jsonArr = JSON.parse(body);
      var x=jsonArr.results;
      var y=x[0];
      coordinates.lat = y.geometry.location.lat;
      coordinates.long = y.geometry.location.lng

      console.log(coordinates);

      fs.appendFile('data-location.json', JSON.stringify(coordinates, null, 2), function(error){
        console.log('Location stored in data-location.json');

      });
    }
    else {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    }
  })
}

Main();
