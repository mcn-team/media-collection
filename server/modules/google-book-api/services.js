'use strict';

const request = require('request');

const responseHelper = require('../../utils/response-helper');
const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';

function parseData(json, isbn) {
    if (!json.items || !json.items[0] || !json.items[0].volumeInfo) {
        return { error: 'No match for ISBN : ' + isbn + ' In the Google Book API.'};
    }

    var item = json.items[0].volumeInfo;
    var bookInfo = {
        authors: []
    };

    bookInfo.title = item.title ? item.title : '';
    bookInfo.collectionName = item.subtitle ? item.subtitle : '';
    bookInfo.author = item.authors && item.authors.length > 0 ? item.authors[item.authors.length - 1] : '';

    if (item.authors && item.authors.length > 1) {
        for    (var i = 0; i < item.authors.length - 1; i++) {
            bookInfo.authors.push(item.authors[i]);
        }
    }

    bookInfo.isbn = isbn;
    bookInfo.publishingDate = item.publishedDate ? item.publishedDate : '';
    bookInfo.publisher = item.publisher ? item.publisher : '';
    bookInfo.pageCount = item.pageCount ? item.pageCount : '';
    bookInfo.summary = item.description ? item.description : '';
    bookInfo.cover = item.imageLinks ? item.imageLinks.thumbnail : '';

    return bookInfo;
}

exports.findBookByIsbn = (params, callback) => {
    const fullUrl = apiUrl + params.isbn;
    let response = null;

    request(fullUrl, (err, response, body) => {
        if (!err && response.statusCode === 200) {
            try {
                response = parseData(JSON.parse(body), params.isbn);
            } catch (parseError) {
                console.error('Unable to parse API response: ' + parseError);
                err = parseError;
            }
        }

        responseHelper.serviceCallback(err, response, 200, callback);
    });
};
