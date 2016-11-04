'use strict';

angular.module('clientApp')
.controller('FxInfoCtrl',function($scope,$rootScope) {
  $rootScope.title = '申请分销伙伴-第一步';
})
.controller('FxApplyCtrl',function($scope,$rootScope,$timeout,$state,Alert,RestFx) {
  $rootScope.title = '申请分销伙伴-第二步';
  $scope.submitted = false;
  $scope.disabled = false;
  $scope.apply = function(){
    if ($scope.fxForm.$invalid) {
      $scope.submitted = true;
      return false;
    }
    $scope.disabled = true;
    RestFx.one('apply').post('',$scope.fxer).then(function(data){
      //Alert.add('success',data.message);
      $scope.submitted = false;
      $scope.disabled = false;
      $state.go('fx.result');
    });
    $timeout(function() {$scope.disabled = false;},5000);
  }
})
