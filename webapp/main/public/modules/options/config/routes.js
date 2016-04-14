'use strict';

angular.module('options').config([
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider.state('options', {
            url: '/options',
            templateUrl: 'modules/options/components/core/view.html'
        });
    }
]);
