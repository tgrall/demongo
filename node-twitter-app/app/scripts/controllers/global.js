'use strict';

angular.module('dashApp')
  .controller('GlobalCtrl', function ($scope, $rootScope, $http) {
	  $scope.helpContext = "index";
	  $http.get('/api/config/keywords' ).success(function(data) {
	    $rootScope.brandList = data.keywords;
	  });
				
  });