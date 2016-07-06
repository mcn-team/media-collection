'use strict';

angular.module('users').directive('mcSecretQuestionsList', [
    'Authentication', 'UserServices',
    function (Authentication, UserServices) {
        return {
            restrict: 'E',
            templateUrl: 'modules/users/components/mc-secret-questions-list/mc-secret-questions-list.layout.html',
            scope: {
                questions: '='
            },
            link: function (scope, element, attrs) {
                //TODO: Call recovery services (GET for list and PATCH for update/add/remove)
                var successCallback = function (response) {
                    scope.recoveryList = response.data.recovery;
                };

                var failureCallback = function (errorResponse) {
                    console.error(errorResponse);
                };

                UserServices.getRecoveryList(Authentication.credentials.user._id)
                    .then(successCallback, failureCallback);
            }
        };
    }
]);
