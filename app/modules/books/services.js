'use strict';

const Book = require('mongoose').model('Book');
const _ = require('lodash');

const responseHelper = require('../../utils/response-helper');

exports.findBooks = (callback) => {
    Book.find().sort('-created').populate('user', 'displayName').exec((err, books) => {
        responseHelper.serviceCallback(err, books, 200, callback);
    });
};

exports.findOneBook = (params, callback) => {
    Book.findOne({ _id: params.bookId }).populate('user', 'displayName').exec((err, book) => {
        responseHelper.serviceCallback(err, book, 200, callback);
    });
};

exports.saveBook = (payload, callback) => {
    const newBook = new Book(payload);

    newBook.save((err, book) => {
        responseHelper.serviceCallback(err, book, 201, callback);
    });
};

exports.updateBook = (params, payload, callback) => {
    Book.findOneAndUpdate({ _id: params.bookId }, payload).exec(function (err, book) {
        responseHelper.serviceCallback(err, _.merge(book, payload), 201, callback);
    });
};

exports.findLatest = (callback) => {
    Book.findOne().sort('-created').exec((err, book) => {
        responseHelper.serviceCallback(err, book, 200, callback);
    });
};

exports.findCollections = (callback) => {
    //try with $cond after (or before) $group
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
        responseHelper.serviceCallback(err, collections, 200, callback);
    });
};

exports.findCollectionName = (callback) => {
    const options = {
        collectionName: {
            $nin: [ null, '' ]
        }
    };

    Book.distinct('collectionName', options).exec((err, collections) => {
        responseHelper.serviceCallback(err, collections, 200, callback);
    });
};

exports.findOneCollection = (params, callback) => {
    Book.find({ collectionName: params.collection, volume: { $lt: params.volume } }).exec((err, collection) => {
        responseHelper.serviceCallback(err, collection, 200, callback);
    });
};

exports.removeBook = (params, callback) => {
    Book.findOneAndRemove({ _id: params.bookId }).exec((err, response) => {
        responseHelper.serviceCallback(err, response, 204, callback);
    });
};

exports.insertMany = (payload, callback) => {
    Book.insertMany(payload, (err, response) => {
        responseHelper.serviceCallback(err, response, 204, callback);
    });
};