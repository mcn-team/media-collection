'use strict';

const Author = require('mongoose').model('Author');

const bookServices = require('../books/services');
const responseHelper = require('../../utils/response-helper');

exports.findAuthorsList = (callback) => {
    Author.find().sort('name').exec((err, authors) => {
        responseHelper.serviceCallback(err, authors, 200, callback);
    });
};

exports.removeAuthorsList = (callback) => {
    Author.remove({}).exec((err, authors) => {
        responseHelper.serviceCallback(err, authors, 204, callback);
    });
};

exports.compileAuthorsList = (callback) => {
    bookServices.findAuthorsName((err, content) => {
        responseHelper.serviceCallback(err, content.data, 201, callback);
    });
};
