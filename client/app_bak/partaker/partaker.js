'use strict';

angular.module('clientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('partaker', {
        url: '/partaker',
        templateUrl: 'app/partaker/partaker.html',
      })
      .state('partaker.list', {
        url: '/list?id',
        templateUrl: 'app/partaker/partaker.list.html',
        controller: 'PartakerCtrl',
        resolve:{
          partakers : function($stateParams,Partaker){
            var params = {};
            if($stateParams.id){
              params = {group:$stateParams.id}
            }
            if($stateParams.my){
              params = {my:$stateParams.my}
            }
            return new Partaker(params);
          }
        }
      })
      .state('partaker.my', {
        url: '/my',
        templateUrl: 'app/partaker/partaker.my.html',
        controller: 'PartakerCtrl',
        resolve:{
          partakers : function(Partaker){
            return new Partaker({my:true});
          }
        }
      })
  });