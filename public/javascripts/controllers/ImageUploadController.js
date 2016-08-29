//inject ngFileUpload and ngImgCrop directives and services.
app.controller('ImageUploadController', ['$scope', 'Upload', '$timeout', 'Images',"$location", "authenticationSvc", "auth", '$aside','$window', function ($scope, Upload, $timeout, Images, $location, authenticationSvc, auth, $aside, $window ) {

          $scope.submit = function(){ //function to call on form submit
            console.log("scope.file"+$scope.file);
              if ($scope.upload_form.file.$valid && $scope.file) { //check if from is valid
                  $scope.upload($scope.file); //call upload function
              }
          }
          
          $scope.fileName="";

          $scope.upload = function (file) {
              Upload.upload({
                  url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
                  data:{file:file} //pass file as data, should be user ng-model
              }).then(function (resp) { //upload function returns a promise
                  if(resp.data.error_code === 0){ //validate success
                    $scope.fileName=resp.config.data.file.name;
                      $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                  } else {
                      $window.alert('an error occured');
                  }
              }, function (resp) { //catch error
                  console.log('Error status: ' + resp.status);
                  $window.alert('Error status: ' + resp.status);
              }, function (evt) { 
                  console.log(evt);
                  var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                  console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                  $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
              });
          };



          $scope.editing = [];
            $scope.imageArray= Images.query();
           $scope.save = function(){
            if(!$scope.newImage || $scope.newImagelength < 1) return;
            var image = new Images({ name: $scope.newImage, note: "", img_src:"/thumb.jpg" });

            image.$save(function(){
              $scope.imageArray.push(image);
              $scope.newImage = ''; // clear textbox
            });
          }




          //should edit model for image url
          $scope.update = function(index){
            var image = $scope.imageArray[index];
            image.img_src="uploads/"+$scope.fileName;
            Images.update({id: image._id}, image);
            $scope.editing[index] = false;

          }

          $scope.edit = function(index){
            console.log("function edit: Index of element:"+index);
            $scope.editing[index] = angular.copy($scope.imageArray[index]);

          }

          $scope.cancel = function(index){
            $scope.imageArray[index] = angular.copy($scope.editing[index]);
            $scope.editing[index] = false;
          }

          $scope.remove = function(index){
            var image = $scope.imageArray[index];
            Images.remove({id: image._id}, function(){
              $scope.imageArray.splice(index, 1);
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

}]);