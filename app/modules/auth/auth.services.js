'use strict';

const rsa = require('node-rsa');

const config = require('../../config');
const responseHelper = require('../../utils/response-helper');
const key = new rsa().generateKeyPair(config.rsaSize);

exports.retrievePublicKey = (callback) => {
    return responseHelper.serviceCallback(null, { pub: key.exportKey('public') }, 200, callback);
};
