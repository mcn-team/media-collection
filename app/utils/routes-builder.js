'use strict';

const _ = require('lodash');

const Route = function () {
    this.route = {};

    this.initConfig = () => {
        this.route.config = {};
    };

    this.initValidate = () => {
        if (!this.route.config) { this.initConfig() }
        this.route.config.validate = {};
    };

    this.initNotes = () => {
        if (!this.route.config) { this.initConfig() }
        this.route.config.notes = [];
    };

    this.method = (method) => {
        this.route.method = method;
        return this;
    };

    this.path = (path) => {
        this.route.path = path;
        return this;
    };

    this.handler = (handler) => {
        this.route.handler = handler;
        return this;
    };

    this.auth = (auth) => {
        if (!this.route.config) { this.initConfig() }
        this.route.config.auth = auth;
        return this;
    };

    this.validateParams = (validator) => {
        if (!this.route.config || !this.route.config.validate) { this.initValidate() }
        this.route.config.validate.params = validator;
        return this;
    };

    this.validatePayload = (validator) => {
        if (!this.route.config || !this.route.config.validate) { this.initValidate() }
        this.route.config.validate.payload = validator;
        return this;
    };

    this.notes = (note) => {
        if (!this.route.config || !this.route.config.notes) { this.initNotes() }
        this.route.config.notes.push(note);
        return this;
    };

    this.description = (desc) => {
        if (!this.route.config) { this.initConfig() }
        this.route.config.description = desc;
        return this;
    };

    this.build = () => {
        return this.route;
    }
};

exports = module.exports = () => {
    return new Route();
};
