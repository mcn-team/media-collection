'use strict';

module.exports = {
//    db: 'mongodb://localhost/mediacollection-dev',
    db: 'mongodb://meanproj:m34npr0j@dogen.mongohq.com:10003/mean-db-test',
    app: {
        title: 'MediaCollection - Development Environment'
    },

    mailer: {
        from: process.env.MAILER_FROM || 'MAILER_FROM',
        options: {
            service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
            auth: {
                user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
                pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
            }
        }
    }
};
