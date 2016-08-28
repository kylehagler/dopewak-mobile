angular.module('starter')


.controller('LeaderboardCtrl', function($scope, $ionicPopup, $firebaseObject, $firebaseArray, $timeout, $ionicLoading, $state) {

	$ionicLoading.show();

	firebase.auth().onAuthStateChanged(function(currentUser) {
		if(currentUser) {
		  $scope.currentUser = currentUser;
		  $scope.init();      
		} else {
		  $state.go('/login');
		}    
	});

  	$scope.toggleList = function() {
  		if($scope.activeList === 'dope') {
  			$scope.activeList = 'wack';
  		} else if($scope.activeList === 'wack') {
  			$scope.activeList = 'dope';
  		}
  	};

  	$scope.goToCard = function(e) {
  		var cardID = e.target.attributes['data-cardid'].value;
  		$state.go('tab.card-detail', {'card': cardID});
  	};

  	$scope.init = function() {
  		var leaderboardRef = firebase.database().ref('/cards');
	    var leaderboardQuery = leaderboardRef.orderByChild("score");
	    var leaderboardArray = $firebaseArray(leaderboardQuery);

	    leaderboardArray.$loaded().then(function(x){
	      $timeout(function(){
	      	$scope.leaderboard = leaderboardArray;
	      });
	  	});

	  	$scope.activeList = 'dope';
	  	$ionicLoading.hide();
  	}


});