'use strict';

const localConfig = require('./config.json');
const _ = require('lodash');
const validation = require('./validation');

let defaultConfig = {
    connections: [
        { port: 4000 }
    ],
    dbConnectionString: 'mongodb://localhost:27017/mc',
    colors: true
};

validation.validate(_.merge(defaultConfig, localConfig), (err) => {
    if (err) {
        throw err;
    }
});

module.exports = defaultConfig;
