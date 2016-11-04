'use strict';

angular.module('clientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/?fxer',
        templateUrl: 'app/commodity/commodity.list.html',
        controller: 'CommodityCtrl'
      });
  });
