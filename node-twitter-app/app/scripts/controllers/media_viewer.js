'use strict';

angular.module('dashApp')
  .controller('MediaViewerCtrl', function ($scope, $http, $timeout) {

	  $scope.helpContext = "media_viewer";

	// get the medias
	$http.get('/api/tweets/medias?size=10').success(function(data) {
		$scope.bricks = [];
		var medias = data.result;
		for (var i in medias) {
			$scope.bricks.push( {url:  medias[i].url , tweet : medias[i].tweet_ids[0]  } ) ;
		}
		
		$scope.query = data.query
		
		console.log($scope.mongoQuery );
		
	});


	// add new image automatically		
    (function tick() {
		if ($scope.bricks != null) {

			$http.get('/api/tweets/medias?size=10').success(function(data) {
				var medias = data.result;
				for (var i in medias) {
					$scope.bricks.unshift( {url:  medias[i].url  , tweet : medias[i].tweet_ids[0] } ) ;
				}
			});
		} else {
			console.log("Init...");
		}
		$timeout(tick, 5000);
    })();



	
  });
