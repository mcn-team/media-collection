'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var series = require('../../app/controllers/series.server.controller');

    // Series Routes
    app.route('/series')
        .get(series.list)
        .post(series.create);

    app.route('/series/:seriesId')
        .get(series.read)
        .put(series.update)
        .delete(series.delete);

    app.route('/api/series/names')
        .get(series.getCollectionNames);

    // Finish by binding the Series middleware
    app.param('seriesId', series.seriesByID);
};
