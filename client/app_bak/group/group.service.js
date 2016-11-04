'use strict';

angular.module('clientApp')
  .service('RestGrp', function (Restangular) {
    return Restangular.service('group');
  })
  .factory('Group', function(RestGrp) {
    var Group = function(params) {
      this.items = [];
      this.busy = false;
      this.page = 1;
      this.limit = 10;
      this.count = 0;
      this.params = params || {};
    };

    Group.prototype.nextPage = function() {
      if (this.busy) return;
      this.busy = true;
      this.params.page = this.page;
      this.params.limit = this.limit;
      RestGrp.getList(this.params).then(function(data){
        this.count = data[0];
        var items = data[1];
        for (var i = 0; i < items.length; i++) {
          this.items.push(items[i]);
        }
        if(items.length<this.limit){
          this.busy = true;
          return;
        }
        this.page++;
        this.busy = false;
      }.bind(this));
    };
    return Group;
  });
