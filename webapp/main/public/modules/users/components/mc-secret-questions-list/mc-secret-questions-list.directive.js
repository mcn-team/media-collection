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
                scope.newQuestion = {};
                var successCallback = function (response) {
                    scope.recoveryList = response.data.recovery;
                    scope.newQuestion = {};
                };

                var failureCallback = function (errorResponse) {
                    console.error(errorResponse);
                };

                UserServices.getRecoveryList(Authentication.credentials.user._id)
                    .then(successCallback, failureCallback);
                
                scope.deleteQuestion = function (question) {
                    UserServices.patchRecovery(Authentication.credentials.user._id, { question: question.question })
                        .then(successCallback, failureCallback);
                };
                
                scope.addQuestion = function () {
                    if (scope.newQuestion && scope.newQuestion.question && scope.newQuestion.answer) {
                        UserServices.patchRecovery(Authentication.credentials.user._id, scope.newQuestion)
                            .then(successCallback, failureCallback);
                    }
                    //TODO: else display an error in an span error in layout
                };
                //TODO: Update service missing
            }
        };
    }
]);
