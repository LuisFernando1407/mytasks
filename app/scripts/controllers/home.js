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
      /* Date now */
      function dateNow() {
          var now = new Date,
              month = now.getMonth() + 1,
              month_full = month < 10 ? '0' + month : month,
              day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate(),
              year = now.getFullYear();

          return day + "/" + month_full + "/" + year;
      }

      /* Convert MySQL format */
      function convertDateToMySQL(date) {
          var dd = date.substring(0,2);
          var mm = date.substring(3,5);
          var yyyy = date.substring(6,10);

          return yyyy + '-' + mm + '-' + dd;
      }

      FactoryUser.getUserBySessionId(window.localStorage['sessionId']).then(function (res) {
          $scope.response = res.data[0];
      });

      $scope.logout = function () {
          window.localStorage.removeItem('sessionId');
          window.localStorage.removeItem('interceptor');
          window.localStorage.removeItem('auth');
          window.localStorage.removeItem('alertLoginError');
          window.location.reload();
          $location.url('/');
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
          }, 1500);
      };

      FactoryUserTask.getTasksUserSession(window.localStorage['sessionId']).then(function (res) {
          var response = res.data;
          var tasksFavorite = [];
          var tasksRemember = [];

         /* Return favorite tasks and remeber notification */
         angular.forEach(response,function(value, key){
             if(value.favorite === 1){
                 this.push(value);
             }
             if(value.remember === dateNow()){
                 tasksRemember.push({title: value.title});
             }
          }, tasksFavorite);
         $scope.tasksRememberNotification = tasksRemember;
         $scope.badge = response.length;
         $scope.tasks = response;
         $scope.tasksFavorite = tasksFavorite;
      });

      $scope.putTask = function (teskUp) {
         teskUp.remember = convertDateToMySQL(teskUp.remember);
          FactoryUserTask.UpdateUserTask(teskUp).then(function (res) {
              $scope.edit = res.data.message === "(Rows matched: 1  Changed: 1  Warnings: 0";
          });
          setTimeout(function () {
              window.location.reload();
          }, 1500);
      };

      $scope.deleteTask = function (idTask) {
            FactoryUserTask.DeleteUserTask(idTask).then(function (res) {
                $scope.delete = res.data.message === "";
            });
          setTimeout(function () {
              window.location.reload();
          }, 1500);
      };
  });
