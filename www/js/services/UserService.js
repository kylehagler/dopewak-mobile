var app = angular.module('starter.services.userService', []);

app.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);

app.service('UserService', function ($firebaseAuth, $firebaseObject, $firebaseArray, $timeout, ngFB, $q, $rootScope, $localstorage, $ionicPopup) {

	var self = {
		/* This contains the currently logged in user */
		current: {},

		/*
		 Makes sure the favorites property is preset on the current user.

		 firebase REMOVES any empty properties on a save. So we can't
		 bootstrap the user object with favorites: {}.
		 */
		ensureFavorite: function () {
			if (!self.current.favorites) {
				self.current.favorites = {};
			}
		},

		/*
		 If adds or removes a show from the users favorites list
		 */
		toggleFavorite: function (show) {
			// Toggles the favorite setting for a show for the current user.
			self.ensureFavorite();
			if (self.current.favorites[show.showid]) {
				self.removeFavorite(show)
			} else {
				self.addFavorite(show)
			}
			self.current.$save();
		},
		/*
		 Adds a show to the users favorites shows list
		 */
		addFavorite: function (show) {
			self.ensureFavorite();
			self.current.favorites[show.showid] = show;
		},
		/*
		 Removes a show from the users favorites shows list
		 */
		removeFavorite: function (show) {
			self.ensureFavorite();
			self.current.favorites[show.showid] = null;
		},
		/*
		 Logout the user
		 */
		logoutUser: function () {
			var auth = $firebaseAuth();
			return auth.$signOut();
		},
		/*
		 Login the user
		 */
		/*
		 Login the user
		 */
		loginUserWithFacebook: function () {
			var d = $q.defer();

			//
			// Initiate the facebook login process
			//
			console.log('Calling facebook login');
			ngFB.login({scope: 'email'}).then(
				function (response) {
					if (response.status === 'connected') {
						console.log('Facebook login succeeded');
						var token = response.authResponse.accessToken;
						//
						// We are logged in so now authenticate via firebase
						//
						console.log('Authenticating with firebase');
						var auth = $firebaseAuth();
						var credential = firebase.auth.FacebookAuthProvider.credential(token);
						auth.$signInWithCredential(credential)
							.then(function (firebaseUser) {
								//
								// All good, resolve the promise and lets rock!
								//
								console.log("Signed in as:", firebaseUser.uid);
								console.log("Firebase user:", firebaseUser);

								
								// check if user already exists in Database, if not, add
								var checkUserRef = firebase.database().ref('/users');
								var checkUserQuery = checkUserRef.orderByChild('uid').equalTo(firebaseUser.uid);
								var checkUserArray = $firebaseArray(checkUserQuery); 

								checkUserArray.$loaded().then(function(x){
          							$timeout(function(){
          								if(!checkUserArray[0]) {
          									var userData = {
									            "uid": firebaseUser.uid,
									            "email": firebaseUser.email,
									            "dopes": 0,
									            "wacks": 0,
									            "createdAt": new Date().getTime(),
									        };

									        var newUserKey = firebase.database().ref().child('users').push().key;

									        var userUpdates = {};
									        userUpdates['/users/' + newUserKey] = userData;

									        firebase.database().ref().update(userUpdates).then(function(x){
									          d.resolve();
									        });
          								} else {
          									d.resolve();
          								}
          							});
          						});
							})
							.catch(function (error) {
								console.error(error);
								$ionicPopup.alert({
									title: "Facebook Error",
									template: 'Failed to login with facebook'
								});
								d.reject(error);
							});	

					} else {
						//
						// There was an error authenticating with facebook
						// Show the user an error message
						//
						alert('Facebook login failed');
						$ionicPopup.alert({
							title: "Facebook Error",
							template: 'Failed to login with facebook'
						});
						d.reject(error);
					}
				});

			return d.promise;
		}
	};

	return self;
})
;