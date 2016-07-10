'use strict';

angular.module('users').controller('AuthenticationController', [
    '$scope', '$http', '$state', 'Authentication', 'UserServices',
    function($scope, $http, $state, Authentication, UserServices) {
        var self = this;
        $scope.authentication = Authentication.isAuthenticated();

        if ($scope.authentication && $scope.authentication.user) {
            $state.go('home');
        }

        function successCallback(response) {
            self.isSigned = !response.data.exists;
            self.center = 'text-center';
            if (response.data.exists && $state.current.name === 'signup') {
                $state.go('signin');
            }
        }

        UserServices.isUser().then(successCallback);

        $scope.signup = function() {
            var credentials = Authentication.encryptCredentials($scope.credentials);
            credentials.recovery = {
                questions: [
                    { question: $scope.secret.question, answer: $scope.secret.answer }
                ]
            };

            UserServices.signup(credentials).then(function (response) {
                Authentication.setCredentials(response.data);
                $state.go('home');
            }, function (errorResponse) {
                $scope.error = errorResponse.data;
            });
        };

        $scope.signin = function() {
            var credentials = Authentication.encryptCredentials($scope.credentials);
            UserServices.login(credentials).then(function (response) {
                Authentication.setCredentials(response.data);
                $state.go('home');
            }, function (errorResponse) {
                console.error(errorResponse.data);
                $scope.error = errorResponse.data;
            });
        };
    }
]);
