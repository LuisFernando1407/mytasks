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
      };

      $scope.generateReport = function(report){
        var data = {id: window.localStorage['sessionId'], date_i:  convertDateToMySQL(report.date_i), date_f:  convertDateToMySQL(report.date_f)};
        FactoryUserTask.gReport(data).then(function(response){
          var datas = response.data;
          if(datas.length > 0){
            $('#report').modal('hide')
            var $dialog = $(
            '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
            '<div class="modal-dialog modal-m">' +
            '<div class="modal-content">' +
                '<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
                '<div class="modal-body">' +
                    '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%">100%</div></div>' +
                '</div>' +
            '</div></div></div>');
          var message = "Generate report";
          var options = {dialogSize: 'sm', progressType: 'primary'};
          if (typeof options === 'undefined') {
              options = {};
          }
          if (typeof message === 'undefined') {
              message = 'Loading';
          }
          var settings = $.extend({
              dialogSize: 'm',
              progressType: '',
              onHide: null /* This callback runs after the dialog was hidden */
          }, options);

          /* Configuring dialog */
          $dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
          $dialog.find('.progress-bar').attr('class', 'progress-bar');
          if (settings.progressType) {
              $dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
          }
          $dialog.find('h3').text(message);
          /* Adding callbacks */
          if (typeof settings.onHide === 'function') {
              $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                  settings.onHide.call($dialog);
              });
          }
          $dialog.modal();
          var logo = 'data:image/png;base64,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';
          var columns = ["Title", "Task", "Date", "Status"];
          var i = 0;
          var rows = [];
          var count = 0;
          for(i; i < datas.length; i++){
            rows[i] = [
              datas[i].title, 
              datas[i].task_user, 
              datas[i].remember,
              datas[i].status == 1 ? 'Completed' : datas[i].priority == 1 ? 'Priority' : 'No priority'
            ];
            count += i == 0 ? 1 : i;
          }
          var doc = new jsPDF('l','pt');
          doc.autoTable(columns, rows, {
            margin: {top: 70},
            addPageContent: function(data) {
                doc.setFontSize(14);
                doc.text("Report for the period: " + $scope.report.date_i + ' - ' + $scope.report.date_f, 125, 37);
                doc.setFontSize(12);
                doc.setFontType('italic');
                doc.text("Total of tasks: " + count, 712, 60);
                doc.addImage(logo,'PNG',40, 10, 55, 45);
              }
          });
          doc.save('Report-System_My_Tasks.pdf');
          /* Closes dialog */
          $dialog.modal('hide');
          $scope.report.date_i = "";
          $scope.report.date_f = "";
          }else{
            $scope.rsreport = true; 
            $scope.report.date_i = "";
            $scope.report.date_f = "";
            $('#report').modal('hide')
          }
        }); 
      };
});