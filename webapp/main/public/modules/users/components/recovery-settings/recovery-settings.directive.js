'use strict';

angular.module('users').directive('mcRecovery', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'modules/users/components/recovery-settings/recovery-settings.layout.html',
            link: function (scope) {
                scope.subMenu = 'questions';
            }
        };
    }
]);
