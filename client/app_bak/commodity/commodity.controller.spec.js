'use strict';

describe('Controller: CommodityCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var CommodityCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CommodityCtrl = $controller('CommodityCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
