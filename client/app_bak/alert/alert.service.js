'use strict';

angular.module('clientApp')
  .service('Alert', function ($rootScope, $timeout) {
    var alertService = {};
 
    // global `alerts` array
    $rootScope.alerts = [];

    alertService.add = function(type,msg) {
      $rootScope.alerts.push({
        'type': type,
        'msg': msg,
        'close': function(){
          alertService.closeAlert(this);
        }
      });
      $timeout(function() { alertService.closeAlert(this); }, 5000);
    };

    alertService.closeAlert = function(alert) {
      alertService.closeAlertIdx($rootScope.alerts.indexOf(alert));
    };
 
    alertService.closeAlertIdx = function(index) {
      $rootScope.alerts.splice(index, 1);
    };

    return alertService;
  });
