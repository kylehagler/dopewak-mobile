angular.module('starter')

.controller('CardDetailCtrl', function($scope, $stateParams, $firebaseObject, $firebaseArray, $timeout, $ionicLoading, $ionicScrollDelegate) {

  firebase.auth().onAuthStateChanged(function(currentUser) {

    if(currentUser) {
      $scope.currentUser = currentUser;
      console.log(currentUser);
      $scope.init();      
    } else {
      $state.go('/login');
    }    
  });

  $scope.init = function() {
    var cardRef = firebase.database().ref('/cards/' + $stateParams.card);
    var cardObj = $firebaseObject(cardRef);

    cardObj.$loaded().then(function(x){
      $timeout(function(){
        $scope.card = cardObj;
        console.log($scope.card);
        $ionicLoading.hide();
      });
    });

    var messagesRef = firebase.database().ref('/messages');
    var messagesQuery = messagesRef.orderByChild('cid').equalTo($stateParams.card);
    $scope.messages = $firebaseArray(messagesQuery);

    $scope.messages.$loaded().then(function(data) {
      console.log(data);
    });
  };

  $scope.sendMessage = function() {
    if($scope.messageText) {
      $scope.messages.$add({
        cid: $stateParams.card,
        text: $scope.messageText,
        username: $scope.currentUser.displayName,
        uid: $scope.currentUser.uid,
        user_photo: $scope.currentUser.photoURL,
        cid: $stateParams.card,
        timestamp: new Date().getTime()
      });

      $scope.messageText = '';

      $ionicScrollDelegate.$getByHandle('show-page').scrollBottom(true);
    }
  };
  
})