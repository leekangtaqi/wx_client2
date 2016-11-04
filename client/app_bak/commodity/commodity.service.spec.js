'use strict';

describe('Service: commodity', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var commodity;
  beforeEach(inject(function (_commodity_) {
    commodity = _commodity_;
  }));

  it('should do something', function () {
    expect(!!commodity).toBe(true);
  });

});
