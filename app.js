//This is the SERVER SIDE app.js

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors')
var app = express();
var bodyParser = require("body-parser");


app.use(cors()) //allow all cors requests. 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//var app = window.angular.module('app', []); //this line doesn't work in this file
//app.controller('clickerCtrl', clickerCtrl); //neither does this line


var teamData = { red: 0, blue: 0, yellow: 0 };

app.get('/', function(req, res){
  console.log("Starting a new page");

  console.log(teamData)
  res.send(JSON.stringify(teamData))
  res.end()
})


app.post('/updateTeamData', function(req, res) {
  console.log("Incoming post for update team data...")
  var data = req.body
  console.log(data)
  
  if(data.color == "red"){
    teamData.red++
  }
  
  if(data.color == "blue"){
    teamData.blue++
  }
  
  if(data.color == "yellow"){
    teamData.yellow++
  }

  console.log(teamData)
  res.send(JSON.stringify(teamData))
  res.end()
})
// The controller/functions etc are in the inner app.js file (public/javascripts/app.js) cuz that's the only way I could get it to work 

module.exports = app;



//  -------------------------   MONGO CODE    -------------------------------
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var users;
var houses;


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("main-game");
  dbo.createCollection("users", function(err, res) {
    if (err) throw err;
    console.log("Collection users created!");
    users = res
  });
  dbo.createCollection("houses", function(err, res) {
    if (err) throw err;
    console.log("Collection houses created!");
    houses = res
  });
}); 

