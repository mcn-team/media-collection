'use strict';

const request = require('request');

const responseHelper = require('../../utils/response-helper');
const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';

function parseData(json, isbn, callback) {
    if (!json.items || !json.items[0] || !json.items[0].volumeInfo) {
        return callback({ error: 'No match for ISBN : ' + isbn + ' In the Google Book API.'});
    }

    var item = json.items[0].volumeInfo;
    var bookInfo = {
        authors: []
    };

    bookInfo.title = item.title;
    bookInfo.collectionName = item.subtitle;
    bookInfo.author = item.authors && item.authors.length > 0 ? item.authors[item.authors.length - 1] : undefined;

    if (item.authors && item.authors.length > 1) {
        for    (var i = 0; i < item.authors.length - 1; i++) {
            bookInfo.authors.push(item.authors[i]);
        }
    }

    bookInfo.isbn = isbn;
    bookInfo.publishingDate = item.publishedDate;
    bookInfo.publisher = item.publisher;
    bookInfo.pageCount = item.pageCount;
    bookInfo.summary = item.description;
    bookInfo.cover = item.imageLinks ? item.imageLinks.thumbnail : undefined;

    return callback(null, bookInfo);
}

exports.findBookByIsbn = (params, callback) => {
    const fullUrl = apiUrl + params.isbn;
    let response = null;

    request(fullUrl, (err, response, body) => {
        if (!err && response.statusCode === 200) {
            let error = null;
            let data = null;
            try {
                parseData(JSON.parse(body), params.isbn, (err, bookInfo) => {
                    error = err;
                    data = bookInfo
                });
            } catch (parseError) {
                console.error('Unable to parse API response: ' + parseError);
                error = parseError;
            }

            responseHelper.serviceCallback(error, data, 200, callback);
        }
    });
};
