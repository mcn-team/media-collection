'use strict';

const Book = require('mongoose').model('Book');

exports.findBooks = (callback) => {
    Book.find().sort('-created').populate('user', 'displayName').exec((err, books) => {
        if (err) {
            callback({ error: err, code: 503 });
        } else if (!books) {
            callback({ error: 'No resource found', code: 404 });
        } else {
            callback(null, { data: books, code: 200 });
        }
    });
};

exports.findOneBook = (params, callback) => {
    Book.findOne({ _id: params.bookId }).populate('user', 'displayName').exec((err, book) => {
        if (err) {
            callback({ error: err, code: 503 });
        } else if (!book) {
            callback({ error: 'No resource found', code: 404 });
        } else {
            callback(null, { data: book, code: 200 });
        }
    });
};

exports.saveBook = (payload, callback) => {
    const newBook = new Book(payload);

    newBook.save(function(err, book) {
        if (err) {
            callback({ error: err, code: 503 });
        } else {
            callback(null, { data: book, code: 201 });
        }
    });
};

exports.updateBook = (payload, callback) => {
    Book.findOneAndUpdate({ _id: payload._id }, payload).exec(function (err, book) {
        if (err) {
            callback({ error: err, code: 503 });
        } else {
            callback(null, { data: book, code: 201 });
        }
    });
};
