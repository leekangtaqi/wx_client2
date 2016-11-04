'use strict';

angular.module('clientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('order', {
          abstract: true,
          url: '/order',
          template: '<ui-view/>'
      })
      .state('order.list', {
        url: '/list',
        templateUrl: 'app/order/order.list.html',
        controller: 'OrderCtrl',
        resolve:{
          partakers : function(Partaker){
            return new Partaker({my:true});
          }
        },
        authenticate: false
      })
      .state('order.detail',{
        url: '/:id',
        templateUrl: 'app/order/order.detail.html',
        controller: 'OrderDetailCtrl',
        authenticate: true
      })
      .state('order.detail.refund',{
        url: '/refund',
        templateUrl: 'app/order/order.refund.html',
        controller: 'OrderDetailCtrl',
        authenticate: true
      })
  });
