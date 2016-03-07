'use strict';

let langs = {};

exports = module.exports = () => {
    const glob = require('glob');
    const _ = require('lodash');

    glob(__dirname + '/language_*.json', {}, (err, files) => {
        _.forEach(files, (elem) => {
            const filename = elem.split('/')[elem.split('/').length - 1];
            langs[filename.split(/_|\./)[1]] = require('./' + filename);
        });
    });
};

exports.langs = langs;
