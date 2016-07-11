'use strict';

angular.module('books').factory('BooksDataService', [
    'lodash',
    function(_) {
        // Book data service logic
        // ...

        var bookServices = {};

        // Public API

        bookServices.getLimitedAuthorsList = function (array) {
            var limitedAuthorsList = [];
            angular.forEach(array, function(current, idx) {
                if (idx < array.length - 1) {
                    limitedAuthorsList.push(current.trim());
                }
            });
            return limitedAuthorsList;
        };

        bookServices.getDisplayAuthorsList = function (array) {
            if (!array || array.length === 0) {
                return '';
            }
            var displayAuthors = '';

            angular.forEach(array, function (item) {
                if (displayAuthors !== '' && item) {
                    displayAuthors += ', ';
                }
                displayAuthors += item;
            });

            return displayAuthors;
        };

        bookServices.getListLastOne = function (array) {
            return array.length > 0 ? array[array.length - 1].trim() : undefined;
        };

        function fillBaseBookModel(book) {
            return {
                type: book.type ? book.type : 'book',
                custom: {},
                title: book.title,
                collectionName: book.collectionName ? book.collectionName : undefined,
                volumeId: parseInt(book.volume) ? parseInt(book.volume) : undefined,
                publishingDate: book.publishingDate ? new Date(book.publishingDate) : undefined,
                isbn: book.isbn,
                publisher: book.publisher,
                pageCount: book.pageCount && parseInt(book.pageCount),
                price: book.pages && parseFloat(book.price),
                read: book.read,
                bought: book.bought,
                cover: book.cover,
                bookRate: book.bookRate,
                summary: book.summary,
                customFields: book.customFields ? book.customFields : []
            };
        }

        bookServices.fillDupBookModel = function (book) {
            var model = fillBaseBookModel(book);
            model.authorsList = bookServices.getLimitedAuthorsList(book.authors);
            model.author = bookServices.getListLastOne(book.authors);

            return model;
        };

        bookServices.fillBookModel = function (book) {
            return {
                type: book.type || 'book',
                title: book.title,
                custom: {},
                collectionName: book.collectionName ? book.collectionName : undefined,
                volumeId: parseInt(book.volume) || undefined,
                displayAuthors: bookServices.getDisplayAuthorsList(book.authors),
                authorsList: bookServices.getLimitedAuthorsList(book.authors),
                author: bookServices.getListLastOne(book.authors),
                publishingDate: book.publishingDate ? new Date(book.publishingDate) : undefined,
                isbn: book.isbn,
                publisher: book.publisher,
                pageCount: book.pageCount && parseInt(book.pageCount),
                price: book.price && parseFloat(book.price),
                read: book.read  || 'NOTREAD',
                bought: book.bought === undefined ? true : book.bought,
                cover: book.cover,
                bookRate: book.bookRate,
                summary: book.summary,
                customFields: book.customFields ? book.customFields : []
            };
        };

        bookServices.createBookFromBookModel = function (model) {
            var authorsTab = [];
            angular.forEach(model.authorsList, function (current) {
                authorsTab.push(current);
            });

            if (model.uploadCover) {
                model.cover = 'covers/';
                if (model._id) {
                    model.cover += model._id + '.jpg';
                }
            }

            if (model.collectionName === '') {
                model.collectionName = undefined;
            }

            if (model.author) {
                authorsTab.push(model.author);
            }

            if (model.publishingDate) {
                model.publishingDate.setMinutes(-model.publishingDate.getTimezoneOffset());
            }

            return new Object({
                type: model.type,
                title: model.title,
                collectionName: model.collectionName,
                volume: model.volumeId,
                authors: authorsTab,
                publishingDate: model.publishingDate ? model.publishingDate.toISOString() : undefined,
                publisher: model.publisher,
                price: model.price,
                isbn: model.isbn,
                read: model.read,
                bought: model.bought,
                pageCount: model.pageCount,
                cover: model.cover,
                bookRate: model.bookRate,
                summary: model.summary,
                customFields: model.customFields
            });
        };

        function sortAsc (a, b) {
            return a - b;
        }

        function sortBooks (a, b) {
            return a.volume - b.volume;
        }

        function sortCollections (a, b) {
            return a.name > b.name ? 1 : -1;
        }

        bookServices.computeMissing = function (collections, limit) {
            collections = _.filter(collections, function (item) {
                return item._id !== null;
            });
            _.forEach(collections, function (element) {
                var volumes = [];

                element.missing = 0;

                _.forEach(element.data, function (book) {
                    volumes.push(parseInt(book.volume));
                });
                volumes.sort(sortAsc);

                var max = limit || volumes[volumes.length - 1];
                for (var i = 1; i < max; i++) {
                    if (_.indexOf(volumes, i) < 0) {
                        element.missing += 1;
                        element.data.push({
                            collectionName: element._id,
                            volume: i,
                            bought: false,
                            missing: true
                        });
                    }
                }
                element.data.sort(sortBooks);
            });

            collections.sort(sortCollections);

            return collections;
        };

        return bookServices;
    }
]);
