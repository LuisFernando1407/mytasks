'use strict';

/**
 * @ngdoc function
 * @name yoangularApp.controller:HomeCtrl
 * @description
 * # HomeCtrl before login
 * Controller of the myApp
 */
angular.module('myApp')
  
  /* Persiste in tasks */
  .run(function($rootScope, FactoryUserTask) {
    FactoryUserTask.getTasksUserSession(window.localStorage['sessionId']).then(function (res) {
        var response = res.data;
        var event = [];
         
         /* Return title tasks and remember notification */
         angular.forEach(response,function(value, key){
            this.push({title: value.title, start: value.remember_me});
          }, event);
        /* Global */
        $rootScope.events = event;
      });
  })
  .controller('HomeCtrl', function ($scope, $rootScope, $filter, $location, $compile, FactoryUser, FactoryUserTask, uiCalendarConfig) {
      var BASE = 'http://localhost:3000/';
      /* config object */
      $scope.uiConfig = {
          calendar:{
              eventRender: function( event, element, view ) {
                  element.attr({
                      "tooltip-placement":"top",
                      "uib-tooltip": event.title,
                      "tooltip-append-to-body": true
                  });
                  $compile(element)($scope);
              },
              height: 500,
              editable: false,
              defaultView:'month',
              header:{
                  left: 'title',
                  center: '',
                  right: 'today month agendaWeek prev,next'
              },
              eventClick: $scope.alertOnEventClick,
              eventDrop: $scope.alertOnDrop,
              eventResize: $scope.alertOnResize,
          }
      };
     
      var audio = new Audio('../app/audio/message.mp3');
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
          window.localStorage.removeItem('closeAlert');
          window.location.reload();
          $location.url('/');
      };

      $scope.registerTask = function (task) {
          window.localStorage.removeItem('closeAlert');
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
       /* TODO: Error of transition tabs - Date Fades away*/
       FactoryUserTask.getTasksUserSession(window.localStorage['sessionId']).then(function (res) {
          var response = res.data;
          var tasksFavorite = [];
          var tasksRemember = [];
          var event = [];
         
         /* Return favorite tasks and remember notification */
         angular.forEach(response,function(value, key){
             if(value.favorite === 1){
                 this.push(value);
             }
             if(value.remember === dateNow()){
                 tasksRemember.push({title: value.title , audio: audio});
             }
          }, tasksFavorite);

         $scope.audioNotification = audio;
         $scope.tasksRememberNotification = tasksRemember;
         $scope.badge = response.length;
         $scope.tasks = response;
         $scope.tasksFavorite = tasksFavorite;
         $scope.closeAlert =  typeof window.localStorage['closeAlert'] === 'undefined' ? true : window.localStorage['closeAlert'] ;
      });
      /* Add tasks to calendar */ 
      $scope.eventSources = [$rootScope.events];
      
      /* Close notification */
      $scope.closePlayer = true;
      $scope.stop = function () {
            audio.pause();
            $scope.closePlayer = false;
            window.localStorage['closeAlert'] = false;
            window.location.reload();
      };

      $scope.putTask = function (teskUp) {
          window.localStorage.removeItem('closeAlert');
          teskUp.remember = convertDateToMySQL(teskUp.remember);
          FactoryUserTask.UpdateUserTask(teskUp).then(function (res) {
              $scope.edit = res.data.message === "(Rows matched: 1  Changed: 1  Warnings: 0";
          });
          setTimeout(function () {
              window.location.reload();
          }, 1500);
      };

      $scope.deleteTask = function (idTask) {
          window.localStorage.removeItem('closeAlert');
          FactoryUserTask.DeleteUserTask(idTask).then(function (res) {
              $scope.delete = res.data.message === "";
          });
          setTimeout(function () {
              window.location.reload();
          }, 1500);
      };
});