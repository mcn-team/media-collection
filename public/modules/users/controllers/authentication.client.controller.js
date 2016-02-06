'use strict';

angular.module('users').controller('AuthenticationController', [
    '$scope', '$http', '$location', 'Authentication', 'UserServices',
    function($scope, $http, $location, Authentication, UserServices) {
        $scope.authentication = Authentication;

        if ($scope.authentication.user) {
            $location.path('/');
        }

        $scope.signup = function() {
            UserServices.signup($scope.credentials).then(function (response) {
                $scope.authentication.user = response.data.user;
                $location.path('/');
            }, function (response) {
                $scope.error = response.message;
            });
        };

        $scope.signin = function() {
            UserServices.login($scope.credentials).then(function (response) {
                $scope.authentication.user = response.data.user;
                $location.path('/');
            }, function (response) {
                $scope.error = response.message;
            });
        };
    }
]);
