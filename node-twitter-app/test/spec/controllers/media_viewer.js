'use strict';

describe('Controller: MediaViewerCtrl', function () {

  // load the controller's module
  beforeEach(module('dashApp'));

  var MediaViewerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MediaViewerCtrl = $controller('MediaViewerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
