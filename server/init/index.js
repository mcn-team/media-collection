'use strict';

require('./init-database');

module.exports = (server) => {
    require('./init-server')(server);
    require('./init-auth')(server);
    require('./init-modules')(server);
};
