'use strict';

const fs = require('fs');
const _ = require('lodash');
const rimraf = require('rimraf');
const path = require('path');

const config = require('../../config');
const responseHelper = require('../../utils/response-helper');

exports.storeCover = (payload, params, callback) => {
    const ext = getExtensionName(payload.file.hapi.filename);
    const filename = path.join(config.projectRoot, config.coverDirectory, params.mediaId) + '.' + ext;

    removeFile(filename, (error) => {
        if (error) {
            return responseHelper.serviceCallback(error, {}, 204, callback);
        }
        writeFile(filename, payload.file, (err) => {
            responseHelper.serviceCallback(err, {}, 204, callback);
        });
    });
};

function removeFile(filename, callback) {
    rimraf(filename, (err) => {
        callback(err);
    });
}

function writeFile(filename, uploadedFile, callback) {
    const file = fs.createWriteStream(filename);

    callback = _.once(callback);

    file.on('error', (err) => {
        callback(err);
    });

    uploadedFile.pipe(file);

    uploadedFile.on('end', () => {
        callback();
    });
}

function getExtensionName(fileName) {
    const splitName = fileName.split('.');
    return splitName[splitName.length - 1];
}
