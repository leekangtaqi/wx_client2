'use strict';

angular.module('clientApp')
  .service('RestAlbum', function (Restangular) {
    return Restangular.service('album');
  })
