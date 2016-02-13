'use strict';

const MediaWiki = require('../../../my_modules/wikiSearchAPI/lib/mediaWikiApi');

exports.findByTitle = (params, callback) => {
    const WikiApi = new MediaWiki();

    WikiApi.searchByTitle(params.title, (response) => {
        if (response[0].error) {
            callback({ error: response[0].error, code: 503 });
        } else {
            callback(null, { data: response, code: 200 });
        }
    });
};

exports.findById = (params, callback) => {
    const WikiApi = new MediaWiki();

    WikiApi.searchInfoById(params.id, params.type, (response) => {
        callback(null, { data: response, code: 200 });
    });
};
