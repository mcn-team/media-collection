'use strict';

const langs = require('./lang');
const responseHelper = require('../../utils/response-helper');

exports.loadLanguageFile = (params, callback) => {
    responseHelper.serviceCallback(null, langs.langs[params.lang], 200, callback);
};
