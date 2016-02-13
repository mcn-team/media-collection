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

exports.findLatest = (callback) => {
    Book.findOne().sort('-created').exec((err, book) => {
        if (err) {
            callback({ error: err, code: 503 });
        } else {
            callback(null, { data: book, code: 200 });
        }
    });
};

exports.findCollections = (callback) => {
    const aggregation = [{
        $group: {
            _id: "$collectionName",
            data: { $push: "$$ROOT" },
            boughtTotal: {
                $sum: {
                    $cond: { if: { $eq: [ "$bought", true ] }, then: 1, else: 0 }
                }
            },
            toBoughtTotal: {
                $sum: {
                    $cond: [ { $eq: [ "$bought", false ] }, 1, 0 ]
                }
            },
            readTotal: {
                $sum: {
                    $cond: [ { $eq: [ '$read', 'READ' ] }, 1, 0 ]
                }
            },
            notReadTotal: {
                $sum: {
                    $cond: [ { $eq: [ '$read', 'NOTREAD' ] }, 1, 0 ]
                }
            },
            onGoingTotal: {
                $sum: {
                    $cond: [ { $eq: [ '$read', 'ONGOING' ] }, 1, 0 ]
                }
            }
        }
    }];

    Book.aggregate(aggregation).exec((err, collections) => {
        if (err) {
            callback({ error: err, code: 503 });
        } else {
            callback(null, { data: collections, code: 200 });
        }
    });
};

exports.findCollectionName = (callback) => {
    const options = {
        collectionName: {
            $nin: [ null, '' ]
        }
    };
    Book.distinct('collectionName', options).exec((err, collections) => {
        if (err) {
            callback({ error: err, code: 503 });
        } else {
            callback(null, { data: collections, code: 200 });
        }
    });
};
