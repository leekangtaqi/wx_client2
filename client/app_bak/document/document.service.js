'use strict';

angular.module('clientApp')
  .service('RestDoc', function (Restangular) {
    return Restangular.service('document');
  })
