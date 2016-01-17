'use strict';

angular.module('books').factory('BooksDataService', ['Books',
    function(Books) {
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
                if (displayAuthors !== '' && item)
                    displayAuthors += ', ';
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
                publishingDate: book.publishingDate.split('T')[0],
                isbn: book.isbn,
                publisher: book.publisher,
                pageCount: parseInt(book.pageCount),
                price: parseFloat(book.price),
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
                type: book.type ? book.type : 'book',
                title: book.title,
                custom: {},
                collectionName: book.collectionName ? book.collectionName : undefined,
                volumeId: parseInt(book.volume) ? parseInt(book.volume) : undefined,
                displayAuthors: bookServices.getDisplayAuthorsList(book.authors),
                authorsList: bookServices.getLimitedAuthorsList(book.authors),
                author: bookServices.getListLastOne(book.authors),
                publishingDate: book.publishingDate ? book.publishingDate.split('T')[0] : undefined,
                isbn: book.isbn,
                publisher: book.publisher,
                pageCount: parseInt(book.pageCount),
                price: parseFloat(book.price),
                read: book.read,
                bought: book.bought,
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
            if (model.author) {
                authorsTab.push(model.author);
            }
            if (!model.collectionName || model.collectionName === '') {
                model.volumeId = '-';
            }

            return new Books ({
                type: model.type,
                title: model.title,
                collectionName: model.collectionName,
                volume: model.volumeId,
                authors: authorsTab,
                publishingDate: model.publishingDate,
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

        return bookServices;
    }
]);
