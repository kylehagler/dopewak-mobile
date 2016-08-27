angular.module('starter')

.controller('CardsCtrl', function($scope, $ionicPopup, $firebaseObject, $firebaseArray, $timeout, $ionicLoading, TDCardDelegate) {

  $ionicLoading.show();

  firebase.auth().onAuthStateChanged(function(currentUser) {
    console.log(currentUser);

    if(currentUser) {
      $scope.currentUser = currentUser;
      $scope.init();      
    } else {
      $state.go('/login');
    }    
  });

  $scope.init = function() {

    var userRef = firebase.database().ref('/users');
    var userQuery = userRef.orderByChild('uid').equalTo($scope.currentUser.uid);
    var userArray = $firebaseArray(userQuery);

    userArray.$loaded().then(function(x){
      $timeout(function(){
        $scope.currentUser.dopes = userArray[0].dopes;
        $scope.currentUser.wacks = userArray[0].wacks;
      });
    });

    var cardsRef = firebase.database().ref('/cards');
    var cardsArray = $firebaseArray(cardsRef);

    cardsArray.$loaded().then(function(x){
      $timeout(function(){
        
        $scope.allCards = cardsArray;
        $scope.cards = [];

        // Check for seen cards
        var seenCardsRef = firebase.database().ref('swipes');
        var seenCardsQuery = seenCardsRef.orderByChild('uid').equalTo($scope.currentUser.uid);
        var seenCardsArray = $firebaseArray(seenCardsQuery); 

        seenCardsArray.$loaded().then(function(x){
          $timeout(function(){
            // remove seen cards    
            for(var i=0; i < seenCardsArray.length; i++) {
               for(var j=0; j < $scope.allCards.length; j++) {
                 if (seenCardsArray[i].cid === $scope.allCards[j].$id) {
                  $scope.allCards.splice(j,1);
                  break;
                }
              }
            }

            $scope.cards = $scope.allCards;

          });
        }); 
      });

     $ionicLoading.hide();

    });

  }

  $scope.cardSwipedLeft = function(index, id) {
    $scope.cards.splice(index, 1);

    var cardRef = firebase.database().ref('/cards/' + id);
    var cardObj = $firebaseObject(cardRef);

    cardObj.$loaded().then(function(x){
      $timeout(function(){
        cardObj.score -= 1;

        cardObj.$save().then(function(ref) {
          var swipeData = {
              "uid": $scope.currentUser.uid,
              "cid": id,
              "vote": "W",
              "createdAt": new Date().getTime(),
          };

          var newSwipeKey = firebase.database().ref().child('swipes').push().key;

          var swipeUpdates = {};
          swipeUpdates['/swipes/' + newSwipeKey] = swipeData;

          firebase.database().ref().update(swipeUpdates).then(function(x){
            var userRef = firebase.database().ref('users');
            var userQuery = userRef.orderByChild('uid').equalTo($scope.currentUser.uid);
            var userArray = $firebaseArray(userQuery);

            userArray.$loaded().then(function(x){
              $timeout(function(){
                userArray[0].wacks += 1;
                userArray.$save(0).then(function(ref) {
                  $scope.currentUser.wacks = userArray[0].wacks;
                  console.log('Wack');
                });
              });
            });
          });
        }, function(error) {
          console.log("Error:", error);
        });
      })
    });
  };

  $scope.cardSwipedRight = function(index, id) {
    $scope.cards.splice(index, 1);

    var cardRef = firebase.database().ref('/cards/' + id);
    var cardObj = $firebaseObject(cardRef);

    cardObj.$loaded().then(function(x){
      $timeout(function(){
        cardObj.score += 1;

        cardObj.$save().then(function(ref) {

          var swipeData = {
              "uid": $scope.currentUser.uid,
              "cid": id,
              "vote": "D",
              "createdAt": new Date().getTime(),
          };

          var newSwipeKey = firebase.database().ref().child('swipes').push().key;

          var swipeUpdates = {};
          swipeUpdates['/swipes/' + newSwipeKey] = swipeData;

          firebase.database().ref().update(swipeUpdates).then(function(x){
            var userRef = firebase.database().ref('users');
            var userQuery = userRef.orderByChild('uid').equalTo($scope.currentUser.uid);
            var userArray = $firebaseArray(userQuery);

            userArray.$loaded().then(function(x){
              $timeout(function(){
                userArray[0].dopes += 1;
                userArray.$save(0).then(function(ref) {
                  $scope.currentUser.dopes = userArray[0].dopes;
                  console.log('Dope');
                });
              });
            });
          });
        }, function(error) {
          console.log("Error:", error);
        });
      })
    });
  };

  $scope.addCard = function() {

    $scope.data = {};

    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.cardTitle">',
      title: 'Enter Card Title',
      subTitle: 'Please use normal things',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.cardTitle) {
              //don't allow the user to close unless he enters title
              console.log('Nothing entered');
              e.preventDefault();
            } else if($scope.data.cardTitle.length > 35) {
              console.log('Too long');
              e.preventDefault();
            } else {
              //console.log($scope.data.cardTitle);

              // Check if card already exists
              var ref = firebase.database().ref('cards');
              var query = ref.orderByChild('title').equalTo($scope.data.cardTitle);
              var obj = $firebaseArray(query); 

              obj.$loaded().then(function(x){
                $timeout(function(){
                  if(obj[0]) {
                    console.log('Card Already Exists');
                  } else {
                    var cardData = {
                        "title": $scope.data.cardTitle,
                        "added_by": $scope.currentUser.uid,
                        "score": 0,
                        "createdAt": new Date().getTime() 
                    };

                    var newCardKey = firebase.database().ref().child('cards').push().key;

                    var cardUpdates = {};
                    cardUpdates['/cards/' + newCardKey] = cardData;

                    firebase.database().ref().update(cardUpdates).then(function(x){
                      console.log('Card added');
                    });
                  }
                });
              });  
            }
          }
        }
      ]
    });
  }
})