'use strict';

angular.module('options').directive('mcUsers', [
    '$http',
    function ($http) {
        return {
            restrict: 'E',
            templateUrl: 'modules/options/components/users/view.html',
            link: function () {}
        };
    }
]);
