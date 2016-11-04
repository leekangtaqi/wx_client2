'use strict';

angular.module('clientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('fx', {
        abstract: true,
        url: '/fx',
        template: '<ui-view/>'
      })
      .state('fx.info', {
        url: '/info',
        templateUrl: 'app/fx/fx.info.html',
        controller: 'FxInfoCtrl',
        authenticate: true
      })
      .state('fx.apply', {
        url: '/apply',
        templateUrl: 'app/fx/fx.apply.html',
        controller: 'FxApplyCtrl',
        authenticate: true
      })
      .state('fx.result', {
        url: '/result',
        templateUrl: 'app/fx/fx.result.html',
        authenticate: true
      });
  });
