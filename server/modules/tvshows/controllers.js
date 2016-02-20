'use strict';

const services = require('./services');
const responseHelper = require('../../utils/response-helper');

exports.getTvShowsList = (request, reply) => {
    services.findTvShows((err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};

exports.createTvShow = (request, reply) => {
    services.saveTvShow(request.payload, (err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};

exports.getTvShow = (request, reply) => {
    services.findOneTvShow(request.params, (err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};

exports.updateTvShow = (request, reply) => {
    services.updateTvShow(request.params, request.payload, (err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};

exports.deleteTvShow = (request, reply) => {
    services.removeTvShow(request.params, (err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};

exports.getCollectionNames = (request, reply) => {
    services.findCollectionNames((err, res) => {
        responseHelper.controllerReply(err, res, reply);
    });
};
