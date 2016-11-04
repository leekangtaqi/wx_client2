'use strict';

angular.module('clientApp')
  .controller('HelpCtrl', function ($scope) {
    $scope.message = 'Hello';
  })
  .controller('MenuCtrl', function ($scope, $rootScope,$cookies,$uibModal,RestFx) {
    if($cookies.get('commId')){
      $scope.commId = $cookies.get('commId');
    }
    $rootScope.title = '';
    $scope.signOutDialog = function () {
      $uibModal.open({
        templateUrl: 'partials/user/signOut',
        controller: 'ModalSignOutCtrl',
      });
      return false;
    };
    RestFx.one('my').get().then(function(fxer){
      $scope.my_fxer = fxer;
    });
    if($cookies.get('fxer')) {
      RestFx.one('info').get({id:$cookies.get('fxer')}).then(function(fxer){
        $scope.fxer = fxer;
      });
    }
  })
  .controller('HelpRuleCtrl', function($scope,RestDoc){
    RestDoc.one('groupRule').get().then(function(document){
      $scope.docRule = document;
    });
  })
  .controller('HelpIntroCtrl', function($scope,RestDoc){
    RestDoc.one('service_phone').get().then(function(document){
      $scope.docServ = document;
    });
  })
;
