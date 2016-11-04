'use strict';

angular.module('clientApp')
  .service('RestOrder', function (Restangular) {
    return Restangular.service('order');
  });
