'use strict';

angular.module('dashApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'wu.masonry',
  'google-maps',
  'nvd3ChartDirectives',
  'dashApp.directives'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/tweets/', {
        templateUrl: 'partials/tweets',
        controller: 'TweetsCtrl'
	  })
      .when('/tweets/tags/', {
        templateUrl: 'partials/tags',
        controller: 'TagsCtrl'
	  })
      .when('/tweets/user/:screen_name', {
        templateUrl: 'partials/tweets',
        controller: 'TweetByUsersCtrl'
      })
      .when('/tweets/tags/:tag', {
        templateUrl: 'partials/tweets',
        controller: 'TweetsByTagsCtrl'
	  })
      .when('/tweets/:id', {
        templateUrl: 'partials/tweet_view',
        controller: 'TweetViewCtrl'
	  })
      .when('/mediaViewer', {
        templateUrl: 'views/mediaviewer.html',
        controller: 'MediaviewerCtrl'
      })
      .when('/media_viewer', {
        templateUrl: 'partials/media_viewer.html',
        controller: 'MediaViewerCtrl'
      })
      .when('/search', {
        templateUrl: 'partials/search.html',
        controller: 'SearchCtrl'
      })
      .when('/map/:id?', {
        templateUrl: 'partials/map.html',
        controller: 'MapCtrl'
      })
      .when('/stats', {
        templateUrl: 'partials/stats.html',
        controller: 'StatsCtrl'
      })
      .when('/sentiment', {
        templateUrl: 'partials/sentiment.html',
        controller: 'SentimentCtrl'
      })
      .when('/config', {
        templateUrl: 'partials/config.html',
        controller: 'ConfigCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
  })
  ;