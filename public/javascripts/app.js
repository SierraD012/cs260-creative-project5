//This is the inner app.js

var app = window.angular.module('clickerApp', []);

app.controller('clickerCtrl', clickerCtrl);
app.directive('battle', battleDirective);
app.directive('login', loginDirective);

function clickerCtrl($scope, $http) {
    document.getElementById('id01').style.display='block'
    console.log(">NG:CLICKERCTRL called");

    $scope.redPoints = 0;
    $scope.bluePoints = 0;
    $scope.yellowPoints = 0;
    $scope.greenPoints = 0;
    $scope.username = '';
    
    var red = 0;
    var blue = 0;
    var yellow = 0;
    var green = 0;

    $scope.userName = function(userName){
        console.log("The userName should be updated and sent to server");
        
        
        $scope.userName = userName;
        $.get('http://54.236.42.112:4200/', {user : userName}, function(httpResponse){
           console.log("Initialising the data", httpResponse);
           
           
            updateTextFields($scope);           
        });
        
    }
    
    $scope.addPoint = function(teamColor) {

        $.post('http://54.236.42.112:4200/updateTeamData', { color: teamColor }, function(httpResponse) {
            console.log('response:', httpResponse);
            var colors = JSON.parse(httpResponse)
            console.log(colors)
            red = colors.red;
            blue = colors.blue;
            yellow = colors.yellow;
            green = colors.green;
            var innerCollors = [red, blue, yellow, green]
            console.log(innerCollors)

            $scope.redPoints = colors.red;
            $scope.bluePoints = colors.blue;
            $scope.yellowPoints = colors.yellow;
            $scope.greenPoints = colors.green;

            updateTextFields($scope);
            updateBackground($scope);

        });
    };
}

function updateTextFields($scope) {
    $("#redPts").text("POINTS: " + $scope.redPoints);
    $("#bluePts").text("POINTS: " + $scope.bluePoints);
    $("#yellowPts").text("POINTS: " + $scope.yellowPoints);
    $("#greenPts").text("POINTS: " + $scope.greenProints);
}

function updateBackground($scope) {
    //change BG color to match current winning team 
    var winningPts = Math.max($scope.redPoints, $scope.bluePoints, $scope.yellowPoints);
    if (winningPts == $scope.redPoints) {
        //change bg to red
        $("#mainBody").css("background-color", "#7c0000");
    }
    else if (winningPts == $scope.bluePoints) {
        //change bg to blue
        $("#mainBody").css("background-color", "#003b9b");
    }
    else {
        //change bg to yellow
        $("#mainBody").css("background-color", "#917d00");
    }
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
