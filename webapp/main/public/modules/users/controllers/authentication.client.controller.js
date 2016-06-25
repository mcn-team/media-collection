'use strict';

angular.module('users').controller('AuthenticationController', [
    '$scope', '$http', '$state', 'Authentication', 'lodash', 'UserServices',
    function($scope, $http, $state, Authentication, _, UserServices) {
        var self = this;
        $scope.authentication = Authentication.isAuthenticated();

        if ($scope.authentication && $scope.authentication.user) {
            $state.go('home');
        }

        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(Authentication.getPublicKey());

        function successCallback(response) {
            self.isSigned = !response.data.exists;
            if (response.data.exists && $state.current.name === 'signup') {
                $state.go('signin');
            }
        }

        UserServices.isUser().then(successCallback);

        $scope.signup = function() {
            UserServices.signup($scope.credentials).then(function (response) {
                Authentication.setCredentials(response.data);
                $state.go('home');
            }, function (errorResponse) {
                $scope.error = errorResponse.data;
            });
        };

        $scope.signin = function() {
            var credentials = _.assign({}, $scope.credentials);
            credentials.password = encrypt.encrypt(credentials.password);
            UserServices.login(credentials).then(function (response) {
                Authentication.setCredentials(response.data);
                $state.go('home');
            }, function (errorResponse) {
                $scope.error = errorResponse.data;
            });
        };
    }
]);
