//This is the inner app.js

var app = window.angular.module('clickerApp', []);

app.controller('clickerCtrl', clickerCtrl);
app.directive('battle', battleDirective);

function clickerCtrl($scope, $http) {
    document.getElementById('id01').style.display='block';
    //console.log(">NG:CLICKERCTRL called");
    
    //Initialize scope data
    $scope.allUsers = [
        {name:"Me", points: 300},
        {name:"That Guy", points: 42},
        {name:"Joe", points: 157}
        ];
    $scope.userName = "";
    $scope.redPoints = 0;
    $scope.bluePoints = 0;
    $scope.yellowPoints = 0;
    $scope.greenPoints = 0;
    $scope.username = '';
    
    var host = "http://18.215.14.200:4202";  //change this to the ip/port of whoever is hosting the server - this is Mitch's
    var red = 0; // we probably don't need these 
    var blue = 0;
    var yellow = 0;
    var green = 0;

    $scope.login = function(){
        var usrnm = $scope.userName;
        console.log(">LOGIN(): sending usrnm: " + usrnm);
        document.getElementById('id01').style.display='none';  //close the login modal 
        
        $.post(host+'/user', {userName : usrnm}, function(httpResponse){
            console.log(">LOGIN() got response:" + httpResponse);
            var responseData = httpResponse.body;
            console.log(">LOGIN() responseData= " + responseData);
         
           //update scope variables using stuff in responseData
        });
    };
    
     //Gets a list of all users+clicks from the server DB - maybe put this on a timer later
    $scope.updateUserList = function() {
          console.log(">UPDATEUL() called");
          return $http.get('/comments').success(function(data){
            console.log(">UPDATEUL(): Updated successfully");
            angular.copy(data, $scope.comments);  //this copies the stuff coming back from the REST call into the scope comments array
          }).fail(function(err){
              console.log(">UPDATEUL(): Err during http Get:" + err);
          });
    };
   // $scope.updateUserList(); //call it first thing so it updates
    
    
    // This adds a point to the team color, and a click to the username at the same time  
    $scope.addPoint = function(teamColor) {
        $.post(host+'/teampoint', { teamname: teamColor, username: $scope.userName}, function(httpResponse) {
            console.log('>ADDPOINT(): got response: ' + httpResponse);
            var responseData = JSON.parse(httpResponse);
            console.log(">ADDPOINT(): parsed responseData = " + responseData);
            // red = colors.red; //I don't think we need these, just set the values to the scope variables 
            // blue = colors.blue;
            // yellow = colors.yellow;
            // green = colors.green;
            // var innerColors = [red, blue, yellow, green];
            var usersArr = responseData.users;
            var teamsArr = responseData.teams;

            //Since the teamPoints aren't guaranteed to come back in order, check each one 
            for (var t = 0; t < teamsArr.length; t++) {
                var item = teamsArr[t];
                
                switch(item.name){
                    case "red":
                        $scope.redPoints = item.points;
                        break;
                    case "blue":
                        $scope.bluePoints = item.points;
                        break;
                    case "yellow":
                        $scope.yellowPoints = item.points;
                        break;
                    case "green":
                        $scope.greenPoints = item.points;
                        break;
                }
            }
            
            //TEST - see what responseData actually has 
            angular.copy(usersArr, $scope.allUsers);  //this copies the stuff coming back from the server into the scope allUsers array
        });
    };
}

function battleDirective() {
    return {
        scope: {
            directive: '='
        },
        restrict: 'E',
        replace: 'true',
        template: (
            '<div class="container text-center">' +
                '<div class="row">' +
                    '<div class="col-sm-4">' +
                        '<img src="images/gryffindor.png" class="teamImage" ng-click="addPoint(\'red\')"  alt="Red Team">' +
                        '<p class="pointCount" id="redPts" ng-model="redPoints"> {{redPoints}} </p>' +
                    '</div>' +
                    '<div class="col-sm-4">'  +
                        '<img src="images/ravenclaw.png" class="teamImage" ng-click="addPoint(\'blue\')" alt="Blue Team">' +
                        '<p class="pointCount" id="bluePts" ng-model="bluePoints"> {{bluePoints}} <p>' +    
                    '</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-sm-4">' +
                        '<img src="images/hufflepuff.png" class="teamImage" ng-click="addPoint(\'yellow\')" alt="Yellow Team">' +
                        '<p class="pointCount" id="yellowPts" ng-model="yellowPoints"> {{yellowPoints}} </p>' +   
                    '</div>' +
                    '<div class="col-sm-4">' + 
                        '<img src="images/slytherin.png" class="teamImage" ng-click="addPoint(\'green\')" alt="Green Team">' +
                        '<p class="pointCount" id="greenPts" ng-model="greenPoints"> {{greenPoints}} </p>' +   
                    '</div>' +
                '</div>' +
            '</div>'
        ),
        link: link
    };

    function link(scope) {
        //code this later
        //hey james why did we have this again -sierra
    }
}
