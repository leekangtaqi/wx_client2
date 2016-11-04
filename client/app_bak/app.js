'use strict';
var debugWx = false;
var hostname = window.location.hostname.split('.');
var token = '';

var req = new XMLHttpRequest();
req.open('GET', '/config', false);
req.send(null);
var response = JSON.parse(req.responseText);
var api = response.api;

debugWx  = response.debugWx;
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
var code = getUrlVars()["code"];

if(code){
  req.open('GET', api.uri+'/wechat/token?code='+code, false);
  req.setRequestHeader('X-API-From',api.from);
  req.setRequestHeader('X-Component',api.component);
  req.send(null);
  token = JSON.parse(req.responseText).token;
}
var fxer = getUrlVars()["fxer"];

//*/
angular.module('clientApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'restangular',
  'angularMoment',
  'infinite-scroll',
  'currencyFilter',
  'ngTouch',
  'angular-carousel',
  'ngHolder'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider,$logProvider, RestangularProvider) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $logProvider.debugEnabled('disable');//disable

    RestangularProvider.setBaseUrl(api.uri);
  })
  .run(function ($rootScope, $cookieStore,$cookies, $state, $stateParams, $timeout, $location, Restangular, RestWechat, Wechat, Alert) {
    //$cookieStore.remove('token');
    Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
      if(response.status === 401) {
        $cookieStore.remove('token');
        RestWechat.one('client').get({referer:$state.href($state.current)})
          .then(function(link) {
            location.href = link.link;
          });
      }
      if(response.data.errmsg){
        Alert.add('danger',response.data.errmsg);
      }else{
        Alert.add('danger','系统错误');
      }
    });
    Restangular.addResponseInterceptor(function(data, operation, what, url, response, deferred){
      if(response.status === 205) {
        $cookieStore.remove('token');
        Alert.add('warning','刷新重新加载本地内容！');
        location.reload();
      }
      return data;
    });
    var headers = {'X-API-From': api.from,'X-Component':api.component};
    if(fxer){$cookies.put('fxer', fxer);}
    if($cookies.get('fxer')) {
      headers['X-FXER'] = $cookies.get('fxer');
    }
    Restangular.setDefaultHeaders(headers);
    if(token){$cookieStore.put('token', token);}
    if($cookieStore.get('token')) {
      headers.Authorization = $cookieStore.get('token');
      Restangular.setDefaultHeaders(headers);
      RestWechat.one('userinfo').get().then(function(user){
        $rootScope.user = user;
      });
    }
    $rootScope.$on('$stateChangeStart', function (event, to, toParams, from, fromParams) {
      $rootScope.referer = $state.href(from.name,fromParams);
      if(to.authenticate && !$cookieStore.get('token')) {
        event.preventDefault();
        //$state.go('login');
        RestWechat.one('client').get({referer:$rootScope.referer}).then(function(link) {
          location.href = link.link;
        });
      }
    });
    $rootScope.$on("$stateChangeSuccess", function(event, to, toParams, from, fromParams) {
      if($cookies.get('fxer')) {
        $location.search('fxer', $cookies.get('fxer'));
      }
      $rootScope.referer = $state.href(from.name,fromParams);
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      //Wechat.config(); //不支持spa history.pushState
      $rootScope.state = to.name;
    });
    Wechat.config();
    Wechat.ready();
    wx.error(function(res){
      Alert.add('warning',res.errMsg);
      Wechat.config();
    });
    Restangular.one('merchant').get().then(function(data){
      $rootScope.merchant = data;
      var title = data.pubno.nick_name + '的火爆拼团';
      var desc = '拼团购买更优惠，一起到'+data.pubno.nick_name+'来拼吧';
      Wechat.ready({title:title,desc:desc,timeline:desc});
    });
    $rootScope.isAndroid = navigator.userAgent.match(/Android/i);
    $timeout(function() {$rootScope.scrollTop = true;},500);
  });
