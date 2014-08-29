'use strict';

angular.module('dashApp')
  .controller('SentimentCtrl',  function ($scope, $rootScope, $http, $timeout) {
  	
	  $scope.timeRangeList = [
	  						{label : "Last Minute", value : "mn"},
	  						{label : "Last Hour", value : "h"},
	  						{label : "Last Day", value : "d"}
	  						];
	  $scope.selectedTimeRange = {label : "Last Minute", value : "mn"};
	  
	
  	 $scope.brandList = $rootScope.brandList;
  	$scope.selectedBrand =  {label:"Apple", value:"apple"} ;





	$scope.onStatusChange = function(){
		var selectedBrand = $scope.selectedBrand;
		var selectedTimeRange = $scope.selectedTimeRange	
      $http.get('/api/sentiments/'+ $scope.selectedBrand.value +"/"+ selectedTimeRange.value ).success(function(data) {
		  $scope.results = data.results;
		  $scope.range = data.range;
		  
	      $scope.chartData = [
	          {
	              "key": "Positive",
	              "values": [] 
	          }
			  ,
			  {
			      "key": "Negative",
			      "values": [] 
			  }
			  ];

              var colorArray = ['#629534', '#c80032', '#0000ff', '#6464ff'];
              $scope.colorFunction = function(){
                  return function(d, i){
                      return colorArray[i];
                  }
              }
		  for (var idx in $scope.results ) {
			  var point = $scope.results[idx];
  			  $scope.chartData[0].values.push( [ point.label , point.pos_score ] );
  			  $scope.chartData[1].values.push( [ point.label , point.neg_score ] );
		  }
      });
	
	
};
	

});
