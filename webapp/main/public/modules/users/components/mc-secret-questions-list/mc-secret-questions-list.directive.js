'use strict';

angular.module('users').directive('mcSecretQuestionsList', [
    'Authentication', 'UserServices',
    function (Authentication, UserServices) {
        return {
            restrict: 'E',
            templateUrl: 'modules/users/components/mc-secret-questions-list/mc-secret-questions-list.layout.html',
            link: function (scope) {
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
                        Authentication.getKey().then(function () {
                            scope.newQuestion.answer = Authentication.encrypt(scope.newQuestion.answer);
                            UserServices.patchRecovery(Authentication.credentials.user._id, scope.newQuestion)
                                .then(successCallback, failureCallback);
                        });
                    }
                    //TODO: else display an error in an span error in layout
                };

                scope.editAnswer = function (question) {
                    question.key = question.question;
                    question.isEdit = question.isEdit ? false : true;
                };
                
                scope.updateQuestion = function (question) {
                    var updateQuestion = {
                        question: question.question,
                        answer: question.answer,
                        key: question.key
                    };

                    UserServices.editQuestionRecovery(Authentication.credentials.user._id, updateQuestion)
                        .then(successCallback, failureCallback);
                };
            }
        };
    }
]);
