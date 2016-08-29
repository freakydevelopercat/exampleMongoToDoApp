app.controller('TodoController', ['$scope', 'Todos',"$location", "authenticationSvc", "auth", '$aside', function ($scope, Todos, $location, authenticationSvc, auth, $aside) {
            

            $scope.editing = [];
            $scope.todos = Todos.query();
           $scope.save = function(){
            if(!$scope.newTodo || $scope.newTodo.length < 1) return;
            var todo = new Todos({ name: $scope.newTodo, completed: false, note: "", state: 'U' });

            todo.$save(function(){
              $scope.todos.push(todo);
              $scope.newTodo = ''; // clear textbox
            });
          }

          $scope.update = function(index){
            $scope.todos[index].state= angular.copy($scope.priority.state);
            if ($scope.todos[index].note==undefined){
                $scope.todos[index].note="";
            }

            if ($scope.todos[index].state==undefined){
                $scope.todos[index].state="U";
            }
            var todo = $scope.todos[index];
            Todos.update({id: todo._id}, todo);
            $scope.editing[index] = false;
          }

          $scope.edit = function(index){
            console.log("function edit: Index of element:"+index);
            $scope.editing[index] = angular.copy($scope.todos[index]);
          }

          $scope.cancel = function(index){
            $scope.todos[index] = angular.copy($scope.editing[index]);
            $scope.editing[index] = false;
          }

          $scope.remove = function(index){
            var todo = $scope.todos[index];
            Todos.remove({id: todo._id}, function(){
              $scope.todos.splice(index, 1);
            });
          }
 
          //added from Home controller
        $scope.logout = function () {

            authenticationSvc.logout()
                .then(function (result) {
                    $scope.userInfo = null;
                    $location.path("/login");
                }, function (error) {
                    console.log(error);
                });
        };
        //filter elements
        $scope.activateAll=true;
        $scope.activateCompleted=false;
        $scope.activateUncompleted=false;
        $scope.activateFilterCompleted=function(){
            $scope.activateCompleted=true;
            $scope.activateUncompleted=false;
            $scope.activateAll=false;
        }

        $scope.activateFilterUncompleted=function(){
            $scope.activateCompleted=false;
            $scope.activateUncompleted=true;
            $scope.activateAll=false;
        }

        $scope.activateFilterAll=function(){
            $scope.activateCompleted=false;
            $scope.activateUncompleted=false;
            $scope.activateAll=true;
        }
/*select adress*/

    $scope.priority = [
        {'state': 'H'},
        {'state': 'M'},
        {'state': 'L'},
        {'state': 'U'}
    ];

    $scope.list_state = [
        {'lookupCode': 'H', 'description': 'High'},
        {'lookupCode': 'M', 'description': 'Medium'},
        {'lookupCode': 'L', 'description': 'Low'},
        {'lookupCode': 'U', 'description': 'Undefined'}
    ];

  /*aside begin*/
    $scope.asideState = {
      open: false
    };
    
    $scope.openAside = function(position, backdrop) {
      $scope.asideState = {
        open: true,
        position: position
      };
      
      function postClose() {
        $scope.asideState.open = false;
      }
      
      $aside.open({
        templateUrl: 'templates/aside.html',
        placement: position,
        size: 'sm',
        backdrop: backdrop,
        auth: function ($q, authenticationSvc) {
            var userInfo = authenticationSvc.getUserInfo();
            if (userInfo) {
                return $q.when(userInfo);
            } else {
                return $q.reject({ authenticated: false });
            }
        },
        controller: function($scope, $uibModalInstance, $location, authenticationSvc) {
              $scope.ok = function(e) {
                $uibModalInstance.close();
                e.stopPropagation();
              };
              $scope.cancel = function(e) {
                $uibModalInstance.dismiss();
                e.stopPropagation();
              };


            $scope.logout = function () {

                authenticationSvc.logout()
                    .then(function (result) {
                        $scope.userInfo = null;
                        $location.path("/login");
                    }, function (error) {
                        console.log(error);
                    });
            };

            $scope.navigateTodos=function(){
                 $location.path("/todos");
            }


            $scope.navigateExample=function(){
                 $location.path("/example");
            }


            $scope.navigateHome=function(){
                 $location.path("/");
            }

            $scope.navigateMail=function(){
                 $location.path("/mail");
            }

            $scope.navigateImageUpload=function(){
                 $location.path("/images");
            }
        }
      }).result.then(postClose, postClose);
    }
/*end aside*/

    }])