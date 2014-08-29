'use strict';

angular.module('dashApp')
  .controller('TweetByUsersCtrl', function ($scope, $http, $routeParams) {
	  $scope.helpContext = "index";
	  $scope.viewType = "user";
	  
	  
	  $scope.screen_name = $routeParams.screen_name
	  $http.get('/api/tweets/user/' + $routeParams.screen_name ).success(function(tweets) {
		$scope.tweets = tweets.concat($scope.tweets);
      });


  });
