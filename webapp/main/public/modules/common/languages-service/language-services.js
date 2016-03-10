'use strict';

ApplicationConfiguration.registerModule('mc.language');

angular.module('mc.language').factory('LanguageServices', [
    '$http',
    function ($http) {
        var languageServices = {};

        languageServices.fetchLanguages = function (callback) {
            var successCallback = function (response) {
                languageServices.lang = response.data;
                callback && callback();
            };

            var failureCallback = function (errorResponse) {
                console.error(errorResponse);
                callback && callback(errorResponse);
            };

            if (!languageServices.lang) {
                $http.get('/api/lang').then(successCallback, failureCallback);
            } else {
                callback && callback();
            }
        };

        return languageServices;
    }
]);
