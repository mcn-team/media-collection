'use strict';

angular.module('light-rss-feed').factory('fnacFeedService', [
    function() {
        var fnacFeedService = {};

        fnacFeedService.parseFnacFeedContent = function (htmlContent) {
            var fragment = [];

            function regexExtract(str, delimiter) {
                var regX = new RegExp(delimiter + '(.*?)' + delimiter);

                return str.match(regX)[1];
            }

            if (htmlContent) {
                htmlContent = htmlContent.trim();
                htmlContent = htmlContent.replace(/\t/g, '');
                fragment = htmlContent.split('\n');

                for (var i = 0; i < fragment.length; i++) {
                    fragment[i] = fragment[i].trim();
                }

                fragment = fragment.filter(Boolean);
            }

            function fillFeedObjectFields() {
                var item = {};

                fragment.forEach(function (elem, index) {
                    if (elem.indexOf('><img') !== -1) {
                        item.img = regexExtract(elem.split('>')[1], '"');
                        item.link = regexExtract(elem, '"');
                    } else if (elem.indexOf('text-align:justify') !== -1) {
                        item.description = elem.replace(/<[^>]*>/g, '');
                    } else if (elem.indexOf('p><br') !== -1) {
                        item.title = elem.replace(/<[^>]*>/g, '');
                    } else if (elem.indexOf('span><br') !== -1) {
                        item.price = elem.replace(/<[^>]*>/g, '');
                    }
                });

                return item;
            }

            return fillFeedObjectFields();
        };

        return fnacFeedService;
    }
]);
