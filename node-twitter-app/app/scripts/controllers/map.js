'use strict';

angular.module('dashApp')
  .controller('MapCtrl', function ($scope, $timeout, $log, $http, $routeParams) {
	  $scope.helpContext = "map";

	  $scope.viewType = "global";
	  $scope.tweetId= $routeParams.id;
	  if ($scope.tweetId) {
	  	$scope.viewType = 'byTweet';
	  }

	  
	  var cities = [];
	  cities["Paris"] = { "latitude" : 48.856614,  "longitude" : 2.3522219};
	  cities["Dublin"] = { "latitude" : 53.3498053,  "longitude" : -6.2603097};
	  cities["London"] = { "latitude" : 51.51121389999999 ,  "longitude" : -0.1198244 };
	  cities["San Francisco"] = { "latitude" : 37.7749295 ,  "longitude" : -122.4194155 };
	  cities["Los Angeles"] = { "latitude" : 34.0522342 ,  "longitude" :-118.2436849 };
	  cities["New York"] = { "latitude" : 40.7143528 ,  "longitude" : -74.00597309999999 };
	  cities["Rio"] = { "latitude" : -22.9133954 ,  "longitude" : -43.20071009999999 };
	  cities["Buenos Aires"] = { "latitude" : -34.5265464 ,  "longitude" : -58.33514479999999 };
	  cities["Sidney"] = { "latitude" : -33.8674869 ,  "longitude" : 151.2069902 };
	  cities["Tokyo"] = { "latitude" : 35.6894875 ,  "longitude" : 139.6917064 };

	  $scope.city = "All";
	  $scope.distance = "50000"
	  $scope.point = cities["Dublin"];
	  
	  
      $scope.onMarkerClicked = function (marker) {
          marker.showWindow = true;
          window.alert("Tweet : "+ marker.title)
      };	  
	  
	  $scope.loadTweets = function() {
		  var distance = $scope.distance;
		  
		  if (!$scope.tweetId) {
			  $scope.point = cities[$scope.city];
			  $scope.map.center = $scope.point;
		  }
		  
		  
	      $http.get('/api/loc_tweets/near_point?latitude='+ $scope.point.latitude +'&longitude='+ $scope.point.longitude +'&distance='+ distance ).success(function(data) {
	          $scope.tweets = data.results;
			  $scope.map.markers = [];
			  
			  if ($scope.defaultMarker) {
			  	$scope.map.markers.push( $scope.defaultMarker  );
		  	  }
			  
			  for (var idx in $scope.tweets) {
				  var tweet = $scope.tweets[idx];
				  $scope.map.markers.push(  {
		                  latitude:  tweet.geo.coordinates[0] ,
		                  longitude: tweet.geo.coordinates[1],
		                  showWindow: false,
						  icon: "/images/mongo-leaf.png",
		                  title: tweet._id +' : '+ tweet.text
					   } ); 
			  }
	          $scope.query = data.query;
	      });
	  }


	  $scope.map = {
              center: {
				  latitude : 53.3498053,
				  longitude : -6.2603097
              },
              zoom: 4,
              options: {
                  disableDefaultUI: false,
                  panControl: true,
                  navigationControl: true,
                  scrollwheel: true,
                  scaleControl: true,
                  streetViewControl: true
              },
			  markers : [ ]			  
          };
		  

		  if ($scope.tweetId) {

  	        $http.get('/api/tweets/'+ $scope.tweetId).success(function(data) {
  				var document = data.document;
			  	$scope.point = { "latitude" : document.coordinates.coordinates[1],  "longitude" : document.coordinates.coordinates[0]}
				console.log($scope.point)
	  		  	$scope.map.center = $scope.point;
				$scope.defaultMarker = {
  			  			  latitude : $scope.point.latitude,
  			  			  longitude : $scope.point.longitude,
  			  	  		  showWindow: false,
  			  	  		  title: document._id +' : '+ document.text,
						  icon: "/images/twitter-marker.png",
						  
  			  		}
  			  	$scope.map.markers.push( $scope.defaultMarker  );
  	        });



		  	
		  } else {
	        $http.get('/api/loc_tweets').success(function(data) {
	            $scope.tweets = data.results;
	  		  	for (var idx in $scope.tweets) {
	  			  var tweet = $scope.tweets[idx];
	  			  $scope.map.markers.push(  {
	  	                  latitude:  tweet.geo.coordinates[0] ,
	  	                  longitude: tweet.geo.coordinates[1],
	  	                  showWindow: false,
						  icon: "/images/mongo-leaf.png",
						  title: tweet._id +' : '+ tweet.text
	  				   } ); 
				}
	            $scope.query = data.query;
	        });
		  }
		  
		  
		  

  });
