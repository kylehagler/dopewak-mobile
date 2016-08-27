// angular.module('starter.controllers', [])

// // AUTH CONTROLLER
// .controller('AuthCtrl', function($scope, $firebaseObject, $firebaseArray, $state, $ionicLoading, $ionicPopup) {
  
//   $scope.creds = {};

//   $scope.login = function() {
    
//     $ionicLoading.show();
    
//     firebase.auth().signInWithEmailAndPassword($scope.creds.email, $scope.creds.password).then(function(x){
//       $state.go('tab.cards');
//     }).catch(function(e) {
//       console.log(e.message);
//     });
//   }

//   $scope.signup = function() {
//     // to do - check for real email

//     if($scope.creds.password !== $scope.creds.confirmPassword) {
//       var alertPopup = $ionicPopup.alert({
//         title: 'Error',
//         template: 'Passwords don\'t match!'
//       });

//       alertPopup.then(function(res) {
//         return false;
//       });
//     } else {
//       firebase.auth().createUserWithEmailAndPassword($scope.creds.email, $scope.creds.password).then(function(user){ 

//         var userData = {
//             "uid": user.uid,
//             "email": user.email,
//             "createdAt": new Date().getTime(),
//         };

//         var newUserKey = firebase.database().ref().child('users').push().key;

//         var userUpdates = {};
//         userUpdates['/users/' + newUserKey] = userData;

//         firebase.database().ref().update(userUpdates).then(function(x){
//           $ionicLoading.show();
//           $state.go('tab.cards');
//         }); 
//       }).catch(function(e) {
//         console.log(e.message);
//       });
//     }
//   }

// })

// // CARDS CONTROLLER
// .controller('CardsCtrl', function($scope, $ionicPopup, $firebaseObject, $firebaseArray, $timeout, $ionicLoading, TDCardDelegate) {

//   firebase.auth().onAuthStateChanged(function(currentUser) {
//     if(currentUser) {
//       $scope.currentUser = currentUser;
//       $scope.init();
//     } else {
//       $state.go('/login');
//     }    
//   });

//   $scope.init = function() {

//     var cardsRef = firebase.database().ref('/cards');
//     var cardsObj = $firebaseArray(cardsRef);

//     cardsObj.$loaded().then(function(x){
//       $timeout(function(){
        
//         $scope.allCards = cardsObj;
//         $scope.cards = [];

//         // Check for seen cards
//         var seenCardsRef = firebase.database().ref('swipes');
//         var seenCardsQuery = seenCardsRef.orderByChild('uid').equalTo($scope.currentUser.uid);
//         var seenCardsArray = $firebaseArray(seenCardsQuery); 

//         seenCardsArray.$loaded().then(function(x){
//           $timeout(function(){
//             // remove seen cards    
//             for(var i=0; i < seenCardsArray.length; i++) {
//                for(var j=0; j < $scope.allCards.length; j++) {
//                  if (seenCardsArray[i].cid === $scope.allCards[j].$id) {
//                   $scope.allCards.splice(j,1);
//                   break;
//                 }
//               }
//             }

//             $scope.cards = $scope.allCards;

//             $ionicLoading.hide();

//           });
//         }); 
//       })
//     });
//   }

//   $scope.cardSwipedLeft = function(index, id) {
//     $scope.cards.splice(index, 1);

//     var cardRef = firebase.database().ref('/cards/' + id);
//     var cardObj = $firebaseObject(cardRef);

//     cardObj.$loaded().then(function(x){
//       $timeout(function(){
//         cardObj.score -= 1;

//         cardObj.$save().then(function(ref) {
//           var swipeData = {
//               "uid": $scope.currentUser.uid,
//               "cid": id,
//               "vote": "W",
//               "createdAt": new Date().getTime(),
//           };

//           var newSwipeKey = firebase.database().ref().child('swipes').push().key;

//           var swipeUpdates = {};
//           swipeUpdates['/swipes/' + newSwipeKey] = swipeData;

//           firebase.database().ref().update(swipeUpdates).then(function(x){
//             console.log('Saved 2');
//           });
//         }, function(error) {
//           console.log("Error:", error);
//         });
//       })
//     });
//   };

//   $scope.cardSwipedRight = function(index, id) {
//     $scope.cards.splice(index, 1);

//     var cardRef = firebase.database().ref('/cards/' + id);
//     var cardObj = $firebaseObject(cardRef);

//     cardObj.$loaded().then(function(x){
//       $timeout(function(){
//         cardObj.score += 1;

//         cardObj.$save().then(function(ref) {

//           var swipeData = {
//               "uid": $scope.currentUser.uid,
//               "cid": id,
//               "vote": "D",
//               "createdAt": new Date().getTime(),
//           };

//           var newSwipeKey = firebase.database().ref().child('swipes').push().key;

//           var swipeUpdates = {};
//           swipeUpdates['/swipes/' + newSwipeKey] = swipeData;

//           firebase.database().ref().update(swipeUpdates).then(function(x){
//             console.log('Saved 2');
//           });
//         }, function(error) {
//           console.log("Error:", error);
//         });
//       })
//     });
//   };

//   $scope.addCard = function() {

//     $scope.data = {};

//     var myPopup = $ionicPopup.show({
//       template: '<input type="text" ng-model="data.cardTitle">',
//       title: 'Enter Card Title',
//       subTitle: 'Please use normal things',
//       scope: $scope,
//       buttons: [
//         { text: 'Cancel' },
//         {
//           text: '<b>Save</b>',
//           type: 'button-positive',
//           onTap: function(e) {
//             if (!$scope.data.cardTitle) {
//               //don't allow the user to close unless he enters title
//               console.log('Nothing entered');
//               e.preventDefault();
//             } else {
//               //console.log($scope.data.cardTitle);

//               // Check if card already exists
//               var ref = firebase.database().ref('cards');
//               var query = ref.orderByChild('title').equalTo($scope.data.cardTitle);
//               var obj = $firebaseArray(query); 

//               obj.$loaded().then(function(x){
//                 $timeout(function(){
//                   if(obj[0]) {
//                     console.log('Card Already Exists');
//                   } else {
//                     var cardData = {
//                         "title": $scope.data.cardTitle,
//                         "added_by": $scope.currentUser.uid,
//                         "score": 0,
//                         "createdAt": new Date().getTime() 
//                     };

//                     var newCardKey = firebase.database().ref().child('cards').push().key;

//                     var cardUpdates = {};
//                     cardUpdates['/cards/' + newCardKey] = cardData;

//                     firebase.database().ref().update(cardUpdates).then(function(x){
//                       console.log('Card added');
//                     });
//                   }
//                 });
//               });  
//             }
//           }
//         }
//       ]
//     });
//   }
// })


// // .controller('ChatsCtrl', function($scope, $state, Chats) {
// //   // With the new view caching in Ionic, Controllers are only called
// //   // when they are recreated or on app start, instead of every page change.
// //   // To listen for when this page is active (for example, to refresh data),
// //   // listen for the $ionicView.enter event:
// //   //
// //   //$scope.$on('$ionicView.enter', function(e) {
// //   //});

// //   firebase.auth().onAuthStateChanged(function(currentUser) {
// //     if(currentUser) {
// //       console.log(currentUser);
// //     } else {
// //       $state.go('/login');
// //     }    
// //   });

// //   $scope.chats = Chats.all();
// //   $scope.remove = function(chat) {
// //     Chats.remove(chat);
// //   };
// // })

// // .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
// //   $scope.chat = Chats.get($stateParams.chatId);
// // })

// // .controller('AccountCtrl', function($scope) {
// //   $scope.settings = {
// //     enableFriends: true
// //   };
// // });
