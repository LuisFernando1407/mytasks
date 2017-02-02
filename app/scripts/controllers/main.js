'use strict';

/**
 * @ngdoc function
 * @name angularjs.controller:MainCtrl
 * @description
 * # MainCtrl, register, login
 * Controller of the myApp
 */
angular.module('myApp')
    /* Anotação
        Direcitve
         => <my-card> === 'myCard'
         => <mycard> === 'mycard'
         => <my-card-component> === 'myCardComponent'
     */
    .controller('MainCtrl', function ($scope, FactoryUser) {
        var url = this;
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
                window.localStorage['sessionId'] = res.data[0].id;
                console.log(res.data[0].id)
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
            localStorage.removeItem('auth');
        };
        $scope.auth = typeof localStorage['auth'] !== 'undefined';

    });
