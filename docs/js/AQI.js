var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var prompt = require('prompt');
var async = require('async');

//Checking if file exists. If true, clears data
if(fs.existsSync('./data-AQI.json')){
  fs.truncate('data-AQI.json', 0, function() {})
}

async function storeCoordinates(){
  return new Promise(function(resolve, reject){
    fs.readFile('./data-location.json', 'utf8', function (err, data) {
      if (err)
      throw err;
      var coordinates = JSON.parse(data);
      resolve(coordinates);
    });
  })
}

async function url(lat, long){
  return new Promise(function(resolve, reject){
    var parameters = 'breezometer_aqi,random_recommendations,breezometer_description,dominant_pollutant_description,dominant_pollutant_text,pollutants,datetime';
    var APIkey = 'YOUR_API_KEY'
    resolve('https://api.breezometer.com/baqi/?lat=' + lat + '&lon=' + long + '&key=' + APIkey +'&fields=' + parameters);
  })
}

async function Main(){
  var coordinates = await storeCoordinates();
  url = await url(coordinates.lat, coordinates.long);

  request(url, function(error, response, body){
    if(!error){
      console.log('Requesting:' + url)
      var jsonArr = JSON.parse(body);
      console.log(jsonArr);

      fs.appendFile('data-AQI.json', JSON.stringify(jsonArr, null, 2), function(error) {
        console.log('Air quality info stored in data-AQI.json');
      });

    }
    else {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    }
  });

}

Main();
