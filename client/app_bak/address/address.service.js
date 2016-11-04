'use strict';

angular.module('clientApp')
  .service('Address', function(){
    this.isEqual = function(o1, o2){
      return o1.id === o2.id;
    }
    this.format = function(arr, field1, field2){
      return arr.map(function(a){
        a[field2] = a[field1];
        delete a[field1];
        return a;
      })
    }
    this.distinct = function(arr){
      var me = this;
      return arr.reduce(function(acc, curr){
        if(acc.filter(function(a){
          return me.isEqual(a, curr)
        }).length <= 0){
          acc.push(curr);
        }
        return acc;
      }, [])
    }
    this.getChildren = function(items, id){
      return items.filter(function(i){
        return i.parent === id;
      });
    }
  })
  .service('RestAddr', function (Restangular) {
    return Restangular.service('address');
  })
  .factory('WxAddr',function(RestWechat,$location,Alert,$rootScope){
    function editAddress(){
      RestWechat.one('sign').one('address').get({url:$location.absUrl()}).then(function(data){
        $rootScope.wx_addr_data = data;
        var addr_config = {
          appId: data.appId,
          scope: "jsapi_address",
          signType: "sha1",
          addrSign: data.addrSign,
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr      
        };
        $rootScope.wx_addr_config = addr_config;
        var addr_callback = function(res){
          $rootScope.wx_addr = res;
          if(!res) return false;
          if(res.err_msg){
            Alert.add('warning',res.err_msg);
            return false;
          }
          var address = res.addressCitySecondStageName+res.addressCountiesThirdStageName+res.addressDetailInfo;
          $rootScope.address = {
            name:res.proviceFirstStageName,
            telephone:res.telNumber,
            address:address
          }
        };
        WeixinJSBridge.invoke('editAddress', addr_config, addr_callback);
      });
    }
    function WeixinJSBridgeReady(){
      if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
          editAddress();
      } else {
          if (document.addEventListener) {
              document.addEventListener("WeixinJSBridgeReady", editAddress, false);
          } else if (document.attachEvent) {
              document.attachEvent("WeixinJSBridgeReady", editAddress);
              document.attachEvent("onWeixinJSBridgeReady", editAddress);
          }
      }
    }
    return WeixinJSBridgeReady;  
  });
