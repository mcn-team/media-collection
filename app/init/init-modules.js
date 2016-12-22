'use strict';

const options = require('./plugins-options');

module.exports = (server) => {
    server.register(require('inert'), onError);
    server.register(require('vision'), onError);
    server.register({ register: require('lout') }, onError);
    server.register(require('../modules/static-files'), onError);
    server.register(require('../modules/auth'), options.auth, onError);
    server.register(require('../modules/users'), options.users, onError);
    server.register(require('../modules/books'), options.books, onError);
    server.register(require('../modules/authors'), options.authors, onError);
    server.register(require('../modules/movies'), options.movies, onError);
    server.register(require('../modules/upload'), options.upload, onError);
    server.register(require('../modules/google-book-api'), options.googleBookApi, onError);
    server.register(require('../modules/wikipedia-api'), options.wikipediaApi, onError);
    server.register(require('../modules/allocine-api'), options.allocineApi, onError);
    server.register(require('../modules/amazon-search'), options.amazonSearch, onError);
};

const onError = (err) => {
    if (err) {
        throw err;
    }
};
