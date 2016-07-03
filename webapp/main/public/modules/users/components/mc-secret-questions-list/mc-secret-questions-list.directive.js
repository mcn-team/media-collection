'use strict';

angular.module('users').directive('mcSecretQuestionsList', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'modules/users/components/mc-secret-questions-list/mc-secret-questions-list.layout.html',
            scope: {
                questions: '='
            },
            link: function (scope, element, attrs) {
                //TODO: Call recovery services (GET for list and PATCH for update/add/remove)
            }
        };
    }
]);
