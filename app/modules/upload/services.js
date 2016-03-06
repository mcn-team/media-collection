'use strict';

const fs = require('fs');
const _ = require('lodash');
const rimraf = require('rimraf');
const path = require('path');

const config = require('../../config');
const responseHelper = require('../../utils/response-helper');

exports.storeCover = (payload, callback) => {
    const filename = path.join(config.projectRoot, config.coverDirectory, payload.filename + '.jpg');

    removeFile(filename, (error) => {
        if (error) {
            return responseHelper.serviceCallback(error, {}, 204, callback);
        }
        writeFile(filename, payload.base64, (err) => {
            responseHelper.serviceCallback(err, {}, 204, callback);
        });
    });
};

var removeFile = (filename, callback) => {
    rimraf(filename, (err) => {
        callback(err);
    });
};

exports.removeFile = removeFile;

function writeFile(filename, uploadedFile, callback) {
    const imageBuffer = new Buffer(uploadedFile, 'base64');
    fs.writeFile(filename, imageBuffer, (err) => {
        callback(err);
    });
}
