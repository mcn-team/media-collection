'use strict';

angular.module('users').controller('SettingsController', [
    '$scope', '$http', '$location', 'Authentication',
    function($scope, $http, $location, Authentication) {
        $scope.authentication = Authentication.checkAuth();
        $scope.user = $scope.authentication.user;
        $scope.tabMenu = $location.search().settings || 'account';

        // Remove a user social account
        $scope.removeUserSocialAccount = function(provider) {
            $scope.success = $scope.error = null;

            $http.delete('/users/accounts', {
                params: {
                    provider: provider
                }
            }).success(function(response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.user = Authentication.setCredentials(response);
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        // Change user password
        $scope.changeUserPassword = function() {
            $scope.success = $scope.error = null;

            $http.post('/users/password', $scope.passwordDetails).success(function() {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.passwordDetails = null;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.changeMenu = function () {
            $location.search('settings', $scope.tabMenu);
        };
    }
]);
