'use strict';

angular.module('options').directive('mcLanguages', [
    '$translate',
    function ($translate) {
        return {
            restrict: 'E',
            templateUrl: 'modules/options/components/languages/view.html',
            link: function (scope) {
                scope.languages = [];
                scope.langs = $translate.getAvailableLanguageKeys();
                scope.langs.forEach(function (element) {
                    var lang = element.split('_');
                    scope.languages.push({ label: lang[0], key: lang[1] })
                });

                scope.changeLanguage = function () {
                    console.log(scope.selectedLanguage);
                }
            }
        };
    }
]);