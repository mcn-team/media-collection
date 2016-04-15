'use strict';

angular.module('options').directive('mcLanguages', [
    '$translate',
    function ($translate) {
        return {
            restrict: 'E',
            templateUrl: 'modules/options/components/languages/view.html',
            link: function (scope) {
                scope.langs = $translate.getAvailableLanguageKeys();
            }
        };
    }
]);