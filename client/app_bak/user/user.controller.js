'use strict';

angular.module('clientApp')
	.controller('UserAccountCtrl',function ($scope, $uibModal, $rootScope, RestBill) {
    $rootScope.title = '我的拼团';
    $scope.rpNum = 0;
    $scope.dbNum = 0;
    RestBill.one('count').get().then(function(data){
		  $scope.rpNum = data.redpacket;
		  $scope.dbNum = data.drawback;
    });
		$scope.signOutDialog = function () {
			$uibModal.open({
				templateUrl: 'app/user/modal.signout.html',
				controller: 'UserModalSignOutCtrl',
			});
			return false;
		};
  }).controller('UserModalSignOutCtrl', function ($scope, $rootScope, $state, $cookieStore, $uibModalInstance, RestUser) {
    $scope.ok = function () {
    	RestUser.one('sign').one('out').post().then(function(data){
				$uibModalInstance.dismiss('signout');
    		$cookieStore.remove('token');
    		$rootScope.user = null;
    		$state.go('main');
    	});
    };
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }).controller('UserRedPacketCtrl',function ($scope, $rootScope, Bill,RestBill) {
    $rootScope.title = '我的外快';
    $scope.bills = new Bill({type:'group_redpacket'});
    RestBill.one('count').get().then(function(data){
      $scope.rpNum = data.redpacket;
      $scope.dbNum = data.drawback;
    });
  }).controller('UserDrawBackCtrl',function($scope,$rootScope,Bill){
    $rootScope.title = '我的退款';
    $scope.bills = new Bill({type:'group_drawback'});
  }).controller('UserOrderCtrl',function($scope,$rootScope,partakers){
    $rootScope.title = '我的订单';
    $scope.partakers = partakers;
  });
