'use strict';

const Joi = require('joi');

const configSchema = {
    connections: Joi.array().min(1).items(Joi.object({ port: Joi.number().min(1025).max(65535).required() }).required()),
    dbConnectionString: Joi.string().regex(/^mongodb:\/\/[a-z]+[:][0-9]+\/.+/).required(),
    color: Joi.boolean(),
    secretJWT: Joi.string().required(),
    clientPath: Joi.string()
};

exports.validate = (config, callback) => {
    Joi.validate(config, configSchema, { allowUnknown: true }, (err, value) => {
        return callback(err, value);
    });
};
