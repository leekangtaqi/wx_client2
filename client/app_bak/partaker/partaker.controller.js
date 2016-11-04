'use strict';

angular.module('clientApp')
.controller('PartakerCtrl',function($scope,$rootScope,partakers) {
  $rootScope.title = '拼团列表';
  $scope.partakers = partakers;
})