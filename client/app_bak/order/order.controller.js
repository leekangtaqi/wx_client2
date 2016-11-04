'use strict';

angular.module('clientApp')
  .controller('OrderCtrl',function($scope,$rootScope,$state, partakers){
    $rootScope.title = '订单列表';
    $scope.partakers = partakers;
    $scope.goOrderDetail = function(){
      var order = this.partaker;
      $state.go('order.detail',{id:order.id});
    }
  })
  .controller('OrderDetailCtrl',function($scope,$rootScope,$http,$state,$stateParams,$location,RestPtk,Alert,Wechat){
    $rootScope.title = '订单详情';
    $scope.can_balance = false;
    $scope.status = {qrcode:false};
    RestPtk.one($stateParams.id).get().then(function(data){
      var partaker  = data.partaker;
      var group     = partaker.group;
      var commodity = partaker.commodity;
      $scope.ifBalance =  moment().isBefore(commodity.time.end);
      if(partaker.commodity.model==='ladder'&&partaker.status.balance!==1){
        var people    = commodity.ladder_people;
        var balance   = group.num.balance;
        var order     = group.num.partakers.order;
        if(order>=people) $scope.can_balance = true;
        if(!partaker.group.isBefore) $scope.can_balance = true;
      }
      $scope.partaker = partaker;
      if(commodity.status.qrcode){
        if(data.qrcode){
          $scope.qrcode = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+data.qrcode;
        } else {
          $http.get('/qrcode?id='+partaker.id).success(function(data) {
            $scope.qrcode = data;
          });
        }
        $scope.status.qrcode = true;
      }
      if(commodity.status.qrgun){
        $scope.status.qrcode = true;
        $http.get('/qrcode?id='+'91PINTUAN:'+partaker.qrgun).success(function(data) {
          $scope.qrcode = data;
        });
      }
      //未成团不显示二维码
      if(!partaker.status.success){
        $scope.status.qrcode = false;
      }
    });
    $scope.drawBack = function(){
      RestPtk.one($stateParams.id).one('ask').one('refund').post().then(function(data){
        Alert.add('success',data.message);
        $state.reload();
      });
    };
    $scope.openLocation = function () {
      var poi = $scope.partaker.poi.base_info;
      //wx.ready(function(){
        wx.openLocation({
          latitude: poi.latitude,
          longitude: poi.longitude,
          name: poi.business_name+''+poi.branch_name,
          address: poi.province+poi.city+poi.district+poi.address,
          scale: 17,
          infoUrl: $location.absUrl(),
          fail: function(res){location.reload();}
        });
      //});
    }
  });
