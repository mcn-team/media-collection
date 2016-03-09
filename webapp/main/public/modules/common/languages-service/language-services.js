'use strict';

ApplicationConfiguration.registerModule('mc.language');

angular.module('mc.language').factory('LanguageServices', [
    '$http',
    function ($http) {
        var languageServices = {};

        languageServices.fetchLanguages = function () {
            var successCallback = function (response) {
                languageServices.lang = response.data;
            };

            var failureCallback = function (errorResponse) {
                console.error(errorResponse);
            };

            $http.get('/api/lang').then(successCallback, failureCallback);
        };

        return languageServices;
    }
]);
