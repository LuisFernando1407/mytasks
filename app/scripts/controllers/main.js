'use strict';

/**
 * @ngdoc function
 * @name angularjs.controller:MainCtrl
 * @description
 * # MainCtrl, register, login
 * Controller of the myApp
 */
angular.module('myApp')
    .controller('MainCtrl', function ($scope, FactoryUser) {
        /* Post => Return Id*/
        $scope.register = function (user) {
            FactoryUser.postUser(user).then(function (res) {
                    window.localStorage['sessionId'] = res.data[0].id;
            });
            $scope.data.firstname = "";
            $scope.data.lastname = "";
            $scope.data.email = "";
            $scope.data.password = "";
        };
        $scope.login = function (user) {
            FactoryUser.getUserByEmailPassword(user.email, user.password).then(function (res) {
                if(res.data.length !== 0){
                    window.localStorage['sessionId'] = res.data[0].id;
                }else{
                    $scope.alertLoginError = true;
                }
            });
        };
        $scope.$on('$routeChangeStart', function(next, current) {
            var url = current.$$route.templateUrl !== '/angularjs/app/views/login/index.html';
            /* Without authorization */
            if(window.localStorage['interceptor'] && url){
                window.localStorage['auth'] = true;
            }
        });
        $scope.cleanDataStorage = function () {
            window.localStorage.removeItem('auth');
            window.lacalStorage.removeItem('interceptor');
            window.location.reload();
        };
        $scope.auth = typeof window.localStorage['auth'] !== 'undefined';
    });
