'use strict';

angular.module('clientApp')
  .factory('userAgent',function(){
    this.isAndroid =  function() {
      return navigator.userAgent.match(/Android/i);
    };
    this.isIOS = function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    };
    this.isBlackBerry = function(){
      return navigator.userAgent.match(/BlackBerry/i);
    };
    this.isOpera = function(){
      return navigator.userAgent.match(/Opera Mini/i);
    };
    this.isWindows = function(){
      return navigator.userAgent.match(/IEMobile/i);
    };
    this.isWechat = function(){
      return navigator.userAgent.match(/MicroMessenger/i);
    };
    this.mobile = function(){
      return (this.isAndroid || this.isIOS || this.isBlackBerry || this.isOpera || this.isWindows);
    };
    return this;
  });
