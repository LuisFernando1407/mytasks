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
          var LOGIN = 'login/';
          var PATH = '/angularjs/app/';

          $routeProvider
              .when('/', {
                  templateUrl: PATH + 'views/' + LOGIN + 'index.html',
                  controller:'MainCtrl'
              })
              .when('/home', {
                  templateUrl: PATH + 'views/home.html',
                  controller: 'HomeCtrl'
              })
              .when('/forgot', {
                  templateUrl: PATH + 'views/' + LOGIN + 'forgot-password.html',
                  controller: 'ForgotPasswordCtrl'
              })
              .otherwise({
                  redirectTo: '/'
              });
          $httpProvider.interceptors.push('InterceptorAuth');
          /* Remove # from URL
          /*$locationProvider.html5Mode({
              enabled: true,
              requireBase: false
          }); */
      });

