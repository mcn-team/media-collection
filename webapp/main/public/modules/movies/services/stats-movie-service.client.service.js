'use strict';

angular.module('movies').factory('StatsMovieService', [
    function() {
        var movieResult = {};

        var statService = {};

        var statistics = {};

        var initStatistics = function () {
            statistics = {
                collections: { field: 'Nombre de collection', value: 0 },
                media: { field: 'Nombre de Films', value: 0 },
                mediaValue: { field: 'Valeur totale', value: 0 },
                missingValue: { field: 'Valeur non renseignées', value: 0 },
                headerDone: { field: 'Statistiques de visionnage' },
                done: { field: 'Films terminés', value: 0, popover: 'Nombre de films vus : ' },
                notDone: { field: 'Films non Vu', value: 0, popover: 'Nombre de films non vu : ' },
                bought: { field: 'Films achetés', value: 0, popover: 'Nombre de films achetés : ' },
                toBought: { field: 'Films à acheter', value: 0, popover: 'Nombre de films à acheter : ' },
                mediaMissing: { field: 'Films manquant', value: 0 },
                totalDuration: { field: 'Durée totale', value: 0},
                totalSeenDuration: { field: 'Durée totale vu', value: 0, popover: 'Durée totale regardée : ' },
                toWatchDuration: { field: 'Reste à voir', value: 0, popover: 'Durée restante à voir : '  }
            };
        };

        var collectionsRef = [];

        var movieStatistics = function (movie) {
            if (movie.collectionName && !collectionsRef.Contains(movie.collectionName)) {
                collectionsRef.push(movie.collectionName);
            }
            if (movie.title) {
                statistics.media.value += 1;
            }
            if (movie.bought && movie.title) {
                if (movie.price) {
                    statistics.mediaValue.value += parseFloat(movie.price);
                } else {
                    statistics.missingValue.value += 1;
                }
                if (movie.seen) {
                    statistics.done.value += 1;
                    statistics.totalSeenDuration.value += movie.duration;
                } else {
                    statistics.notDone.value += 1;
                    statistics.toWatchDuration.value += movie.duration;
                }
                if (movie.duration) {
                    statistics.totalDuration.value += movie.duration;
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

            function checkStatsCategoryPercents(firstKey, secondKey, thirdKey) {
                var total = statistics[firstKey].percent + statistics[secondKey].percent + (statistics[thirdKey] && statistics[thirdKey].percent ? statistics[thirdKey].percent : 0);
                if (total < 100) {
                    if (statistics[firstKey].percent > 0 ) {
                        statistics[firstKey].percent += 1;
                    } else if (statistics[secondKey].percent > 0) {
                        statistics[secondKey].percent += 1;
                    } else if (thirdKey && statistics[thirdKey] && statistics[thirdKey].percent && statistics[thirdKey].percent > 0) {
                        statistics[thirdKey].percent += 1;
                    }
                    if (statistics[firstKey].percent + statistics[secondKey].percent + (statistics[thirdKey] && statistics[thirdKey].percent ? statistics[thirdKey].percent : 0) < 100) {
                        checkStatsCategoryPercents(secondKey, thirdKey, firstKey);
                    }
                }
            }
            function checkPercents() {
                checkStatsCategoryPercents('done', 'notDone');
                checkStatsCategoryPercents('bought', 'toBought', 'mediaMissing');
                checkStatsCategoryPercents('totalSeenDuration', 'toWatchDuration');
            }
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
            statistics.mediaValue.value = statistics.mediaValue.value.toFixed(2);
            statistics.done.percent = Math.floor(statistics.done.value * 100 / statistics.bought.value);
            statistics.notDone.percent = Math.floor(statistics.notDone.value * 100 / statistics.bought.value);
            statistics.totalSeenDuration.percent = Math.floor(statistics.totalSeenDuration.value * 100 / statistics.totalDuration.value);
            statistics.toWatchDuration.percent = Math.floor(statistics.toWatchDuration.value * 100 / statistics.totalDuration.value);

            if (array && array[0] && array[0].title) {
                statistics.bought.percent = Math.floor(statistics.bought.value * 100 / statistics.media.value);
                statistics.toBought.percent = Math.floor(statistics.toBought.value * 100 / statistics.media.value);
                statistics.mediaMissing = undefined;
            } else {
                statistics.bought.percent = Math.floor(statistics.bought.value * 100 / (statistics.bought.value + statistics.mediaMissing.value + statistics.toBought.value));
                statistics.toBought.percent = Math.floor(statistics.toBought.value * 100 / (statistics.bought.value + statistics.mediaMissing.value + statistics.toBought.value));
                statistics.mediaMissing.percent = Math.floor(statistics.mediaMissing.value * 100 / (statistics.bought.value + statistics.mediaMissing.value + statistics.toBought.value));
            }
            checkPercents();

            return statistics;
        };

        return statService;
    }
]);
