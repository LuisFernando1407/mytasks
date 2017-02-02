'use strict';

/**
 * @ngdoc overview
 * @name myApp
 * @description
 * # Routes
 *
 * Main module of the application.
 */
angular.module('myApp', ['ngRoute'])
      .config(function ($routeProvider, $locationProvider, $httpProvider) {
          var LOGIN = 'login/index.html';
          var PATH = '/angularjs/app/';

          $routeProvider
              .when('/', {
                  templateUrl: PATH + 'views/' + LOGIN,
                  controller:'MainCtrl'
              })
              .when('/home', {
                  templateUrl: PATH + 'views/home.html',
                  controller: 'HomeCtrl'
              })
              .otherwise({
                  redirectTo: '/'
              });
          window.localStorage['interceptor'] = $httpProvider.interceptors.push('InterceptorAuth');
          /* Remove # from URL
          /*$locationProvider.html5Mode({
              enabled: true,
              requireBase: false
          }); */
      });

