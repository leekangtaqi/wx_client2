'use strict';

angular.module('clientApp')
.service('RestComm', function (Restangular) {
  return Restangular.service('commodity');
})
.factory('Commodity', function(RestComm) {
  var Commodity = function(params) {
    this.items = [];
    this.busy = false;
    this.page = 1;
    this.limit = 10;
    this.params = params;
  };

  Commodity.prototype.nextPage = function() {
    if (this.busy) return;
    this.busy = true;
    var query = {page:this.page,limit:this.limit};
    if(this.params.tips){
      query.tips = true;
    }
    RestComm.getList(query).then(function(data){
	    for (var i = 0; i < data.length; i++) {
	      this.items.push(data[i]);
	    }
      if(data.length<this.limit){
        this.busy = true;
        return;
      }
      this.page++;
      this.busy = false;
    }.bind(this));
  };
  return Commodity;
});
