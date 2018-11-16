//This is the inner app.js

var app = window.angular.module('clickerApp', []);

app.controller('clickerCtrl', clickerCtrl);

function clickerCtrl($scope, $http) {
    document.getElementById('id01').style.display='block';
    //console.log(">NG:CLICKERCTRL called");
    
    //Initialize scope data
    $scope.allUsers = [];

    $scope.userName = "";
    $scope.redPoints = 0;
    $scope.bluePoints = 0;
    $scope.yellowPoints = 0;
    $scope.greenPoints = 0;
    $scope.username = '';
    
    var host = "http://18.215.14.200:4202";  //change this to the ip/port of whoever is hosting the server - this is Mitch's

    $scope.login = function(){
        var usrnm = $scope.userName;
        console.log(">LOGIN(): sending usrnm: " + usrnm);
        document.getElementById('id01').style.display='none';  //close the login modal 
        
        $.post(host+'/user', {username : usrnm}, function(httpResponse){
            console.log(">LOGIN() got response:");
            console.dir(httpResponse);
            
           //update scope variables using stuff in responseData
           $scope.parseResponse(httpResponse);
           $scope.updateFields();
        });
    };
    
//      //Gets a list of all users+clicks from the server DB - maybe put this on a timer later
//     $scope.updateUserList = function() {
//           console.log(">UPDATEUL() called");
//           return $http.get('/comments').success(function(data){
//             console.log(">UPDATEUL(): Updated successfully");
//             angular.copy(data, $scope.comments);  //this copies the stuff coming back from the REST call into the scope comments array
//           }).fail(function(err){
//               console.log(">UPDATEUL(): Err during http Get:" + err);
//           });
//     };
//   // $scope.updateUserList(); //call it first thing so it updates
    
    
    // This adds a point to the team color, and a click to the username at the same time  
    $scope.addPoint = function(teamColor) {
        $.post(host+'/teampoint', { teamname: teamColor, username: $scope.userName}, function(httpResponse) {
            console.log('>ADDPOINT(): got response: ' + httpResponse);
            
            $scope.parseResponse(httpResponse);
            $scope.updateFields();
        });
    };
    
    // This pulls the usersArray and teamsArray out of the httpResponse JSON and uses it to update the scope variables 
    $scope.parseResponse = function(httpResp) {
        console.log('>PARSERESPONSE(): starting');
        
        var usersArr = httpResp.users;
        var teamsArr = httpResp.teams;
        
        //console.log('>PARSERESPONSE() got usersArr= ');
        //console.dir(usersArr);
        //console.log('>PARSERESPONSE() got teamsArr= ');
        //console.dir(teamsArr);
        
        //Since the teamPoints aren't guaranteed to come back in order, check each one individually 
        for (var t = 0; t < teamsArr.length; t++) {
            var item = teamsArr[t];
            
            switch(item.name){
                case "red":
                    $scope.redPoints = item.points;
                    //console.log('>PR(): redPts now = ' + $scope.redPoints);
                    break;
                case "blue":
                    $scope.bluePoints = item.points;
                    //console.log('>PR(): bluePts now = ' + $scope.bluePoints);
                    break;
                case "yellow":
                    $scope.yellowPoints = item.points;
                    //console.log('>PR(): yellowPts now = ' + $scope.yellowPoints);
                    break;
                case "green":
                    $scope.greenPoints = item.points;
                    //console.log('>PR(): greenPts now = ' + $scope.greenPoints);
                    break;
            }
        }
        
        angular.copy(usersArr, $scope.allUsers);  //this copies the stuff coming back from the server into the scope allUsers array
        console.log('>PR(): allUsers now = ');
        console.dir($scope.allUsers);
        
        console.log('>PARSERESPONSE(): done');
    };
    
    //Using JQuery to update frontend because we're not using ng-repeat
    $scope.updateFields = function(){
        console.log('>UpdateFields() called');
        $("#redPts").text($scope.redPoints);
        $("#bluePts").text($scope.bluePoints);
        $("#yellowPts").text($scope.yellowPoints);
        $("#greenPts").text($scope.greenPoints);
        
        
    };
}
