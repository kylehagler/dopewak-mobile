angular.module('starter')

// AUTH CONTROLLER
.controller('AuthCtrl', function($scope, $firebaseObject, $firebaseArray, $state, $ionicLoading, $ionicPopup, UserService) {
  
  $scope.creds = {};

  $scope.loggingIn = false;

  $scope.loginWithFacebook = function () {
    if (!$scope.loggingIn) {
      
      $ionicLoading.show();
      
      UserService.loginUserWithFacebook().then(function () {
          $scope.loggingIn = false;
          $state.go('tab.cards');
       });
    }
  }

  $scope.login = function() {
    
    $ionicLoading.show();
    
    firebase.auth().signInWithEmailAndPassword($scope.creds.email, $scope.creds.password).then(function(x){
      $state.go('tab.cards');
    }).catch(function(e) {
      console.log(e.message);
    });
  }

  $scope.signup = function() {

    // to do - check for real email

    if($scope.creds.password !== $scope.creds.confirmPassword) {
      var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: 'Passwords don\'t match!'
      });

      alertPopup.then(function(res) {
        return false;
      });
    } else {
      firebase.auth().createUserWithEmailAndPassword($scope.creds.email, $scope.creds.password).then(function(user){ 

        var userData = {
            "uid": user.uid,
            "email": user.email,
            "dopes": 0,
            "wacks": 0,
            "createdAt": new Date().getTime(),
        };

        var newUserKey = firebase.database().ref().child('users').push().key;

        var userUpdates = {};
        userUpdates['/users/' + newUserKey] = userData;

        firebase.database().ref().update(userUpdates).then(function(x){
          $ionicLoading.show();
          $state.go('tab.cards');
        }); 
      }).catch(function(e) {
        console.log(e.message);
      });
    }
  }

})