'use strict';

require('./init-database');

module.exports = (server) => {
    require('./init-modules')(server);
};

