'use strict';

angular.module('clientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user', {
        url: '/user',
        templateUrl: 'app/user/user.html',
      })
    .state('user.profile', {
        url: '/profile',
        templateUrl: 'app/user/profile.html',
        controller: 'UserCtrlProfile',
        authenticate: false
      })
    .state('user.card', {
        url: '/card',
        templateUrl: 'app/user/card.html',
        controller: 'UserCtrlCard'
      })
    .state('user.account', {
        url: '/account',
        templateUrl: 'app/user/account.html',
        controller: 'UserAccountCtrl',
        authenticate: false
      })
    .state('user.order', {
        url: '/order',
        templateUrl: 'app/order/order.list.html',
        controller: 'UserOrderCtrl',
        authenticate: true,
        resolve:{
          partakers : function(Partaker){
            return new Partaker({my:true});
          }
        }
      })
    .state('user.redpacket', {
        url: '/redpacket',
        templateUrl: 'app/user/redpacket.html',
        controller: 'UserRedPacketCtrl',
        authenticate: false
      })
    .state('user.drawback', {
        url: '/drawback',
        templateUrl: 'app/user/drawback.html',
        controller: 'UserDrawBackCtrl'
      })
    .state('user.team', {
        url: '/team',
        templateUrl: 'app/user/team.html',
        controller: 'UserCtrlTeam'
      });
  });
