'use strict';

const langs = require('./lang');
const responseHelper = require('../../utils/response-helper');

exports.loadAllFiles = (callback) => {
    responseHelper.serviceCallback(null, langs.langs, 200, callback);
};
