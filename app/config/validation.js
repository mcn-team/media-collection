'use strict';

const Joi = require('joi');

const fileSchema = {
    relativeTo: Joi.string().required()
};

const corsSchema = {
    origin: Joi.array().min(1).items(Joi.string()).required(),
    additionalHeaders: Joi.array().min(1).items(Joi.string()).optional()
};

const routeSchema = {
    files: Joi.object(fileSchema).required(),
    cors: Joi.object(corsSchema).optional()
};

const connectionSchema = {
    host: Joi.string().required(),
    port: Joi.number().min(1025).max(65535).required(),
    labels: Joi.array().min(1).required(),
    routes: Joi.object(routeSchema).required()
};

const configSchema = {
    connections: Joi.array().min(1).items(Joi.object(connectionSchema).required()),
    projectRoot: Joi.string().required(),
    coverDirectory: Joi.string().required(),
    dbLogin: Joi.string().required(),
    dbPassword: Joi.string().required(),
    dbConnectionString: Joi.string().regex(/^.+[:][0-9]+\/.+/).required(),
    colors: Joi.boolean().required(),
    logRoute: Joi.boolean().required(),
    logFiles: Joi.boolean().required(),
    secretJWT: Joi.string().required(),
    clientPath: Joi.string().required(),
    rsaSize: Joi.number().allow(64, 128, 256, 512, 1024, 2048)
};

exports.validate = (config, callback) => {
    Joi.validate(config, configSchema, { allowUnknown: false }, (err, value) => {
        return callback(err, value);
    });
};
