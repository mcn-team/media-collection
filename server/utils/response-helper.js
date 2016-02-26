'use strict';

/**
 * Common reply used by controllers after services return
 * @param err Object containing the error build by the service
 * @param res Response object build by the service
 * @param reply HAPI Reply wrapper object
 * @returns {*}
 */
exports.controllerReply = (err, res, reply) => {
    let content = null;
    let code = null;

    if (err) {
        content = err.error;
        code = err.code;
    } else {
        content = res.code !== 204 ? res.data : null;
        code = res.code;
    }

    return reply(content).code(code);
};

/**
 * Common services reply after a query to the database
 * @param err Mongoose error object
 * @param response Mongoose response object containing the data
 * @param code HTTP response code if the query succeed
 * @param callback Controller callback
 */
exports.serviceCallback = (err, response, code, callback) => {
    let error = null;
    let content = null;

    if (err) {
        error = { error: err, code: 503 };
    } else if (!response) {
        content = { data: { message: 'No content matching or incorrect arguments' }, code: 204 };
    } else {
        content = { data: response, code: code };
    }

    callback(error, content);
};
