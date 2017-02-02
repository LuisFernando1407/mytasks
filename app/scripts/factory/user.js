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
        /* Get all users */
        obj.getAllUser = function() {
            return $http.get(BASE + 'users');
        };
        /* Get user from Session */
        obj.getUserBySessionId = function (id) {
            return $http.get(BASE + 'users/' + id);
        };

        obj.getUserByEmailPassword = function (email, password){
            return $http.get(BASE + 'users/' + email + '/' + password);
        };
        /* Post user */
        obj.postUser = function (user) {
            return $http({
                  url: BASE + 'users',
                  data: $.param(user),
                  method: 'POST',
                  headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            });
        };
        return obj;
    });
