'use strict';

angular.module('core').controller('HomeController', [
    '$scope', 'Authentication',
    'BookServices', 'MovieServices', 'LanguageServices',
    function($scope, Authentication, BookServices, MovieServices, LanguageServices) {
        var self = this;
        // This provides Authentication context.
        $scope.authentication = Authentication.isAuthenticated();
        $scope.isLoaded = false;
        $scope.fadeInClass = {
            book: 'hidden-op',
            movie: 'hidden-op',
            show: 'hidden-op'
        };

        self.fields = LanguageServices.lang['en'];
        $scope.isLoaded = true;

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
            $scope.fadeInClass[type] = 'fade-in';
            return result;
        }

        if ($scope.authentication) {
            BookServices.getLatest().then(function(result) {
                if (result.status !== 204) {
                    $scope.lastBookResult = latestCallback(result.data, 'authors', 'book', 240);
                }
            }, function (errorResponse) {
                console.error(errorResponse);
            });

            MovieServices.getLatest().then(function(result) {
                if (result.status !== 204) {
                    $scope.lastMovieResult = latestCallback(result.data, 'actors', 'movie', 240);
                }
            }, function (errorResponse) {
                console.error(errorResponse);
            });
        }
    }
]);
