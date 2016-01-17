'use strict';

/**
 * Module dependencies.
 */
var request = require('request'),
    errorHandler = require('./errors.server.controller');

var apiFilmUrl = 'http://www.myapifilms.com/';
var trailerApiEndPoint = 'taapi?';

exports.getLastTrailer = function (req, res) {
    var myReq = apiFilmUrl + trailerApiEndPoint + 'count=' + req.query.count + '&featured=no&format=JSON';

    function regexExtract(str, delimiter) {
        var regX = new RegExp(delimiter + '(.*?)' + delimiter);

        return str.match(regX)[1];
    }

    function parseApiFilmEmbed(htmlContent) {
        var trailerLink = '';
        var htmlFragment = htmlContent.split(' ');

        htmlFragment.forEach(function (current, index) {
            if (current.indexOf('src="//v') !== -1) {
                trailerLink = regexExtract(current, '"');
                trailerLink = trailerLink.replace(/\/\//g, 'http://');
            }
        });

        return trailerLink;
    }

    request(myReq, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var responseObject = {};

            try {
                var parsedResult = JSON.parse(body);

                if (parsedResult.trailer && parsedResult.trailer.length > 0) {
                    responseObject.trailer = [];

                    parsedResult.trailer.forEach(function (current, index) {
                        responseObject.trailer[index] = {
                            link: current.link,
                            pubDate: current.pubDate,
                            title: current.title,
                            trailerLink: parseApiFilmEmbed(current.embed)
                        };
                    });
                } else {
                    responseObject.error = 'No trailer found.';
                }
            } catch (err) {
                console.error('Unable to parse lastTrailer result body as JSON', err);
            }

            res.jsonp(responseObject);
        }
    });
};
