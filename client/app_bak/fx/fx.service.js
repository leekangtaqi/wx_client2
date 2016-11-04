'use strict';

angular.module('clientApp')
  .service('RestFx', function (Restangular) {
    return Restangular.service('fx');
  });
