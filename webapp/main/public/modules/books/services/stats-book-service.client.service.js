'use strict';

angular.module('books').factory('StatsBookService', [
    function() {
        // Stats book service service logic
        // ...

        var bookResult = {};

        var statService = {};

        var statistics = {};

        var initStatistics = function () {
            statistics = {
                collections: { field: 'COLLECTION_NUMBER', value: 0 },
                media: { field: 'BOOKS_NUMBER', value: 0 },
                mediaValue: { field: 'TOTAL_VALUE', value: 0 },
                missingValue: { field: 'MISSING_VALUE', value: 0 },
                headerDone: { field: 'READING_STATS' },
                done: { field: 'ENDED_BOOKS', value: 0, popover: 'READ_BOKS_COUNT'},
                onGoing: { field: 'ONGOING_READING', value: 0, popover: 'ONGOING_BOOKS' },
                notDone: { field: 'UNREAD_BOOKS', value: 0, popover: 'UNREAD_BOOKS_NUM' },
                bought: { field: 'BOUGHT_BOOKS', value: 0, popover: 'BOUGHT_BOOKS_NUM' },
                toBought: { field: 'BOOKS_TO_BUY', value: 0, popover: 'BOOKS_TO_BUY_NUM' },
                mediaMissing: { field: 'MISSING_BOOKS', value: 0, popover: 'MISSING_BOOKS_NUM' }
            };
        };

        var collectionsRef = [];

        var bookStatistics = function (book) {
            if (book.collectionName && !collectionsRef.Contains(book.collectionName)) {
                collectionsRef.push(book.collectionName);
            }
            if (book.title) {
                statistics.media.value += 1;
            }
            if (book.bought && book.title) {
                if (book.price) {
                    statistics.mediaValue.value += parseFloat(book.price);
                } else {
                    statistics.missingValue.value += 1;
                }
                if (book.read === 'READ') {
                    statistics.done.value += 1;
                } else if (book.read === 'ONGOING') {
                    statistics.onGoing.value += 1;
                } else {
                    statistics.notDone.value += 1;
                }
                statistics.bought.value += 1;
            } else if (book.bought === false && book.title) {
                statistics.toBought.value += 1;
            }

        };

        var collectionsStatistics = function (collection) {
            statistics.mediaMissing.value += collection.missing;
            angular.forEach(collection.data, function (current) {
                bookStatistics(current);
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
            }

            initStatistics();
            collectionsRef = [];
            angular.forEach(array, function (current) {
                if (current.title) {
                    bookStatistics(current);
                } else {
                    collectionsStatistics(current);
                }
            });
            statistics.collections.value = collectionsRef.length;
            statistics.mediaValue.value = statistics.mediaValue.value.toFixed(2);
            statistics.done.percent = Math.floor(statistics.done.value * 100 / statistics.bought.value);
            statistics.onGoing.percent = Math.floor(statistics.onGoing.value * 100 / statistics.bought.value);
            statistics.notDone.percent = Math.floor(statistics.notDone.value * 100 / statistics.bought.value);
            if (array && array[0] && array[0].title) {
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
