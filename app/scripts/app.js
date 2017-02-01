'use strict';

/**
 * @ngdoc overview
 * @name yoangularApp
 * @description
 * # yoangularApp
 *
 * Main module of the application.
 */
angular.module('myApp', ['ngRoute'])
  .config(function ($routeProvider, $locationProvider) {
      var LOGIN = 'login/index.html';
      var PATH = '/angularjs/app/';
      $routeProvider
          .when('/', {
              templateUrl: PATH + 'views/' + LOGIN,
              controller:'MainCtrl'
          })
          .when('/home', {
              templateUrl: PATH + 'views/main.html',
              controller: 'MainCtrl'
          })
          .otherwise({
              redirectTo: '/'
          });
      /*$locationProvider.html5Mode({
          enabled: true,
          requireBase: false
      }); */
  });
