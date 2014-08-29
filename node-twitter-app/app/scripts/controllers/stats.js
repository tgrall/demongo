'use strict';

angular.module('dashApp')
  .controller('StatsCtrl', function ($scope, $http, $timeout) {
	  $scope.helpContext = "tweet_by_date";

	$scope.statusList = [
  		{label:"Year", value:1},
  		{label:"Month", value:2},
  		{label:"Day", value:3},
  		{label:"Hour", value:4},
		{label:"Mn", value:5},
		{label:"Sec", value:6}
			];
		$scope.status =  {label:"Sec", value:6} ;

	    $scope.onStatusChange = function(){
	  		var entryStatus = "";
	  	  	entryStatus = ($scope.status);
			
	        $http.get('/api/stats/tweets_by_date/'+ entryStatus.value).success(function(data) {
				
	            $scope.results = data.result;
	            $scope.query = data.query;
				$scope.chartData[0].value = [];
	  		  	for (var idx in $scope.results ) {
	  			  var point = $scope.results[idx];
	  			  var d = new Date( point._id[1], point._id[2] -1 , point._id[3], point._id[4], point._id[5], point._id[6] );
	  			  console.log(d)
	  			  //$scope.chartData[0].values.push( [ d , point.count ] );
	  		  	}
	        });




	    };

      $http.get('/api/stats/tweets_by_date').success(function(data) {
          $scope.results = data.result;
          $scope.query = data.query;
	      $scope.chartData = [
	          {
	              "key": "Tweets",
	              "values": [] 
	          }];

		      $scope.xAxisTickFormatFunction = function(){
		          return function(d){
		              return d3.time.format('%x-%H:%M:%S')(new Date(d));
		          }
		      }

              var colorArray = ['#629534', '#c80032', '#0000ff', '#6464ff'];
              $scope.colorFunction = function(){
                  return function(d, i){
                      return colorArray[i];
                  }
              }


		  for (var idx in $scope.results ) {
			  var point = $scope.results[idx];
			  var d = new Date( point._id[1], point._id[2] -1 , point._id[3], point._id[4], point._id[5], point._id[6] );
			  console.log(d)
			  $scope.chartData[0].values.push( [ d , point.count ] );
		  }
      });
	  

      $http.get('/api/stats/tweets_by_user').success(function(data) {
		  $scope.users = data.result;
	  });



  });
