/**
 * Created by Kaze on 03/02/2015.
 */

'use strict';

angular.module('tv-shows').factory('StatsTvShowsService', [
    function() {
        var statService = {};

        var statistics = {};

        var initStatistics = function () {
            statistics = {
                collections: { field: 'Nombre de série', value: 0 },
                media: { field: 'Nombre de média', value: 0 },
                mediaValue: { field: 'Valeur totale', value: 0 },
                missingValue: { field: 'Valeur non renseignées', value: 0 },
                done: { field: 'Séries terminés', value: 0, popover: 'Nombre de série vu : ' },
                onGoing: { field: 'Séries en cours', value:0, popover: 'Série en cours de visionnage : ' },
                notDone: { field: 'Séries non vu', value: 0, popover: 'Nombre de série non vu : ' },
                bought: { field: 'Séries achetés', value: 0, popover: 'Nombre de série achetées : ' },
                toBought: { field: 'Séries à acheter', value: 0, popover: 'Nombre de série à acheter : ' },
                mediaMissing: { field: 'Séries manquantes', value: 0, popover: 'Nombre de série manquantes : ' },
                totalDuration: { field: 'Durée totale', value: 0 },
                totalSeenDuration: { field: 'Durée totale vu', value: 0, popover: 'Durée totale regardée : ' },
                toWatchDuration: { field: 'Reste à voir', value: 0, popover: 'Durée restante à voir : ' }
            };
        };

        var collectionsRef = [];

        var tvShowStatistics = function (tvShow) {
            if (tvShow.tvShowName && !collectionsRef.Contains(tvShow.tvShowName)) {
                collectionsRef.push(tvShow.tvShowName);
            }
            if (tvShow.tvShowName) {
                statistics.media.value += 1;
            }
            if (tvShow.bought && tvShow.tvShowName) {
                if (tvShow.price) {
                    statistics.mediaValue.value += parseFloat(tvShow.price);
                } else {
                    statistics.missingValue.value += 1;
                }
                if (tvShow.seen === 'SEEN') {
                    statistics.done.value += 1;
                    statistics.totalSeenDuration.value += (tvShow.duration * tvShow.episodes);
                } else if (tvShow.seen === 'NOTSEEN') {
                    statistics.notDone.value += 1;
                    statistics.toWatchDuration.value += (tvShow.duration * tvShow.episodes);
                } else {
                    statistics.onGoing.value += 1;
                    statistics.totalSeenDuration.value += (tvShow.duration * tvShow.lastSeen);
                    statistics.toWatchDuration.value += (tvShow.duration * (tvShow.episodes - tvShow.lastSeen));
                }
                if (tvShow.duration && tvShow.episodes) {
                    statistics.totalDuration.value += (tvShow.duration * tvShow.episodes);
                }
                statistics.bought.value += 1;
            } else if (tvShow.bought === false && tvShow.created) {
                statistics.toBought.value += 1;
            }

        };

        var collectionsStatistics = function (collection) {
            statistics.mediaMissing.value += collection.missing;
            angular.forEach(collection.tvShows, function (current) {
                tvShowStatistics(current);
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
                checkStatsCategoryPercents('done', 'onGoing', 'notDone');
                checkStatsCategoryPercents('bought', 'toBought', 'mediaMissing');
                checkStatsCategoryPercents('totalSeenDuration', 'toWatchDuration');
            }
            initStatistics();
            collectionsRef = [];

            angular.forEach(array, function (current) {
                if (current.tvShowName) {
                    tvShowStatistics(current);
                } else {
                    collectionsStatistics(current);
                }
            });

            statistics.collections.value = collectionsRef.length;
            statistics.mediaValue.value = statistics.mediaValue.value.toFixed(2);
            statistics.done.percent = Math.floor(statistics.done.value * 100 / statistics.bought.value);
            statistics.onGoing.percent = Math.floor(statistics.onGoing.value * 100 / statistics.bought.value);
            statistics.notDone.percent = Math.floor(statistics.notDone.value * 100 / statistics.bought.value);
            statistics.totalSeenDuration.percent = Math.floor(statistics.totalSeenDuration.value * 100 / statistics.totalDuration.value);
            statistics.toWatchDuration.percent = Math.floor(statistics.toWatchDuration.value * 100 / statistics.totalDuration.value);

            if (array && array[0] && (array[0].title || array[0].tvShowName)) {
                statistics.bought.percent = Math.floor(statistics.bought.value * 100 / statistics.media.value);
                statistics.toBought.percent = Math.floor(statistics.toBought.value * 100 / statistics.media.value);
                statistics.mediaMissing = undefined;
            } else {
                statistics.mediaMissing.value -= statistics.toBought.value;
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
