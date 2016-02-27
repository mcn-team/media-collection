'use strict';

angular.module('mediacollection').directive('mcLoader', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'modules/common/mc-loader-directive/mc-loader.html'
        };
    }
]);
