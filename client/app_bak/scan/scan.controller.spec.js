'use strict';

describe('Controller: ScanCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ScanCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ScanCtrl = $controller('ScanCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
