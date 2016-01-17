'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'BooksExposed', 'MoviesExposed', 'TvShowsExposed',
    'LanguagesService',
    function($scope, Authentication, BooksExposed, MoviesExposed, TvShowsExposed, LanguagesService) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.isLoaded = false;
        $scope.fadeInClass = {
            book: 'hidden-op',
            movie: 'hidden-op',
            show: 'hidden-op'
        };

        if (!LanguagesService.getPreloaded()) {
            LanguagesService.getCurrentLang().getLang({ lang: 'en' }).$promise.then(function (result) {
                $scope.translation = result;
                console.log($scope.translation);
                $scope.isLoaded = true;
                LanguagesService.setPreloaded($scope.translation);
            });
        } else {
            $scope.translation = LanguagesService.getPreloaded();
            $scope.isLoaded = true;
        }


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

        if ($scope.authentication.user) {
            TvShowsExposed.getLatest().$promise.then(function (result) {
                $scope.lastTvShow = latestCallback(result, 'producers', 'show', 750);
            });

            BooksExposed.lastOne().$promise.then(function(result) {
                $scope.lastBookResult = latestCallback(result, 'authors', 'book', 240);
            });

            MoviesExposed.lastOne().$promise.then(function(result) {
                $scope.lastMovieResult = latestCallback(result, 'actors', 'movie', 240);
            });
        } else {
            $scope.isLoaded = true;
        }
    }
]);
