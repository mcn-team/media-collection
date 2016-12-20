'use strict';

angular.module('movies').factory('StatsMovieService', [
    function() {
        var statService = {};

        var statistics = {};

        var localeOptions = { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 };

        var initStatistics = function () {
            statistics = {
                collections: { field: 'COLLECTION_NUMBER', value: 0 },
                media: { field: 'MOVIE_NUMBER', value: 0 },
                mediaValue: { field: 'TOTAL_VALUE', value: 0 },
                missingValue: { field: 'MISSING_VALUE', value: 0 },
                headerDone: { field: 'VIEWING_STATISTICS' },
                done: { field: 'SEEN_MOVIES', value: 0, popover: 'SEEN_MOVIES' },
                notDone: { field: 'UNSEEN_MOVIE', value: 0, popover: 'UNSEEN_MOVIE' },
                bought: { field: 'MOVIES_BOUGHT', value: 0, popover: 'MOVIES_BOUGHT' },
                toBought: { field: 'MOVIES_TO_BUY', value: 0, popover: 'MOVIES_TO_BUY' },
                mediaMissing: { field: 'MISSING_MOVIES', value: 0, popover: 'MISSING_MOVIES' },
                totalDuration: { field: 'TOTAL_DURATION', value: 0},
                totalSeenDuration: { field: 'TOTAL_SEEN_DURATION', value: 0, popover: 'TOTAL_SEEN_DURATION' },
                toWatchDuration: { field: 'LEFT_TO_SEE_DURATION', value: 0, popover: 'LEFT_TO_SEE_DURATION'  }
            };
        };

        var collectionsRef = [];

        var movieStatistics = function (movie) {
            if (movie.collectionName && !collectionsRef.Contains(movie.collectionName)) {
                collectionsRef.push(movie.collectionName);
            }

            if (movie.title) {
                statistics.media.value += 1;
                
                if (movie.seen) {
                    statistics.done.value += 1;
                    statistics.totalSeenDuration.value += movie.duration || 0;
                } else {
                    statistics.notDone.value += 1;
                    statistics.toWatchDuration.value += movie.duration || 0;
                }
            }

            statistics.totalDuration.value += movie.duration || 0;

            if (movie.bought && movie.title) {
                if (movie.price) {
                    statistics.mediaValue.value += parseFloat(movie.price) || 0;
                } else {
                    statistics.missingValue.value += 1;
                }

                statistics.bought.value += 1;
            } else if (movie.bought === false && movie.title) {
                statistics.toBought.value += 1;
            }

        };

        var collectionsStatistics = function (collection) {
            statistics.mediaMissing.value += collection.missing;
            angular.forEach(collection.data, function (current) {
                movieStatistics(current);
            });
        };

        // Public API

        statService.calculate = function (array) {
            initStatistics();
            collectionsRef = [];

            angular.forEach(array, function (current) {
                if (current.title) {
                    movieStatistics(current);
                } else {
                    collectionsStatistics(current);
                }
            });

            statistics.collections.value = collectionsRef.length;
            statistics.mediaValue.value = statistics.mediaValue.value.toLocaleString('fr-FR', localeOptions);

            statistics.done.stats = statistics.media.value !== 0 ? (statistics.done.value * 100 / statistics.media.value).toFixed(2) : (0).toFixed(2);
            statistics.notDone.stats = statistics.media.value !== 0 ? (statistics.notDone.value * 100 / statistics.media.value).toFixed(2) : (0).toFixed(2);

            statistics.totalSeenDuration.stats = statistics.media.value !== 0 ? (statistics.totalSeenDuration.value * 100 / statistics.totalDuration.value).toFixed(2) : (0).toFixed(2);
            statistics.toWatchDuration.stats = statistics.media.value !== 0 ? (statistics.toWatchDuration.value * 100 / statistics.totalDuration.value).toFixed(2) : (0).toFixed(2);

            if (array && array[0] && array[0].title) {
                statistics.bought.stats = statistics.media.value !== 0 ? (statistics.bought.value * 100 / statistics.media.value).toFixed(2) : (0).toFixed(2);
                statistics.toBought.stats = statistics.media.value !== 0 ? (statistics.toBought.value * 100 / statistics.media.value).toFixed(2) : (0).toFixed(2);
                statistics.mediaMissing = undefined;
            } else {
                statistics.bought.stats = statistics.media.value !== 0 ? (statistics.bought.value * 100 / (statistics.bought.value + statistics.mediaMissing.value + statistics.toBought.value)).toFixed(2) : (0).toFixed(2);
                statistics.toBought.stats = statistics.media.value !== 0 ? (statistics.toBought.value * 100 / (statistics.bought.value + statistics.mediaMissing.value + statistics.toBought.value)).toFixed(2) : (0).toFixed(2);
                statistics.mediaMissing.stats = statistics.media.value !== 0 ? (statistics.mediaMissing.value * 100 / (statistics.bought.value + statistics.mediaMissing.value + statistics.toBought.value)).toFixed(2) : (0).toFixed(2);
            }

            return statistics;
        };

        return statService;
    }
]);
