'use strict';

angular.module('dashApp')
  .controller('NavbarCtrl', function ($scope, $location) {
	  $scope.helpContext = "index";

    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];
    
  });
