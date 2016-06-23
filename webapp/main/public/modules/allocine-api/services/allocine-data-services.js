'use strict';

angular.module('allocine-api').factory('AllocineDataService', [
    function () {
        var allocineData = {};

        allocineData.formatSearchResult = function (data) {
            var cleanedACResponse = [];

            if (!data || !data.result) {
                return null;
            }

            data.result.forEach(function (current, index) {

                cleanedACResponse[index] = {
                    code: current.code,
                    title: current.title || '',
                    originalTitle: current.originalTitle || '',
                    prodYear: current.productionYear || '',
                    releaseDate: current.release ? new Date(current.release.releaseDate) : undefined,
                    directors: current.castingShort && current.castingShort.directors ? current.castingShort.directors.trim().split(',') : [],
                    actors: current.castingShort && current.castingShort.actors ? current.castingShort.actors.trim().split(',') : [],
                    producers: current.castingShort && current.castingShort.producers ? current.castingShort.producers.trim().split(',') : [],
                    scenarists: current.castingShort && current.castingShort.scenarists ? current.castingShort.scenarists.trim().split(',') : [],
                    movieCertificate: current.movieCertificate ? current.movieCertificate.certificate.$ : '',
                    coverHref: current.poster ? current.poster.href : '',
                    summary: '',
                    shortSummary: ''
                };

                if (data.filter === 'tvseries') {d
                    cleanedACResponse[index].scenarists = current.castingShort && current.castingShort.creators ? current.castingShort.creators.trim().split(',') : [];
                    cleanedACResponse[index].releaseDate = current.yearStart ? current.yearStart : '1970';
                }
            });

            return cleanedACResponse;
        };

        allocineData.formatFindResult = function (data) {
            var producers = [];

            var cleanedMediaInfo = {
                summary: data.result.synopsis || '',
                shortSummary: data.result.synopsisShort || ''
            };

            if (data.filter === 'tvseries') {
                cleanedMediaInfo.duration = data.result.formatTime;
                cleanedMediaInfo.seasonCount = data.result.seasonCount;
                cleanedMediaInfo.episodeCount = data.result.episodeCount;

            } else if (data.filter === 'movie') {
                var scenarists = [];

                data.result.castMember.forEach(function (current, index) {
                    if (current.activity.$.match(/^product(eur|rice)$/i)) {
                        producers.push(current.person.name);
                    } else if (current.activity.$.match(/scénariste/i)) {
                        scenarists.push(current.person.name);
                    }
                });

                cleanedMediaInfo.producers = producers;
                cleanedMediaInfo.scenarists = scenarists;
                cleanedMediaInfo.duration = data.result.runtime ? data.result.runtime / 60 : 0;
            }

            return cleanedMediaInfo;
        };

        return allocineData;
    }
]);
