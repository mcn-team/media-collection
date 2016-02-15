'use strict';

angular.module('users').controller('AuthenticationController', [
    '$scope', '$http', '$location',
    'Authentication', 'UserServices',
    function($scope, $http, $location, Authentication, UserServices) {
        $scope.authentication = Authentication.isAuthenticated();

        if ($scope.authentication && $scope.authentication.user) {
            $location.path('/');
        }

        $scope.signup = function() {
            UserServices.signup($scope.credentials).then(function (response) {
                Authentication.setCredentials(response.data);
                $location.path('/');
            }, function (response) {
                $scope.error = response.message;
            });
        };

        $scope.signin = function() {
            UserServices.login($scope.credentials).then(function (response) {
                Authentication.setCredentials(response.data);
                $location.path('/');
            }, function (response) {
                $scope.error = response.message;
            });
        };
    }
]);
