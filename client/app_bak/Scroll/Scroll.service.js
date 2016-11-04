'use strict';

angular.module('clientApp')
.factory('Scroll',function($http){
    var Scroll = function(url) {
        this.items = [];
        this.busy = false;
        this.page = 1;
        this.url = url;
        this.count = -1;
      };
    Scroll.prototype.nextPage = function() {
      if (this.busy){
        return false;
      }
      this.busy = true;
      var url = this.url+'?page='+this.page+'&limit=10';
      $http.get(url)
        .success(function(data) {
          if(data.code){
            this.count = 0;
            return;
          }
          this.count = data.count;
          angular.forEach(data.list, function(value) {
            var val = value;
            if(value.group){
              val = value.group;
              val.commodity = value.commodity;
              val.time.join = value.time.join;
            }
            var time = val.time;
            if(time){
              val.isBefore = moment().isBefore(time.end);
            }
            
            this.push(val);
          },  this.items);
          this.page++;
          this.busy = false;
        }.bind(this));
    };
    return Scroll;
  })
