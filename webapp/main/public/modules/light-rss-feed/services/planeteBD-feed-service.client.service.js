'use strict';

angular.module('light-rss-feed').factory('planeteBDFeedService', [
    function() {
        var planeteBDFeedService = {};

        planeteBDFeedService.authorField = '';

        planeteBDFeedService.parseRssFeedContent = function (htmlContent) {
            var tmp = '';
            var fragment = [];

            // Clean html content string.
            if (htmlContent) {
                htmlContent = htmlContent.replace(/(<i>|<\/i>)/g, '');
                htmlContent = htmlContent.replace(/(\. \.)/g, '.');

                for (var i = 0; i < htmlContent.length; i++) {
                    if (htmlContent[i] === '<') {
                        if (tmp !== '') {
                            fragment.push(tmp);
                            tmp = '';
                        }

                        tmp = '';
                    } else if (htmlContent[i] === '>') {
                        tmp += htmlContent[i];
                        fragment.push(tmp);
                        tmp = '';
                    }

                    if (htmlContent[i] !== '>')
                        tmp += htmlContent[i];
                }
            }

            function regexExtract(str, delimiter) {
                var regX = new RegExp(delimiter + '(.*?)' + delimiter);
                return str.match(regX)[1];
            }

            function getImgScr(htmlImgStr) {
                return regexExtract(htmlImgStr, '"');
            }

            function fillFeedObjectFields() {
                var item = {};

                fragment.forEach(function (elem, index, array) {
                    if (elem.indexOf('Auteurs') !== -1) {
                        item.author = elem;
                    } else if (elem.indexOf('\.jpg') !== -1) {
                        item.img = regexExtract(elem, '"');
                    } else if (!/\//.test(elem) && elem.length > 50) {
                        item.summary = elem;
                    }
                });

                return item;
            }

            return fillFeedObjectFields();
        };

        planeteBDFeedService.formatFeedTitle = function (rssTitle) {
            var tmp = [];

            if (rssTitle)
                tmp = rssTitle.split(' - ');

            if (tmp.length === 2) {
                if (tmp[1].length <= 2) {
                    rssTitle = tmp[0] + ' - ' + tmp[1].toUpperCase();
                } else {
                    rssTitle = tmp[0] + ' - ' + tmp[1].charAt(0).toUpperCase() + tmp[1].substring(1);
                }
            }

            return rssTitle;
        };

       return planeteBDFeedService;
    }
]);
