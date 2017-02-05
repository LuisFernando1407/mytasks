/**
 * Created by luis1 on 04/02/2017.
 */
'use strict';

/**
 * @ngdoc function
 * @name angularjs.controller:MainCtrl
 * @description
 * # MainCtrl, register, login
 * Controller of the myApp
 */
angular.module('myApp')
    .controller('ForgotPasswordCtrl', function ($scope, FactoryUser, $location) {
        /* Forgot Password => Return True or False to email*/
        $scope.forgotPassword = function (userForgotPassword) {
            if(typeof userForgotPassword.newPassword === 'undefined'){
                FactoryUser.getUserByEmailPassword(userForgotPassword.email, 'null').then(function (res) {
                    /* If its 0 - false email*/
                    var data = res.data;
                    $scope.alertUserForgotPasswordError = data.length === 0;
                    $scope.response = data.length;
                    if(data.length){
                        window.localStorage['forgetPasswordSessionId'] = data[0].id;
                    }else{
                        setTimeout(function () {
                            window.location.reload();
                        }, 1500);
                    }
                });
            }else{
                userForgotPassword.id = window.localStorage['forgetPasswordSessionId'];
                FactoryUser.updateForgotPassword(userForgotPassword).then(function (res) {
                    $scope.alertUserForgotPasswordSuccess = res.data.message === "(Rows matched: 1  Changed: 1  Warnings: 0";
                    setTimeout(function () {
                        window.localStorage.removeItem('forgetPasswordSessionId');
                        window.location.reload();
                        $location.path('/');
                    }, 1500);
                });
            }
        };
    });