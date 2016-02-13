'use strict';


module.exports = (server) => {
    const loadModules = (module) => {
        server.register(module.module, module.options);
        console.log(module.module.register.attributes.name + ' module loaded');
    };

    const users = require('../modules/users');
    const books = require('../modules/books');
    const googleBookApi = require('../modules/google-book-api');
    const wikipediaApi = require('../modules/wikipedia-api');

    loadModules(users);
    loadModules(books);
    loadModules(googleBookApi);
    loadModules(wikipediaApi);
};
