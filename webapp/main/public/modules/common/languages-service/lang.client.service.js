/**
 * Created by Kaze on 08/03/2015.
 */

'use strict';

angular.module('languages').factory('LanguagesService', ['$resource',
        function ($resource) {
            var languageService = {};

            languageService.setPreloaded = function (translation) {
                this.preloadedLang = translation;
            };

            languageService.getPreloaded = function () {
                return this.preloadedLang;
            };

            languageService.getCurrentLang = function () {
                var exposed = {};

                exposed.getLang = {
                    method: 'GET',
                    params: {
                        lang: '@lang'
                    }
                };

                return $resource('api/lang', { lang: '@lang' }, exposed);
            };

            return languageService;
        }
    ]
);
