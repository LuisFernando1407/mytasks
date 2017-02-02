'use strict';

/**
 * @ngdoc function
 * @name yoangularApp.controller:HomeCtrl
 * @description
 * # HomeCtrl before login
 * Controller of the myApp
 */
angular.module('myApp')
  .controller('HomeCtrl', function ($scope, FactoryUser, $location) {
      FactoryUser.getUserBySessionId(window.localStorage['sessionId']).then(function (res) {
          $scope.response = res.data[0];
      });
      
      $scope.logout = function () {
          window.localStorage.removeItem('sessionId');
          window.localStorage.removeItem('interceptor');
          window.localStorage.removeItem('auth');
          $location.path('/');
      };
  });
