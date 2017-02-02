/**
 * Created by luis1 on 02/02/2017.
 */
'use strict';

/**
 * @ngdoc function
 * @name angularjs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the myApp
 */
angular.module('myApp')
/* Anotação
 Direcitve
 => <my-card> === 'myCard'
 => <mycard> === 'mycard'
 => <my-card-component> === 'myCardComponent'
 */
    .controller('CheckNavCtrl', function ($scope) {
        $scope.$on('$routeChangeStart', function(next, current) {
            $scope.nav = current.$$route.templateUrl !== '/angularjs/app/views/login/index.html';
        });
    });
