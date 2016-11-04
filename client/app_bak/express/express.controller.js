'use strict';

angular.module('clientApp')
.controller('ExpComCtrl',function($scope,$rootScope,RestExp) {
  $scope.company = RestExp.one('company').get().$object;
})