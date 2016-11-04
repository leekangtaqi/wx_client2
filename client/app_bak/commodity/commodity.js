'use strict';

angular.module('clientApp')
  .config(function ($stateProvider) {
    $stateProvider
	  .state('commodity', {
	  		abstract: true,
        url: '/commodity',
        template: '<ui-view/>'
    })
    .state('commodity.list', {
        url: '/list',
        templateUrl: 'app/commodity/commodity.list.html',
        controller: 'CommodityCtrl'
    })
    .state('commodity.tips', {
        url: '/tips',
        templateUrl: 'app/commodity/commodity.list.html',
        controller: 'CommodityCtrl'
    })
	  .state('commodity.info', {
        url: '/:id',
        templateUrl: 'app/commodity/commodity.info.html',
        controller: 'CommodityInfoCtrl',
        resolve:{
          comm:function(RestComm,$stateParams){
            return RestComm.one($stateParams.id).get();
          }
        }
    })
	  .state('commodity.info.group', {
        url: '/group',
        templateUrl: 'app/commodity/group.html',
        controller: 'CommodityGroupCtrl'
    })
  });
