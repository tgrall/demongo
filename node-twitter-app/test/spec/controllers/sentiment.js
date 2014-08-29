'use strict';

describe('Controller: SentimentCtrl', function () {

  // load the controller's module
  beforeEach(module('dashApp'));

  var SentimentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SentimentCtrl = $controller('SentimentCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
