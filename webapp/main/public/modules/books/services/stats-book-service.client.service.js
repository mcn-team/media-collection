'use strict';

angular.module('books').factory('StatsBookService', [
    function() {
        // Stats book service service logic
        // ...
        
        var localeOptions = { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 };

        var statService = {};

        var statistics = {};

        var initStatistics = function () {
            statistics = {
                collections: { field: 'COLLECTION_NUMBER', value: 0 },
                media: { field: 'BOOKS_NUMBER', value: 0 },
                mediaValue: { field: 'TOTAL_VALUE', value: 0 },
                missingValue: { field: 'MISSING_VALUE', value: 0 },
                headerDone: { field: 'READING_STATS' },
                done: { field: 'ENDED_BOOKS', value: 0, popover: 'READ_BOOKS_COUNT'},
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

            if (!book.missing) {
                statistics.media.value += 1;
            }

            if (book.read === 'READ') {
                statistics.done.value += 1;
            } else if (book.read === 'ONGOING') {
                statistics.onGoing.value += 1;
            } else if (book.read === 'NOTREAD') {
                statistics.notDone.value += 1;
            }

            if (book.bought && !book.missing) {
                if (book.price) {
                    statistics.mediaValue.value += parseFloat(book.price) || 0;
                } else {
                    statistics.missingValue.value += 1;
                }
                
                statistics.bought.value += 1;
            } else if (book.bought === false && !book.missing) {
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
            initStatistics();
            collectionsRef = [];
            angular.forEach(array, function (current) {
                if (!current.data) {
                    bookStatistics(current);
                } else {
                    collectionsStatistics(current);
                }
            });

            statistics.collections.value = collectionsRef.length;
            statistics.mediaValue.value = statistics.mediaValue.value.toLocaleString('fr-FR', localeOptions);
            statistics.done.stats = (statistics.done.value * 100 / statistics.media.value).toFixed(2);
            statistics.onGoing.stats = (statistics.onGoing.value * 100 / statistics.media.value).toFixed(2);
            statistics.notDone.stats = (statistics.notDone.value * 100 / statistics.media.value).toFixed(2);
            if (array && array[0] && !array[0].data) {
                statistics.bought.stats = (statistics.bought.value * 100 / statistics.media.value).toFixed(2);
                statistics.toBought.stats = (statistics.toBought.value * 100 / statistics.media.value).toFixed(2);
                statistics.mediaMissing = undefined;
            } else {
                statistics.mediaMissing.value -= statistics.toBought.value;
                statistics.bought.stats = (statistics.bought.value * 100 / (statistics.bought.value + statistics.mediaMissing.value + statistics.toBought.value)).toFixed(2);
                statistics.toBought.stats = (statistics.toBought.value * 100 / (statistics.bought.value + statistics.mediaMissing.value + statistics.toBought.value)).toFixed(2);
                statistics.mediaMissing.stats = (statistics.mediaMissing.value * 100 / (statistics.bought.value + statistics.mediaMissing.value + statistics.toBought.value)).toFixed(2);
                statistics.mediaMissing.total = statistics.mediaMissing.value + statistics.media.value;
            }
            return statistics;
        };

        return statService;
    }
]);
