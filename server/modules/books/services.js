'use strict';

const Book = require('mongoose').model('Book');

exports.findAllBooks = (callback) => {
    Book.find().sort('-created').populate('user').exec(function (err, books) {
        if (err) {
            callback({ error: err, code: 503 });
        } else if (!books) {
            callback({ error: 'No resource found', code: 404 });
        } else {
            callback(null, { data: books, code: 200 });
        }
    });
};
