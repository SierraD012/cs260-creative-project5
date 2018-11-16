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

var PointObject = function(name, points){
  var object;
  object.name = name;
  object.points = points;
}
var initialHouses = [
  PointObject("red", 0),
  PointObject("blue", 0),
  PointObject("yellow", 0),
  PointObject("green", 0)
  ];

app.post('/teampoint', function(req, res) {
  console.log("Incoming user...")
  var data = req.body
  console.log(data)


  incrementUser(data.username)
  incrementTeam(data.teamname)
  
  houses.find({}).toArray(function(err, teams) {
    if (err) throw err;
    console.log(teams);
    users.find({}).toArray(function(err, users){
      if (err) throw err;
      var toReturn;
      toReturn.users = users
      toReturn.teams = teams
      res.json(toReturn)
    })
  });
  

});

var incrementTeam = function(teamColor){
  houses.update(
    { name: teamColor },
    { $inc: { points: 1 } }
  )
}

var incrementUser = function(username) {
  users.update(
    // find record with name "MyServer"
    { name: username },
    // increment it's property called "points" by 1
    { $inc: { points: 1 } }
  );
}


app.post('/user', function(req, res) {
  console.log("Incoming user click...")
  var data = req.body;
  var username = data.username;
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

    houses.stats(function(err, stats) {
      if (err) { console.log(err) }
      if (stats.count == 0) { // If we havent inserted before, put the default in
        houses.inser(housePoints, function(err, result) {
          if (err) { console.log(err) }
          else {
            console.log('Inserted documents into the "houses" collection. The documents inserted with "_id" are:', result.count, result);
          }
        });
      }
    });
  });




});
