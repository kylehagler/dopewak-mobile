// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'firebase', 'ionic.contrib.ui.tinderCards', 'ngOpenFB', 'starter.services.userService'])

.constant("FACEBOOK_APP_ID", '1661220834116650')

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.run(function(ngFB, FACEBOOK_APP_ID) {
  ngFB.init({appId: FACEBOOK_APP_ID});
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'AuthCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'AuthCtrl'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.cards', {
    url: '/cards',
    views: {
      'tab-cards': {
        templateUrl: 'templates/tab-cards.html',
        controller: 'CardsCtrl'
      }
    }
  })

  .state('tab.card-detail', {
    url: '/cards/:card',
    views: {
      'tab-cards': {
        templateUrl: 'templates/card-detail.html',
        controller: 'CardDetailCtrl'
      }
    }
  })

  .state('tab.leaderboard', {
    url: '/leaderboard',
    views: {
      'tab-leaderboard': {
        templateUrl: 'templates/tab-leaderboard.html',
        controller: 'LeaderboardCtrl'
      },
    }
  })

  .state('tab.chat-detail', {
    url: '/chats/:chatId',
    views: {
      'tab-chats': {
        templateUrl: 'templates/chat-detail.html',
        controller: 'ChatDetailCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
