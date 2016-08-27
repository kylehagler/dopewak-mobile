angular.module('starter')


.controller('LeaderboardCtrl', function($scope, $ionicPopup, $firebaseObject, $firebaseArray, $timeout, $ionicLoading) {

	var leaderboardRef = firebase.database().ref('/cards');
    var leaderboardQuery = leaderboardRef.orderByChild("score");
    var leaderboardArray = $firebaseArray(leaderboardQuery);

    leaderboardArray.$loaded().then(function(x){
      $timeout(function(){
      	$scope.leaderboard = leaderboardArray;
      });
  	});


});