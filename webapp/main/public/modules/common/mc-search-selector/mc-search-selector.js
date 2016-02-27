'use strict';

angular.module('mediacollection').directive('mcSearchSelector', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'modules/common/mc-search-selector/mc-search-selector.html',
            scope: {
                element: '=mcElement',
                selectedModel: '=mcModel'
            }
        };
    }
]);
