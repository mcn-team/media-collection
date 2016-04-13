'use strict';

angular.module('options').directive('mcUsers', [
    'UserServices',
    function (UserServices) {
        return {
            restrict: 'E',
            templateUrl: 'modules/options/components/users/view.html',
            link: function (scope) {
                var successCallback = function (response) {
                    scope.usersList = response.data;
                };

                var failureCallback = function (errorResponse) {
                    console.error(errorResponse);
                };

                UserServices.getUsers().then(successCallback, failureCallback);
            }
        };
    }
]);
