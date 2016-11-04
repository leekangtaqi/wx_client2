'use strict';

angular.module('clientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('document', {
        url: '/document',
        templateUrl: 'app/document/document.html',
        controller: 'DocumentCtrl'
      });
  });