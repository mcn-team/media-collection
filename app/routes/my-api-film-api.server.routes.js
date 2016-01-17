'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var myApiFilm = require('../../app/controllers/my-api-film-api.server.controller');

    app.route('/api/myApiFilm/latestTrailer')
        .get(users.requiresLogin, myApiFilm.getLastTrailer);
};
