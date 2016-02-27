'use strict';

angular.module('users').controller('SettingsController', [
    '$scope', '$http', '$location', 'Authentication', 'UserServices',
    function($scope, $http, $location, Authentication, UserServices) {
        $scope.authentication = Authentication.checkAuth();
        $scope.user = $scope.authentication.user;

        // Check if there are additional accounts
        $scope.hasConnectedAdditionalSocialAccounts = function(provider) {
            for (var i in $scope.user.additionalProvidersData) {
                return true;
            }

            return false;
        };

        // Check if provider is already in use with current user
        $scope.isConnectedSocialAccount = function(provider) {
            return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
        };

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

        // Update a user profile
        $scope.updateUserProfile = function(isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                var user = {
                    displayName: $scope.user.displayName,
                    username: $scope.user.username,
                    email: $scope.user.email
                };
                UserServices.updateUser($scope.user._id, user).then(function(response) {
                    $scope.success = true;
                    Authentication.credentials.user = response;
                }, function(response) {
                    $scope.error = response.data.message;
                });
            } else {
                $scope.submitted = true;
            }
        };

        // Change user password
        $scope.changeUserPassword = function() {
            $scope.success = $scope.error = null;

            $http.post('/users/password', $scope.passwordDetails).success(function(response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.passwordDetails = null;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
    }
]);