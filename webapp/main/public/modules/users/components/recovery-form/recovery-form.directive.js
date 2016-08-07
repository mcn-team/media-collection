'use strict';

angular.module('users').directive('mcRecoveryForm', [
    '$state', 'UserServices', 'Authentication',
    function ($state, UserServices, Authentication) {
        return {
            restrict: 'E',
            templateUrl: 'modules/users/components/recovery-form/recovery-form.layout.html',
            link: function (scope) {
                scope.passwordForgotten = function () {
                    var success = function (response) {
                        scope.data = response.data;
                        scope.isRecovery = true;
                        scope.selectedRecovery = scope.data.recovery.questions[0];
                    };

                    var failure = function (errorResponse) {
                        console.error(errorResponse);
                    };

                    if (scope.credentials.username) {
                        UserServices.getUserRecovery(scope.credentials.username).then(success, failure);
                    }
                };

                scope.recoveryPassword = function () {
                    Authentication.getKey().then(function () {
                        var payload = {
                            question: scope.selectedRecovery.question,
                            answer: Authentication.encrypt(scope.AuthCtrl.recoveryAnswer)
                        };

                        var successCallback = function (response) {
                            scope.isReset = true;
                            scope.isRecovery = false;
                            scope.resetData = response.data;
                        };

                        var failureCallback = function (errorResponse) {
                            console.error(errorResponse);
                        };

                        UserServices.getRecoveryToken(scope.data._id, payload).then(successCallback, failureCallback);
                    });
                };
                
                scope.resetPassword = function () {
                    var successCallback = function (response) {
                        Authentication.setCredentials(response.data);
                        $state.go('home');
                    };

                    UserServices.updateUserPassword(scope.data._id, { password: scope.AuthCtrl.newPassword }, scope.resetData.token).then(successCallback);
                };
            }
        };
    }
]);
