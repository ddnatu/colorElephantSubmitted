app.controller('myCtrl', function($scope,MyService) {
    $scope.firstName= "John";
    $scope.lastName= "Doe";

    $scope.automaticCaptchaCode = 7777;
    $scope.enteredCaptchaCode;
    var val = Math.floor(1000 + Math.random() * 9000);
    $scope.automaticCaptchaCode = val;
    $scope.master = {};
   
    $scope.update = function(user) {
        $scope.master = angular.copy(user);
        var userSubFormDefer = MyService.userSubmitsForm($scope.master);
        userSubFormDefer.then(function(data){
            console.log('successSubmitForm', data);
        },function(error){
            console.log('errorSubmitForm', error);
        })
    };
    $scope.reset = function(form) {
        if (form) {
            form.$setPristine();
            form.$setUntouched();
        }
        $scope.user = angular.copy($scope.master);
    };

    $scope.setFiles = function(element) {
        $scope.$apply(function($scope) {
            console.log('files:', element.files);
            // Turn the FileList object into an Array
                $scope.files = []
                for (var i = 0; i < element.files.length; i++) {
                    $scope.files.push(element.files[i]);
                }
            $scope.progressVisible = false;
        });
    };

    $scope.saveFile = function(){
        var uploadDefer = MyService.uploadAttachment($scope.files[0]);
        uploadDefer.then(function(data){
            console.log('data', data);
        }, function(error){
            console.log('file upload error', error);
        });
    }

    $scope.reset();



    $scope.checkIfDuplicate = function(testEmail){
        console.log(testEmail);
        var checkIfDuplicateDefer = MyService.checkIfDuplicate(testEmail);
        checkIfDuplicateDefer.then(function(data){
            console.log('checkIfDuplicateResult', data);
        }, function(error){
            console.log('Duplicate eMail Service error', error);
        });
    }

}); 