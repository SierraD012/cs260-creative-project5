//This is the inner app.js

var app = window.angular.module('clickerApp', []);

app.controller('clickerCtrl', clickerCtrl);
app.directive('battle', battleDirective);

//Note that Team Colors have POINTS, Users have CLICKS
function clickerCtrl($scope, $http) {
    document.getElementById('id01').style.display='block';
    //console.log(">NG:CLICKERCTRL called");
    
    $scope.allUsers = [
        {name:"Me", clicks: 300},
        {name:"That Guy", clicks: 42},
        {name:"Joe", clicks: 157}
        ];
    $scope.userName = "";
    $scope.redPoints = 0;
    $scope.bluePoints = 0;
    $scope.yellowPoints = 0;
    $scope.greenPoints = 0;
    $scope.username = '';
    
    var host = "";  //change this to the ip/port of whoever is hosting the server
    var red = 0;
    var blue = 0;
    var yellow = 0;
    var green = 0;

    $scope.login = function(){
        console.log(">LOGIN(): The userName should be updated and sent to server");
        document.getElementById('id01').style.display='none';
        $.post('/user', {userName : $scope.userName}, function(httpResponse){
           console.log(">LOGIN() got response:", httpResponse);
           //update scope variables here using data in httpResponse
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
        $.post(host+'/teampoint', { color: teamColor, userName: username}, function(httpResponse) {
            console.log('>ADDPOINT(): got response:', httpResponse);
            var colors = JSON.parse(httpResponse);
            console.log(">ADDPOINT(): parsed JSON colors:" + colors);
            red = colors.red;
            blue = colors.blue;
            yellow = colors.yellow;
            green = colors.green;
            var innerColors = [red, blue, yellow, green];

            $scope.redPoints = colors.red;
            $scope.bluePoints = colors.blue;
            $scope.yellowPoints = colors.yellow;
            $scope.greenPoints = colors.green;

            //updateTextFields($scope);  //if our data binding is working we shouldn't need to do this 
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
                        '<p class="pointCount" id="redPts" ng-model="redPoints">#</p>' +
                    '</div>' +
                    '<div class="col-sm-4">'  +
                        '<img src="images/ravenclaw.png" class="teamImage" ng-click="addPoint(\'blue\')" alt="Blue Team">' +
                        '<p class="pointCount" id="bluePts" ng-model="bluePoints">#</p>' +    
                    '</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-sm-4">' +
                        '<img src="images/hufflepuff.png" class="teamImage" ng-click="addPoint(\'yellow\')" alt="Yellow Team">' +
                        '<p class="pointCount" id="yellowPts" ng-model="yellowPoints">#</p>' +   
                    '</div>' +
                    '<div class="col-sm-4">' + 
                        '<img src="images/slytherin.png" class="teamImage" ng-click="addPoint(\'green\')" alt="Green Team">' +
                        '<p class="pointCount" id="greenPts" ng-model="greenPoints">#</p>' +   
                    '</div>' +
                '</div>' +
            '</div>'
        ),
        link: link
    };

    function link(scope) {
        //code this later
    }
}
