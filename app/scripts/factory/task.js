/**
 * Created by luis1 on 03/02/2017.
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
    .factory('FactoryUserTask', function ($http) {
        /* Server Node.js */
        var BASE = 'http://localhost:3000/';
        var obj = {};
        /* Get task user by id*/
        obj.getTasksUserSession = function (id) {
            return $http.get(BASE + 'tasks/' + id);
        };
        
        /* Post task */
        obj.postUserTask = function (task) {
            return $http({
                url: BASE + 'tasks/task',
                data: $.param(task),
                method: 'POST',
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            });
        };
        /* Update[PUT] task */
        obj.UpdateUserTask = function (task) {
            return $http({
                url: BASE + 'tasks/task',
                data: $.param(task),
                method: 'PUT',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            });
        };
        /* Delete task */
        obj.DeleteUserTask = function (id) {
            return $http.delete(BASE + 'tasks/task/' + id);
        };

        /* Finish task */
        obj.finishTask = function (id) {
            return $http.put(BASE + 'tasks/task/finish/' + id);
        };

        /* State notification */
        obj.postNotification = function(stateNotification){
            return $http({
                  url: BASE + 'users/user/check/notification',
                  data: $.param(stateNotification),
                  method: 'POST',
                  headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            });
        }

        /* State notification */
        obj.getNotification = function(id){
            return $http.get(BASE + 'users/user/check/notification/' + id);
        }

        /* State notification */
        obj.sendMail = function(send){
            return $http.get(BASE + 'users/user/mail/' + send.mail + '/' + send.title);
        }

        return obj;
    });
