'use strict';

angular.module('clientApp')
  .service("$history", function($state, $rootScope, $window) {
    var history = [];
    angular.extend(this, {
      push: function(state, params) {
        history.push({ state: state, params: params });
      },
      all: function() {
        return history;
      },
      go: function(step) {
        var prev = this.previous(step || -1);
        return $state.go(prev.state, prev.params);
      },
      previous: function(step) {
        return history[history.length - Math.abs(step || 1)];
      },
      back: function() {
        return this.go(-1);
      }
    });
  });