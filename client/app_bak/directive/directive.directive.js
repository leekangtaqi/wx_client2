'use strict';

angular.module('clientApp')
  .directive('setwidth', function($document, $timeout) {
    return function(scope, element, attr) {
      function doDomStuff() {
        $timeout(function() {
          var width = parseInt(window.getComputedStyle(element.parent().parent()[0]).width, null);
          if (width) {
            element.css({
              width:width + 'px'
            });
          } else {
            doDomStuff();
          }
        }, 100);
      }
        doDomStuff();
    };
  }).directive('backButton', function(){
    return {
      restrict: 'A',
      link: function(scope, element) {
        function goBack() {
          history.go(-scope.backStep);
          scope.backStep = 1;
          scope.$apply();
        }
        element.bind('click', goBack);
      }
    };
  }).directive('autoHide',function(){
    return function(scop,elem){
      var delay = 777;
      var timeout = null;
      angular.element(window).bind('scroll', function() {
        elem.hide();
        clearTimeout(timeout);
        timeout = setTimeout(function(){
          elem.show();
        },delay);
      });
    };
  }).directive('compile',function($compile){
    return function(scope, element, attrs) {
      scope.$watch(
        function(scope) {
          return scope.$eval(attrs.compile);
        },
        function(value) {
          element.html(value);
          $compile(element.contents())(scope);
        }
      );
    };
  }).filter('newlines', function () {
    return function(text) {
      console.log(text);
      return text.replace(/\n/g, '<br/>');
    };
  }).filter('noHTML', function () {
    return function(text) {
      return text
              .replace(/&/g, '&amp;')
              .replace(/>/g, '&gt;')
              .replace(/</g, '&lt;');
    };
  }).filter('nlToArray', function() {
    return function(text) {
      return text.split('\n');
    };
  }).filter('currencys', function($filter, $locale) {
    return function (num) {
      var sym = $locale.NUMBER_FORMATS.CURRENCY_SYM;
      return $filter('currency')(num, '<span>'+ sym +'</span>');
    };
  }).directive('holderFix', function () {
    return {
      link: function (scope, element, attrs) {
        Holder.run({images: element[0], nocss: true});
      }
    };
  }).directive('phone', function () {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function(viewValue) {
          var PHONE_REGEXP = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])[0-9]{8}$/;
          if (PHONE_REGEXP.test(viewValue)) {
            ctrl.$setValidity('phone', true);
            return viewValue;
          } else {
            ctrl.$setValidity('phone', false);
            return undefined;
          }
        });
      }
    };
  }).directive('targetForAndroid', function () {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var href = element.href;
          if(navigator.userAgent.match(/Android/i)) {
            element.attr("target", "_self");
          }
        }
    };
}).filter('nl2br', function($sce){
    return function(msg,is_xhtml) { 
        var is_xhtml = is_xhtml || true;
        var breakTag = (is_xhtml) ? '<br />' : '<br>';
        var msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
        return $sce.trustAsHtml(msg);
    }
});
