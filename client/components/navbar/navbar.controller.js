'use strict';

angular.module('clientApp')
  .controller('NavbarCtrl', function ($scope, $state, $history, $window) {
  	$scope.hideMore = function() {
  		return $state.is('help.more');
  	}
    $scope.reload = function(){
      location.reload();
    };
    $scope.back = function(){
      //$history.back();
      $window.history.back();
    };
  });