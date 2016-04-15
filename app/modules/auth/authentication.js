'use strict';

module.exports = function (app) {
    app.auth.scheme('ValidationLogin', require('./login-scheme'));
};
