'use strict';

angular.module('clientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('help', {
        url: '/help',
        templateUrl: 'app/help/help.html',
        controller: 'HelpCtrl'
      })
	  .state('help.description', {
        url: '/description',
        templateUrl: 'app/help/description.html'
      })
	  .state('help.site_guide', {
        url: '/site_guide',
        templateUrl: 'app/help/site_guide.html'
      })
	  .state('help.intro', {
        url: '/intro',
        templateUrl: 'app/help/intro.html',
        controller: 'HelpIntroCtrl'
      })
	  .state('help.rule', {
        url: '/rule',
        templateUrl: 'app/help/rule.html',
        controller: 'HelpRuleCtrl'
      })
	  .state('help.about', {
        url: '/about',
        templateUrl: 'app/help/about.html'
      })
	  .state('help.agreement', {
        url: '/agreement',
        templateUrl: 'app/help/agreement.html'
      })
	  .state('help.more', {
        url: '/more',
        templateUrl: 'app/help/more.html',
		    controller: 'MenuCtrl'
      })
    .state('help.merchant', {
        url: '/merchant',
        templateUrl: 'app/help/merchant.html'
      })
    ;
  });
