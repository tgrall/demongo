'use strict';


angular.module('dashApp')
  .controller('TweetsCtrl', function ($scope, $http, $timeout) {
	  $scope.helpContext = "tweets_list";
	  $scope.viewType = "list";
	  
	  
      $http.get('/api/tweets').success(function(data) {
          $scope.tweets = data.results;
          $scope.query = data.query;
      });

      (function tick() {
        	        $http.get('/api/tweets/count').success(function(nbTweets) {
        	          $scope.count = nbTweets;
        			  $timeout(tick, 1000);
        	        });
      })();
      
		        $scope.refreshTweets = function refreshTweets() {
		        	      $http.get('/api/tweets').success(function(data) {
		          $scope.tweets = data.results.concat( $scope.tweets );
		          $scope.query = data.query;
		        	      });
		  };	  



  })

  // View single tweet
  .controller('TweetViewCtrl', function ($scope, $http, $routeParams) {
	  $scope.helpContext = "index";
	  $scope.showAddCustomForm = false;
      
	  $http.get('/api/tweets/' + $routeParams.id.toString() ).success(function(data) {
        $scope.tweet = data.document;
		$scope.query = data.query;
      });
	  
	  $scope.saveMeta = function(id, meta) {
		  $http.post('/api/tweets/meta/'+ id, meta).success(function(data) {
	        $scope.tweet = data.document;
			$scope.query = data.query;
	      });
		  
		  
	  }
	  
  })
  
  // View tweets for a tag
  .controller('TweetsByTagsCtrl', function ($scope, $http, $routeParams) {
	  $scope.helpContext = "index";
	  $scope.viewType = "tag";
	  $scope.tag = $routeParams.tag
	  $http.get('/api/tweets/tags/' + $routeParams.tag ).success(function(tweets) {
		$scope.tweets = tweets.concat($scope.tweets);
      });
  })

  .controller('TagsCtrl', function ($scope, $http, $routeParams) {
	  $scope.helpContext = "index";

 	  $http.get('/api/tweets/tags/' ).success(function(data) {
		$scope.tags = data.result;
		$scope.query = data.query;
      });
  })

  
  ;
  


