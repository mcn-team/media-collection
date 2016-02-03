'use strict';

module.exports = (server) => {
    server.register(require('../modules/users').module, require('../modules/users').options);
};
