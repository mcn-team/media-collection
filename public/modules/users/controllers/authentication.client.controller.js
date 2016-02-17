'use strict';

angular.module('users').controller('AuthenticationController', [
    '$scope', '$http', '$state',
    'Authentication', 'UserServices',
    function($scope, $http, $state, Authentication, UserServices) {
        $scope.authentication = Authentication.isAuthenticated();

        if ($scope.authentication && $scope.authentication.user) {
            $state.go('home');
        }

        $scope.signup = function() {
            UserServices.signup($scope.credentials).then(function (response) {
                Authentication.setCredentials(response.data);
                $state.go('home');
            }, function (response) {
                $scope.error = response.message;
            });
        };

        $scope.signin = function() {
            UserServices.login($scope.credentials).then(function (response) {
                Authentication.setCredentials(response.data);
                $state.go('home');
            }, function (response) {
                $scope.error = response.message;
            });
        };
    }
]);
