'use strict';

describe('Controller: MediaviewerCtrl', function () {

  // load the controller's module
  beforeEach(module('dashApp'));

  var MediaviewerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MediaviewerCtrl = $controller('MediaviewerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
