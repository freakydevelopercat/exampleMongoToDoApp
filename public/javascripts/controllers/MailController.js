
app.controller("MailController", ["$scope", "$location", "authenticationSvc", "auth",'$aside', "$http",function ($scope, $location, authenticationSvc, auth, $aside,$http) {
    var data={
    from: 'App To Do<freakydevelopercat@gmail.com>', // sender address
    to: 'ninafath@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'This is a first object', // plaintext body
    html: '<b>sooo bored</b>' // html body
    };


    $scope.sendMail=function(){
        data={
          from: $scope.from,
          to: $scope.to,
          subject:$scope.subject,
          text: 'received on server',
          html:$scope.html
        };

        $http.post('/mail/send',data).
          then(function(req, res){
            console.log('Data send from frontend')
          });
    }

    /*aside directive control*/
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
}]);