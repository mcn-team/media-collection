'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var lang = require('../../app/controllers/lang.server.controller');

    app.route('/lang')
        .get(lang.getLang);
};
