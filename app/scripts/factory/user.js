/**
 * Created by luis1 on 31/01/2017.
 */
'use strict';

/**
 * @ngdoc function
 * @name angularjs.factory:FactoryUser
 * @description
 * # FactoryUser
 * Factory of the myApp
 */
angular.module('myApp')
    .factory('FactoryUser', function ($http) {
        /* Server Node.js */
        var BASE = 'http://localhost:3000/';
        var obj = {};
        /* Get user from Session */
        obj.getUserBySessionId = function (id) {
            return $http.get(BASE + 'users/' + id);
        };
        /* Get user by email and password */
        obj.getUserByEmailPassword = function (email, password){
            return $http.get(BASE + 'users/' + email + '/' + password);
        };
        /* Post user */
        obj.postUser = function (user) {
            return $http({
                  url: BASE + 'users/user',
                  data: $.param(user),
                  method: 'POST',
                  headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            });
        };
        /* Forgot password PUT */
        obj.updateForgotPassword = function (user) {
            return $http({
                url: BASE + 'users/user',
                data: $.param(user),
                method: 'PUT',
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            });
        };
        return obj;
    });
