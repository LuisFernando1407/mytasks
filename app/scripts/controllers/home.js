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
            if(value.priority === 1 && value.status === 0){
              this.push({color: '#f00',  textColor: '#fff', title: value.title, start: value.remember_me, task: value.task_user, remember: value.remember});
            }else if(value.status === 1){
              this.push({color: '#179b77',  textColor: '#fff', title: value.title, start: value.remember_me, task: value.task_user, remember: value.remember});
            }else{
              this.push({color: 'RGB(66,133,244)',  textColor: '#fff', title: value.title, start: value.remember_me, task: value.task_user, remember: value.remember});
            }
          }, event);
        /* Global */
        $rootScope.events = event;
      });
  })

  .controller('HomeCtrl', function ($scope,  $uibModal, $rootScope, $filter, $location, $compile, FactoryUser, FactoryUserTask, uiCalendarConfig) {
      var BASE = 'http://localhost:3000/';
      /* Open modal */
      $scope.openModal = function (eventObj) {
        console.log(eventObj);
        $rootScope.eventsObj = eventObj;
        var modalInstance = $uibModal.open({
          templateUrl: 'newModalContent.html',
          backdrop: false,
          resolve: {
            event: function () {
              return eventObj;
            }
          }
        });
      }
      /* config object */
      $scope.uiConfig = {
          calendar:{
              eventRender: function( event, element, view ) {
                      element.attr({
                      "tooltip-placement":"top",
                      "uib-tooltip": event.color == '#179b77' ? 'Completed' : event.color == '#f00' ? 'Priority' : 'No priority',
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
              eventClick: function(event, element, view){  
                 $scope.openModal(event);
              },
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
              priority: $('.btn-toggle-priority').find('.btn-primary').val(),
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
                 if(typeof window.localStorage['notify'] == 'undefined'){
                    var sendMail = {mail: $scope.response.email, title: value.title};              
                    FactoryUserTask.sendMail(sendMail).then(function(res){console.log('Send mail...')});
                    window.localStorage['notify'] = 1;
                 }               
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

      /* Tasks finish */
      $scope.taskFinish = function (id) {
        FactoryUserTask.finishTask(id).then(function(response){
          $scope.finishTsk = response.data.message === "(Rows matched: 1  Changed: 1  Warnings: 0";
        });
        setTimeout(function () {
              window.location.reload();
          }, 1500);
      };

      /* TODO: CHECK STATE NOTIFICATIONS */
      FactoryUserTask.getNotification(window.localStorage['sessionId']).then(function(res){

      });

      $scope.mail = true;
      $scope.audio = true;
      $scope.toggle = function (verdict, item) {
        var mail, audio;
        if(item === 'mail' && verdict){
          mail =  0;
          audio = 1;
        }else if(item === 'audio' && verdict){
          audio = 0;
          mail = 1;
        }else if(item === 'mail' && verdict === false){
          mail =  1;
          audio = 1;
        }else if(item === 'audio' && verdict === false){
          audio =  1;
          mail = 1;
        }
        var send = [{email: mail, audio: audio}];
        console.log(send);
      };
});