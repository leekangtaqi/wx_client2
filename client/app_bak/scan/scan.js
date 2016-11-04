'use strict';

angular.module('clientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('scan', {
        url: '/scan',
        templateUrl: 'app/scan/scan.html',
        controller: 'ScanCtrl'
      });
  });