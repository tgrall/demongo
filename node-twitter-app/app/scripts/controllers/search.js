'use strict';

angular.module('dashApp')
  .controller('SearchCtrl', function ($scope, $http, $location) {
	  $scope.helpContext = "search";
	  var q = $location.search()['q'];
	  $http.get('/api/search?q='+ q ).success(function(data) {
        $scope.results = data.results.results;
		$scope.query = data.query;
      });
  });
