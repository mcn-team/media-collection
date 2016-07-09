'use strict';

angular.module('core').directive('mcDashboardBtn', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'modules/core/directives/mc-dashboard-btn/directive.html',
            scope: {
                mcIcon: '=',
                mcPopover: '=',
                mcUrl: '='
            }
        };
    }
]);
