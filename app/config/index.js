'use strict';

const config = require('./config.json');
const validation = require('./validation');

validation.validate(config, (err) => {
    if (err) {
        throw err;
    }
});

exports = module.exports = config;
