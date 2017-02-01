'use strict';

/**
 * @ngdoc function
 * @name angularjs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the myApp
 */
angular.module('myApp')
    .controller('MainCtrl', function ($scope, ServiceUser) {
        /* TODO => FAZER REQUESIÇÕES LOG E ACESSAR */
        /* Check URL */
        $scope.$on('$routeChangeStart', function(next, current) {
            $scope.nav = current.$$route.templateUrl !== '/angularjs/app/views/login/index.html';
        });
        /* Post => Return Id*/
        $scope.register = function (user) {
            ServiceUser.postUser(user).then(function (res) {
                window.localStorage['sessionId'] = res.data[0].id;
            });
            $scope.data.firstname = "";
            $scope.data.lastname = "";
            $scope.data.email = "";
            $scope.data.password = "";
        };

       ServiceUser.getUserBySessionId(window.localStorage['sessionId']).then(function (res) {
           $scope.response = res.data[0];
       });
    });
