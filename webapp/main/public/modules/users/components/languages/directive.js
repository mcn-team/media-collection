'use strict';

angular.module('users').directive('mcLanguages', [
    '$translate', 'Authentication', 'lodash', 'UserServices',
    function ($translate, Authentication, _, UserServices) {
        return {
            restrict: 'E',
            templateUrl: 'modules/users/components/languages/view.html',
            link: function (scope) {
                var options = Authentication.user.options;
                scope.languages = [];
                scope.langs = $translate.getAvailableLanguageKeys();
                scope.langs.forEach(function (element) {
                    var lang = element.split('_');
                    scope.languages.push({ label: lang[0], key: lang[1] });
                });

                scope.selectedLanguage = _.find(scope.languages, { key: options.language });

                scope.changeLanguage = function () {
                    $translate.use(scope.selectedLanguage.label + '_' + scope.selectedLanguage.key);
                    Authentication.user.options.language = scope.selectedLanguage.key;
                    UserServices.saveOptions(Authentication.user._id, Authentication.user.options).then(function() {}, function (errorResponse) {
                        console.error(errorResponse);
                    });
                    Authentication.setCredentials(Authentication.credentials);
                };
            }
        };
    }
]);
