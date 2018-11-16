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

var PointObject = function(name, points) {
  return {
    name: name,
    points: points
  }
}
var initialHouses = [
  PointObject("red", 0),
  PointObject("blue", 0),
  PointObject("yellow", 0),
  PointObject("green", 0)
];

app.post('/teampoint', function(req, res) {
  console.log("Incoming team point...")
  var data = req.body
  console.log(data)


  incrementUser(data.username)
  incrementTeam(data.teamname)



  sendResponse(res)
});

var sendResponse = function(res) {
  houses.find({}).toArray(function(err, teams) {
    if (err) throw err;
    console.log(teams);
    users.find({}).toArray(function(err, users) {
      if (err) throw err;
      var toReturn = { users: users, teams: teams }
      res.json(toReturn)
    })
  });
}

var incrementTeam = function(teamColor) {
  houses.update({ name: teamColor }, { $inc: { points: 1 } })
}

var incrementUser = function(username) {
  users.update(
    // find record with name "MyServer"
    { name: username },
    // increment it's property called "points" by 1
    { $inc: { points: 1 } }
  );
  if(Math.floor(Math.random()) * 10 > 7){
      users.update({name: "Batman"}, {$inc: {points: 1}});
  }

}

app.get('/', function(req, res) {
  sendResponse(res);
})

app.post('/user', function(req, res) {
  console.log("Incoming user ...")
  var data = req.body;
  console.log(data)
  var username = data.username;
  if(!username){
    sendResponse(res)
    return;
  }
  users.find({ name: username }).toArray(function(err, result) {

    if (err) throw err;
    if (result.length == 0) {
      users.insertOne(PointObject(username, 0), function(err, innerResponse) {
        if (err) throw err;
        sendResponse(res)
      })
    }
    else {
      sendResponse(res)
    }
  })

})
// The controller/functions etc are in the inner app.js file (public/javascripts/app.js) cuz that's the only way I could get it to work 
app.listen(4202, function() {
  console.log("Server listening on port 4202")
})

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
        console.log("Initializing collection houses")
        console.log(initialHouses)
        houses.insertMany(initialHouses, function(err, result) {
          console.log("Attempting to initialize db")
          if (err) { console.log(err) }
          else {
            console.log('Inserted documents into the "houses" collection. The documents inserted with "_id" are:', result.count, result);
          }
        });
      }
      else {

      }

    });
  });




});
