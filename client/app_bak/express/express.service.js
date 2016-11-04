'use strict';

angular.module('clientApp')
  .service('RestExpress', function (Restangular) {
    return Restangular.service('express');
  });