/**
 * Created by Kaze on 10/02/2015.
 */

'use strict';

var request = require('request');

//var apiUrl = 'https://www.googleapis.com/books/v1/vobn:';
var apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';

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

exports.getBookByISBN = function (req, res) {
    var fullUrl = apiUrl + req.query.isbn;
    request(fullUrl, function (err, response, body) {
        if (!err && response.statusCode === 200) {
            try {
                return res.jsonp(parseData(JSON.parse(body), req.query.isbn));
            } catch (parseError) {
                console.error('Unable to parse API response: ' + parseError);
                err = parseError;
            }
        }
        return res.status(400).send(err);
    });
};
