'use strict';

angular.module('users').controller('AuthenticationController', [
    '$scope', '$http', '$state', 'Authentication', 'UserServices', 'LanguageServices',
    function($scope, $http, $state, Authentication, UserServices, LanguageServices) {
        var self = this;
        $scope.authentication = Authentication.isAuthenticated();

        self.fields = LanguageServices.lang && LanguageServices.lang['en'].authentication;

        if ($scope.authentication && $scope.authentication.user) {
            $state.go('home');
        }

        $scope.signup = function() {
            UserServices.signup($scope.credentials).then(function (response) {
                Authentication.setCredentials(response.data);
                $state.go('home');
            }, function (errorResponse) {
                $scope.error = errorResponse.data;
            });
        };

        $scope.signin = function() {
            UserServices.login($scope.credentials).then(function (response) {
                Authentication.setCredentials(response.data);
                $state.go('home');
            }, function (errorResponse) {
                $scope.error = errorResponse.data;
            });
        };
    }
]);
