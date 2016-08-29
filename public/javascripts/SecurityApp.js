﻿var app = angular.module("securityApp", ["ngRoute",'ngResource','ui.bootstrap', 'ngAside','ngFileUpload', 'ngImgCrop', 'ui.calendar']); //, 'imageupload'
'use strict'

app.config(["$routeProvider","$locationProvider",function ($routeProvider, $locationProvider) {
    $routeProvider.when("/", {
        templateUrl: "templates/home.html",
        controller: "HomeController",
        resolve: {
            auth: function ($q, authenticationSvc) {
                var userInfo = authenticationSvc.getUserInfo();
                if (userInfo) {
                    return $q.when(userInfo);
                } else {
                    return $q.reject({ authenticated: false });
                }
            }
        }
    })
/*    .when("/example", {
        templateUrl: "templates/example.html",
        controller: "HomeController",
        resolve: {
            auth: function ($q, authenticationSvc) {
                var userInfo = authenticationSvc.getUserInfo();
                if (userInfo) {
                    return $q.when(userInfo);
                } else {
                    return $q.reject({ authenticated: false });
                }
            }
        }
    })
*/
    .when("/example", {
        templateUrl: "templates/example.html",
        controller: "CalendarController",
        resolve: {
            auth: function ($q, authenticationSvc) {
                var userInfo = authenticationSvc.getUserInfo();
                if (userInfo) {
                    return $q.when(userInfo);
                } else {
                    return $q.reject({ authenticated: false });
                }
            }
        }
    })
    .when("/images", {
        templateUrl: "templates/imageUpload.html",
        controller: "ImageUploadController",
        resolve: {
            auth: function ($q, authenticationSvc) {
                var userInfo = authenticationSvc.getUserInfo();
                if (userInfo) {
                    return $q.when(userInfo);
                } else {
                    return $q.reject({ authenticated: false });
                }
            }
        }
    })

    .when("/login", {
        templateUrl: "templates/login.html",
        controller: "LoginController"
    })
    .when('/todos', {
            templateUrl: 'templates/todos.html',
            controller: 'TodoController',
            resolve: {
            auth: function ($q, authenticationSvc) {
                var userInfo = authenticationSvc.getUserInfo();
                if (userInfo) {
                    return $q.when(userInfo);
                } else {
                    return $q.reject({ authenticated: false });
                }
            }
        }
    })
    .when('/mail', {
            templateUrl: 'templates/sendMail.html',
            controller: 'MailController',
            resolve: {
            auth: function ($q, authenticationSvc) {
                var userInfo = authenticationSvc.getUserInfo();
                if (userInfo) {
                    return $q.when(userInfo);
                } else {
                    return $q.reject({ authenticated: false });
                }
            }
        }
    })
    ;
}]);

app.run(["$rootScope", "$location", function ($rootScope, $location) {

    $rootScope.$on("$routeChangeSuccess", function (userInfo) {
        console.log(userInfo);
    });

    $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {
        if (eventObj.authenticated === false) {
            $location.path("/login");
        }
    });
}]);

//filter for completed
app.filter('completed', function () {
  return function (items, activateCompleted, activateUncompleted, activateAll) {
    var filtered = [];
    var item;
      for (var i = 0; i < items.length; i++) {
          item = items[i];
          if (activateAll==false){
            if((item.completed==true) && (activateCompleted==true)){ //when we want to activate Completed
              filtered.push(item);
            }else if((item.completed==false) && (activateUncompleted==true)){
              filtered.push(item);
            }
          }else{
            filtered.push(item);
          }
        }  
        console.log("filtered: "+JSON.stringify(filtered));
        return filtered;
  };
});


app.factory('Todos', ['$resource', function($resource){
          return $resource('/todos/:id', null, {
            'update': { method:'PUT' }
          });
        }]);

app.factory('Images', ['$resource', function($resource){
          return $resource('/images/:id', null, {
            'update': { method:'PUT' }
          });
        }]);