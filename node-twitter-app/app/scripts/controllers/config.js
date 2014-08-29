'use strict';

angular.module('dashApp')
  .controller('ConfigCtrl', function ($scope, $rootScope) {
	  $scope.helpContext = "index";
	  $scope.brandList = $rootScope.brandList; 
  });
