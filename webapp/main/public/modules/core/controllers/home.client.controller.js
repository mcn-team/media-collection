'use strict';

angular.module('core').controller('HomeController', [
    '$location', 'Authentication', 'BookServices', 'MovieServices', 'UserServices', 'Config',
    function($location, Authentication, BookServices, MovieServices, UserServices, Config) {
        var self = this;
        // This provides Authentication context.
        self.authentication = Authentication.isAuthenticated();
        self.fadeInClass = {
            book: 'hidden-op',
            movie: 'hidden-op',
            show: 'hidden-op'
        };

        var host = $location.host();

        self.versionLabel = 'v' + Config.version;
        if (host.indexOf('dev.') !== -1 || host.indexOf('localhost') !== -1) {
            self.versionLabel += ' - DEV BUILD';
        }

        function successCallback(response) {
            self.isSigned = !response.data.exists;
            UserServices.setIsSigned(self.isSigned);
        }

        UserServices.isUser().then(successCallback);
        self.isLoaded = true;

        function getDisplayList(list) {
            var formatted = '';

            for (var i = 0; i < list.length; i++) {
                if (i > 1) {
                    formatted += ', ...';
                    break;
                }
                if (formatted !== '' && list[i]) {
                    formatted += ', ';
                }
                formatted += list[i];
            }
            return formatted;
        }

        function latestCallback(result, key, type, limit) {
            result[key] = getDisplayList(result[key]);
            result.summary = result.summary ? result.summary.TruncIsh(limit) : null;
            self.fadeInClass[type] = 'fade-in';
            return result;
        }

        if (self.authentication) {
            BookServices.getLatest().then(function(result) {
                if (result.status !== 204) {
                    self.lastBookResult = latestCallback(result.data, 'authors', 'book', 240);
                }
            }, function (errorResponse) {
                console.error(errorResponse);
            });

            MovieServices.getLatest().then(function(result) {
                if (result.status !== 204) {
                    self.lastMovieResult = latestCallback(result.data, 'actors', 'movie', 240);
                }
            }, function (errorResponse) {
                console.error(errorResponse);
            });
        }
    }
]);
