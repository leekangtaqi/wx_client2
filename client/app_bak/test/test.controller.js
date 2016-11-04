'use strict';
 
angular.module('clientApp')
  .controller('TestCtrl', function ($scope, Restangular) {
    $scope.message = 'HELLO';
    $scope.state = "欢迎使用";
    $scope.localId = 'xxx';
    $scope.serverId = 'xxxxxxx';
    
    $scope.start = function() {
      wx.startRecord();
      $scope.state = "开始";
    };
    
    $scope.stop = function() {
      wx.stopRecord({
        success: function (res) {
          $scope.localId = res.localId;
          $scope.state = "停止";
        }
      });
    };
    
    $scope.play = function() {
      $scope.state = "播放";
      wx.playVoice({
        localId: $scope.localId
      });
    };
    
    $scope.save = function() {
      $scope.state = "保存";
      wx.uploadVoice({
        localId: $scope.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function (res) {
          $scope.serverId = res.serverId; // 返回音频的服务器端ID
        }
      });
    };
    
    $scope.open = function() {
      $scope.state = "打开";
      wx.downloadVoice({
        serverId: $scope.serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function (res) {
            $scope.localId = res.localId; // 返回音频的本地ID
        }
      });
    };
    
    $scope.download = function() {
      $scope.state = "下载";
      /*Restangular.one('wechat').post('download', {'serverId': $scope.serverId}).then(function(voice){
        $scope.voice = voice;
        $scope.state = $scope.voice.voice._id;
      });*/
    };
    
    $scope.upload = function() {
      $scope.state = "上传";
      
      /*Restangular.one('wechat').post('upload', {'id': $scope.voice.voice._id}).then(function(res){
        $scope.state = "上传...";
        $scope.state = res;
      });*/
    };
    
  });
