'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var series = require('../../app/controllers/series.server.controller');

    // Series Routes
    app.route('/series')
        .get(users.requiresLogin, series.list)
        .post(users.requiresLogin, series.create);

    app.route('/series/:seriesId')
        .get(users.requiresLogin, series.read)
        .put(users.requiresLogin, series.update)
        .delete(users.requiresLogin, series.delete);

    app.route('/api/series/names')
        .get(users.requiresLogin, series.getCollectionNames);

    // Finish by binding the Series middleware
    app.param('seriesId', series.seriesByID);
};
