'use strict';

const responseHelper = require('../../utils/response-helper');

exports.loadLanguageFile = (query, callback) => {
    let file = null;
    let error = null;

    try {
        file = require('./language_' + query.lang + '.json');
    } catch (err) {
        error = err;
    }

    responseHelper.serviceCallback(error, file, 200, callback);
};
