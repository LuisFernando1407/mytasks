/**
 * Created by luis1 on 02/02/2017.
 */
'use strict';

/**
 * @ngdoc function
 * @name angularjs.factory:InterceptorAuth
 * @description
 * # Intercpetor url auth
 * Factory of the myApp
 */
angular.module('myApp')
    .factory('InterceptorAuth', function ($location) {
        return {
            request: function (config) {
                var url = location.href === 'http://localhost/mytasks/app/#!/forgot';
                if(typeof window.localStorage['sessionId'] === 'undefined'){
                    if(url){
                        $location.url('/forgot')
                    }else{
                        $location.url('/');
                    }
                }
                return config;
            }
        };
    });