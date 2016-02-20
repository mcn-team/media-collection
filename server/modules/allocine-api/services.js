'use strict';

const allocine = require('allocine-api');

const responseHelper = require('../../utils/response-helper');

exports.searchByName = (params, callback) => {
    allocine.api('search', { q: params.name, count: 20, filter: params.type }, (err, result) => {
        responseHelper.serviceCallback(err, { result: result.feed[params.type], filter: params.type }, 200, callback);
    });
};

exports.findById = (params, callback) => {
    allocine.api(params.type, { code: params.id }, (err, result) => {
        responseHelper.serviceCallback(err, { result: result[params.type], filter: params.type }, 200, callback);
    });
};
