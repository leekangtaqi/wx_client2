'use strict';

angular.module('clientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('wepay', {
        url: '/wepay/?id&showwxpaytitle&module&action',
        templateUrl: function ($stateParams){
          var module = $stateParams.module;
          var action = $stateParams.action;
          var temp = 'app/wechat/pay.html';
          if(!!module && !!action){
            temp = 'app/'+module+'/'+module+'.' + action + '.html';
          }
          return temp;
        },
        authenticate: true
      })
      .state('weapp', {
        url: '/weapp',
        templateUrl: 'app/wechat/app.html',
        controller: 'WcAppCtrl'
      })
      .state('qrgun', {
        url: '/qrgun',
        templateUrl: 'app/wechat/qrgun.html',
        controller: 'QrgunCtrl'
      })
  });
