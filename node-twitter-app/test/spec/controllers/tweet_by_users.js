'use strict';

describe('Controller: TweetByUsersCtrl', function () {

  // load the controller's module
  beforeEach(module('dashApp'));

  var TweetByUsersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TweetByUsersCtrl = $controller('TweetByUsersCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
