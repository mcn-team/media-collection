'use strict';

/**
 * Module dependencies.
 */
var allocine = require('allocine-api'),
    errorHandler = require('./errors.server.controller');


function cleanACSearch(tabResult, reqType) {
    //console.log(tabResult);

    var cleanedACResponse = [];

    tabResult.forEach(function (current, index) {

        cleanedACResponse[index] = {
            code: current.code,
            title: current.title || '',
            originalTitle: current.originalTitle || '',
            prodYear: current.productionYear || '',
            releaseDate: current.release ? current.release.releaseDate : '1970-01-01',
            directors: current.castingShort && current.castingShort.directors ? current.castingShort.directors.trim().split(',') : [],
            actors: current.castingShort && current.castingShort.actors ? current.castingShort.actors.trim().split(',') : [],
            producers: current.castingShort && current.castingShort.producers ? current.castingShort.producers.trim().split(',') : [],
            scenarists: current.castingShort && current.castingShort.scenarists ? current.castingShort.scenarists.trim().split(',') : [],
            movieCertificate: current.movieCertificate ? current.movieCertificate.certificate.$ : '',
            coverHref: current.poster ? current.poster.href : '',
            summary: '',
            shortSummary: ''
        };

        if (reqType === 'tvseries') {
            cleanedACResponse[index].scenarists = current.castingShort && current.castingShort.creators ? current.castingShort.creators.trim().split(',') : [];
            cleanedACResponse[index].releaseDate = current.yearStart ? current.yearStart : '1970';
        }
    });

    return cleanedACResponse;
}

function cleanMediaInfo(results, mediaType) {
    //console.log('In clean Media Info');
    //console.log(results);

    var producers = [];

    var cleanedMediaInfo = {
        summary: results.synopsis || '',
        shortSummary: results.synopsisShort || ''
    };

    /*
     results.castMember.forEach(function (current, index) {
     if (current.activity.$.match(/^product(eur|rice)$/i)) {
     producers.push(current.person.name);
     }
     });*/

    if (mediaType === 'tvseries') {
        cleanedMediaInfo.duration = results.formatTime;
        cleanedMediaInfo.seasonCount = results.seasonCount;
        cleanedMediaInfo.episodeCount = results.episodeCount;

    } else if (mediaType === 'movie') {
        var scenarists = [];

        results.castMember.forEach(function (current, index) {
            if (current.activity.$.match(/^product(eur|rice)$/i)) {
                producers.push(current.person.name);
            } else if (current.activity.$.match(/scénariste/i)) {
                scenarists.push(current.person.name);
            }
        });

        cleanedMediaInfo.producers = producers;
        cleanedMediaInfo.scenarists = scenarists;
        cleanedMediaInfo.duration = results.runtime ? results.runtime / 60 : 0;
    }

    return cleanedMediaInfo;
}

exports.getMediaInfo = function(req, res) {
    allocine.api(req.query.mediaType, { code: req.query.code }, function(error, results) {

            console.log('Code is : %s\n', req.query.code);
            res.jsonp(cleanMediaInfo(results[req.query.mediaType], req.query.mediaType));
        }
    );
};

exports.searchAPI = function(req, res) {
    allocine.api('search', { q: req.query.toSearch, count: req.query.count, filter: req.query.filter}, function(error, results) {

            if (results.feed[req.query.filter]) {
                console.log('Search is : %s\nFilter is : %s\nCount is : %s\nResult count is : %s', req.query.toSearch, req.query.filter, req.query.count, results.feed[req.query.filter].length);
                res.jsonp(cleanACSearch(results.feed[req.query.filter], req.query.filter));
            } else {
                console.log('No match found for research : %s', req.query.toSearch);
                res.jsonp([
                    {
                        error: 'nomatch',
                        searchReq: req.query.toSearch
                    }
                ]);
            }
        }
    );
};

/**
 * AlloCine API authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    /*if (req.movie.user.id !== req.user.id) {
     return res.status(403).send('User is not authorized');
     }*/
    next();
};
