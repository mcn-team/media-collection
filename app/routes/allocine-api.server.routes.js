'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var allocine = require('../../app/controllers/allocine-api.server.controller');

    // AlloCine Search Movie by title
    app.route('/api/allocine/search')
        .get(allocine.searchAPI);

    // AlloCine Search specific media
    app.route('/api/allocine/getMediaInfo')
        .get(allocine.getMediaInfo);
};
