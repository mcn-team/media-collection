'use strict';

const rsa = require('node-rsa');

const config = require('../../config');
const responseHelper = require('../../utils/response-helper');
const key = new rsa({ b: config.rsaSize }, 'pkcs8', { encryptionScheme: 'pkcs1' });

exports.retrievePublicKey = (callback) => {
    return responseHelper.serviceCallback(null, { pub: key.exportKey('public') }, 200, callback);
};

exports.decrypt = (data) => {
    return key.decrypt(data, 'utf8');
};
