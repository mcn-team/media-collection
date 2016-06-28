'use strict';

module.exports = function (app) {
    app.auth.scheme('ValidationLogin', require('./login-scheme'));
    app.auth.scheme('LoginStrict', require('./login-strict-scheme'));
    app.auth.scheme('ValidationRecovery', require('./recovery-scheme'));
};
