'use strict';

/**
 * @ngdoc function
 * @name angularjs.controller:MainCtrl
 * @description
 * # MainCtrl, register, login
 * Controller of the myApp
 */
angular.module('myApp')
    .controller('MainCtrl', function ($scope, $location, FactoryUser, FactoryUserTask) {
        /* Post => Return Id*/
        $scope.registerUser = function (user) {
            FactoryUser.postUser(user).then(function (res) {
                    window.localStorage['sessionId'] = res.data[0].id;
                    $location.url('/home');
            });
            $scope.userRegister.firstname = "";
            $scope.userRegister.lastname = "";
            $scope.userRegister.email = "";
            $scope.userRegister.password = "";
        };
        $scope.login = function (user) {
            FactoryUser.getUserByEmailPassword(user.email, user.password).then(function (res) {
                if(res.data.length !== 0){
                    window.localStorage['sessionId'] = res.data[0].id;
                    var send = {id_user: window.localStorage['sessionId'], email: 1, audio: 1};
                    FactoryUserTask.postNotification(send).then(function(res){});
                    $location.url('/home');
                }else{
                    $scope.alertLoginError = true;
                }
            });
        };
        $scope.$on('$routeChangeStart', function(next, current) {
            var url = current.$$route.templateUrl !== '/mytasks/app/views/login/index.html' &&  current.$$route.templateUrl !== '/mytasks/app/views/login/forgot-password.html';
            var logoutEvent = typeof current.$$route.templateUrl === 'undefined';
            /* Without authorization */
            if(typeof window.localStorage['sessionId'] === 'undefined' && url){
                window.localStorage['auth'] = !logoutEvent;
            }
        });
        $scope.cleanDataStorage = function () {
            window.localStorage.removeItem('auth');
            window.location.reload();
        };
        $scope.auth = typeof window.localStorage['auth'] !== 'undefined' && window.localStorage['auth'];
    });
