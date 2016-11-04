'use strict';

angular.module('clientApp')
  .service('RestUser', function (Restangular) {
    return Restangular.service('user');
  });
