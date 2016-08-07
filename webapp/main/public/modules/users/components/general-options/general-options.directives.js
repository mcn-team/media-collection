'use strict';

angular.module('users').directive('mcGeneralOptions', [
    'Authentication', 'UserServices',
    function (Authentication, UserServices) {
        return {
            restrict: 'E',
            templateUrl: 'modules/users/components/general-options/general-options.layout.html',
            link: function (scope) {
                var options = Authentication.user.options;
                scope.feedInterval = options.feedInterval || 10;

                scope.saveOptions = function () {
                    Authentication.user.options.feedInterval = scope.feedInterval;
                    UserServices.saveOptions(Authentication.user._id, Authentication.user.options)
                        .then(function() {}, function (errorResponse) {
                            console.error(errorResponse);
                        });
                };
            }
        };
    }
]);
