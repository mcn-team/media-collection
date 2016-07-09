'use strict';

angular.module('users').directive('mcEditProfile', [
    'Authentication', 'UserServices',
    function (Authentication, UserServices) {
        return {
            restrict: 'E',
            templateUrl: 'modules/users/components/edit-profile/edit-profile.layout.html',
            link: function (scope) {
                scope.user = {};

                scope.updateUserProfile = function (isValid) {
                    if (isValid) {
                        scope.success = scope.error = null;
                        var user = {
                            displayName: scope.user.displayName,
                            username: scope.user.username,
                            email: scope.user.email
                        };
                        UserServices.updateUser(Authentication.credentials.user._id, user).then(function (response) {
                            scope.success = true;
                            Authentication.credentials.user = response;
                        }, function (response) {
                            scope.error = response.data.message;
                        });
                    } else {
                        scope.submitted = true;
                    }
                };
            }
        };
    }
]);
