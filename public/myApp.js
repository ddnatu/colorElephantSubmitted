var app = angular.module('myApp', ["ngRoute"]);

    app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'user.html',
            controller: 'userController'  
        })
        .when('/admin', {
            templateUrl: 'admin.html',
            controller: 'adminController',
            controllerAs:'admCtrl',
            resolve: {
                // I will cause a 1 second delay
                delay: function($q, $timeout) {
                    var delay = $q.defer();
                    $timeout(delay.resolve, 500);
                    return delay.promise;
                }
            }
        })
        .when('/register', {
            templateUrl: 'register.html',
            controller: 'registerController'
        })
        .when('/profiles', {
            templateUrl: 'profile.html',
            controller: 'profileController'
        })
        .when('/profileDetails', {
            templateUrl: 'profileDetails.html',
            controller: 'profileDetailsController'
        })

        // configure html5 to get links working on jsfiddle
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

    });
    app.controller('adminController', function($scope, $routeParams, MyService) {
        $scope.params = $routeParams;
        $scope.adminUser = {};
        $scope.loginFlag = false;
        $scope.registrationFlag = true;

        $scope.adminSwitchMode = function(){
            $scope.loginFlag = !$scope.loginFlag;
            $scope.registrationFlag = !$scope.registrationFlag;
        }

        $scope.adminRegisters = function(){
            // console.log('admin registers', $scope.adminUser);
            var adminRegDefer = MyService.adminRegisters($scope.adminUser);
            adminRegDefer.then(function(data){
                console.log('adminRegistrationSuccess', data);
            },function(error){
                console.log('adminRegistrationError', error);
            });
        }
        $scope.adminLogsIn   = function(){
            console.log('adming Logs In', $scope.adminUser);
            var adminLoginDefer = MyService.adminLogsIn($scope.adminUser);
            adminLoginDefer.then(function(data){
                console.log('adminLoginSuccess', data);
                window.location = "http://localhost:3000/profiles";
            },function(error){
                console.log('adminLoginError', error);
            });
        }
    });
    app.controller('userController', function($scope, $routeParams, MyService) {
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
    app.controller('registerController', function($scope, $routeParams, MyService) {
        $scope.name = 'registerController';
        $scope.params = $routeParams;
        // console.log('$scope.params', $scope.params.time);
        // console.log('register Controller');
        var registerVerifyDefer = MyService.verifyRegistration($scope.params.time);
        registerVerifyDefer.then(function(data){
            console.log('reg verify success', data);
            window.location = "http://localhost:3000/profiles";
        },function(error){
            console.log(error);
        })
    });
    app.controller('profileController', function($scope, $routeParams, MyService) {
        $scope.params = $routeParams;
        // console.log('$scope.params', $scope.params.time);
        // console.log('register Controller');
        console.log('profiles controller');
        var fetchProfilesDefer = MyService.fetchProfiles();
        fetchProfilesDefer.then(function(res){
            console.log('fetch profile success', res);
            $scope.profiles = res.data.rows;
        },function(error){
            console.log(error);
        });

        $scope.getProfileDetails = function(email){
            window.location = "http://localhost:3000/profileDetails?email=" + email;
        }
    });
    app.controller('profileDetailsController', function($scope, $routeParams, MyService) {
        $scope.params = $routeParams;
        $scope.profileDetails = [];
        console.log('$scope.params', $scope.params.email);
        console.log('profile Details Controller');
        var getProfileDataDefer = MyService.getProfileData($scope.params.email);

        getProfileDataDefer.then(function(res){
            console.log('get profile data success', res);
            $scope.profileDetails = res.data.rows;
        },function(error){
            console.log(error);
        });

        /* Trying for Rating */

        $scope.ratings = [{
            current: 3,
            max: 5
        }];

        $scope.submitRating = function(email, rating){
            console.log('controller', email, rating);
            var submitRatingDefer = MyService.submitRating($scope.profileDetails[0].email,$scope.ratings[0].current);
            submitRatingDefer.then(function(data){
                console.log('submit Rating success ', data);
            },function(error){
                console.log('submit Rating error', error);
            })
        }
    });



/* Trying Rating Directive  */
app.directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating" style="float:left">' +
            '<li style="display: inline;margin:0px 5px 0px 5px;cursor:pointer" ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
});