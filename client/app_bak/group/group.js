'use strict';

angular.module('clientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('group', {
	      abstract: true,
        url: '/group',
        template: '<ui-view/>'
      })
      .state('group.list', {
        url: '/list?id&my',
        templateUrl: 'app/group/group.list.html',
        controller: 'GroupCtrl'
      })
      .state('group.miss', {
        url: '/miss?id',
        templateUrl: 'app/group/group.list.html',
        controller: 'GroupCtrl'
      })
      .state('group.info', {
        url: '/:id',
        templateUrl: 'app/group/group.info.html',
        controller: 'GroupInfoCtrl',
        resolve:{
          group:function(RestGrp,$stateParams){
            return RestGrp.one($stateParams.id).get();
          }
        }
      })
      .state('group.info.join', {
        url: '/join',
        templateUrl: 'app/group/group.join.html',
        controller: 'GroupJoinCtrl'
      })
      .state('group.info.replenishment', {
        url: '/replenishment',
        templateUrl: 'app/group/group.replenishment.html',
        controller: 'GroupReplenishmentCtrl'
      })
      .state('group.my_post', {
        url: '/my_post',
        templateUrl: 'app/group/my_post.html',
        controller: 'GroupCtrlMyPost',
        authenticate: false
      })
      .state('group.my_join', {
        url: '/my_join',
        templateUrl: 'app/group/my_join.html',
        controller: 'GroupCtrlMyJoin',
        authenticate: false
      })
  });
