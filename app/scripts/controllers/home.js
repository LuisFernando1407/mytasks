'use strict';

/**
 * @ngdoc function
 * @name yoangularApp.controller:HomeCtrl
 * @description
 * # HomeCtrl before login
 * Controller of the myApp
 */
angular.module('myApp')
  .controller('HomeCtrl', function ($scope,$filter, $location, FactoryUser, FactoryUserTask) {
      function convertDateToMySQL(date) {
          /* Convert MySQL format */
          var dd = date.substring(0,2);
          var mm = date.substring(3,5);
          var yyyy = date.substring(6,10);

          return yyyy + '-' + mm + '-' + dd;
      }

      FactoryUser.getUserBySessionId(window.localStorage['sessionId']).then(function (res) {
          $scope.response = res.data[0];
      });
      /* TODO ERRO AO VOLTAR PARA LOGIN */
      $scope.logout = function () {
          window.localStorage.removeItem('sessionId');
          window.localStorage.removeItem('interceptor');
          window.localStorage.removeItem('auth');
          window.localStorage.removeItem('alertLoginError');
          $location.path('/');
      };

      $scope.registerTask = function (task) {
          var date = convertDateToMySQL(task.remember);
          var data = {
              user_id:  window.localStorage['sessionId'],
              title: task.title,
              task: task.task,
              remember: date,
              favorite:  $('.btn-toggle').find('.btn-primary').val()
          };

          FactoryUserTask.postUserTask(data).then(function (res) {
              $scope.registration = res.data.message === "";
          });
          $scope.task.title = "";
          $scope.task.task = "";
          $scope.task.remember = "";
          setTimeout(function () {
              window.location.reload();
          }, 2000);
      };
      FactoryUserTask.getTasksUserSession(window.localStorage['sessionId']).then(function (res) {
         $scope.badge = res.data.length;
         $scope.tasks = res.data;
      });

      $scope.putTask = function (teskUp) {
         teskUp.remember = convertDateToMySQL(teskUp.remember);
          FactoryUserTask.UpdateUserTask(teskUp).then(function (res) {
              $scope.edit = res.data.message === "(Rows matched: 1  Changed: 1  Warnings: 0";
          });
      };
      $scope.deleteTask = function (idTask) {
            FactoryUserTask.DeleteUserTask(idTask).then(function (res) {
                $scope.delete = res.data.message === "";
            });
          setTimeout(function () {
              window.location.reload();
          }, 2000);
      };
  });
