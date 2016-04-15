'use strict';

const responseHelper = require('../../utils/response-helper');
const MediaWiki = require('../../../my_modules/wikiSearchAPI/lib/mediaWikiApi');

exports.findByTitle = (params, callback) => {
    MediaWiki.searchByTitle(params.title, (response) => {
        if (response[0].error) {
            callback({ error: response[0].error, code: 503 });
        } else {
            callback(null, { data: response, code: 200 });
        }
    });
};

exports.findById = (params, callback) => {
    MediaWiki.searchInfoById(params.id, params.type, (response) => {
        responseHelper.serviceCallback(null, response, 200, callback);
    });
};
