'use strict';

describe('Service: userAgent', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var userAgent;
  beforeEach(inject(function (_userAgent_) {
    userAgent = _userAgent_;
  }));

  it('should do something', function () {
    expect(!!userAgent).toBe(true);
  });

});
