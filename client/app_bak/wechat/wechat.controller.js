'use strict';

angular.module('clientApp')
.controller('WePayCtrl',function($scope, $rootScope, $window, $state, $stateParams,$timeout,$cookies, RestWechat, userAgent){
  $rootScope.title = '微信支付';
  var id = $stateParams.id;
  $scope.reflash = function(){
    alert(id);
    RestWechat.one('pay').one(id).post().then(function(data){
      alert(data.paySign);
      wx.chooseWXPay({
        timestamp: data.timestamp,
        nonceStr : data.nonceStr,
        package  : data.package,
        signType : data.signType,
        paySign  : data.paySign,
        success  : function(res) {
          var url = $state.href(data.state,{id:data.id});
          location.href = url;
        },
        cancel   : function(res) {
          $state.go(data.state,{id:id});
        },
        fail     : function(res) {
          $state.go(data.state,{id:id});
        }
      });
    },function(err){$window.history.go(-2);});
  };
})
.controller('WcAppCtrl',function($scope){
    var timeout;
    function open_appstore() {
        window.location='http://itunes.com/';
    }

    $scope.try_to_open_app = function() {
        timeout = setTimeout('open_appstore()', 300);
    }
})
.controller('QrgunCtrl',function($scope,Restangular,Alert){
    $scope.QrGun = function(){
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          Restangular.one('qrgun').one('kelaile').get({
            code:res.resultStr.replace('91PINTUAN:',''),
            appid:'kll12345',
            timestamp:1458919500,
            device_no:'kll-no-12345',
            shop_code:'shop-one',
            out_shop_code:'out-shop-code',
            wx_app_id:'wxe4107a6d023c1a54',//蜘蛛工社
            sign:'B58887A83E3249079E5A83E7710DFC5C57EBB7Cc'
          }).then(function(data){
            Alert.add('success',data.title);
          });
        }
      });
    }
})
