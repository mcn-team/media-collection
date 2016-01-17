/**
 * Created by matthias.brunet on 02/02/2015.
 */

'use strict';

angular.module('tv-shows').factory('TvShowsDataService', ['TvShows',
    function (TvShows) {
        var dataService = {};

        dataService.getLimitedList = function (array) {
            var limitedList = [];
            angular.forEach(array, function(current, idx) {
                if (idx < array.length - 1) {
                    limitedList.push(current.trim());
                }
            });
            return limitedList;
        };

        dataService.getListLastOne = function (array) {
            return array.length > 0 ? array[array.length - 1].trim() : '';
        };

        dataService.getDisplayList = function (array) {
            if (!array || array.length === 0) {
                return '';
            }
            var displayList = '';

            angular.forEach(array, function (item) {
                if (displayList !== '' && item)
                    displayList += ', ';
                displayList += item;
            });

            return displayList;

        };

        function fillBaseTvShowModel(tvShow) {
            return {
                _id: tvShow._id,
                name: tvShow.tvShowName,
                season: tvShow.season,
                episodes: tvShow.episodes,
                partial: tvShow.partial,
                lastSeen: tvShow.lastSeen,
                seen: tvShow.seen,
                bought: tvShow.bought,
                price: parseFloat(tvShow.price),
                cover: tvShow.cover,
                channel: tvShow.channel,
                duration: tvShow.duration,
                year: tvShow.year,
                tvShowRate: tvShow.tvShowRate,
                customFields: tvShow.customFields ? tvShow.customFields : [],
                summary: tvShow.summary
            };
        }

        dataService.fillModelFromModal = function (item) {
            return {
                name: item.title || item.originalTitle,
                summary: item.summary,
                duration: item.duration,
                year: item.releaseDate,
                cover: item.coverHref,
                actorsList: item.actors ? dataService.getLimitedList(item.actors) : [],
                actor: item.actors ? dataService.getListLastOne(item.actors) : undefined,
                producersList: item.producers ? dataService.getLimitedList(item.producers) : [],
                producer: item.producers ? dataService.getListLastOne(item.producers) : undefined,
                creatorsList: item.scenarists ? dataService.getLimitedList(item.scenarists) : [],
                creator: item.scenarists ? dataService.getListLastOne(item.scenarists) : undefined,
                seen: 'SEEN',
                custom: {},
                bought: true
            };
        };

        dataService.fillLightTvSHowModel = function (tvShow) {
            var model = fillBaseTvShowModel(tvShow);
            model.producers = dataService.getDisplayList(tvShow.producers);
            model.actors = dataService.getDisplayList(tvShow.actors);
            return model;
        };

        dataService.fillCreateTvShowModel = function (tvShow) {
            var model = fillBaseTvShowModel(tvShow);

            model.producersList = dataService.getLimitedList(tvShow.producers);
            model.producer = dataService.getListLastOne(tvShow.producers);
            model.creatorsList = dataService.getLimitedList(tvShow.creators);
            model.creator = dataService.getListLastOne(tvShow.creators);
            model.actorsList = dataService.getLimitedList(tvShow.actors);
            model.actor = dataService.getListLastOne(tvShow.actors);

            return model;
        };

        dataService.fillViewTvShowModel = function (tvShow) {
            var model = fillBaseTvShowModel(tvShow);

            model.producers = dataService.getDisplayList(tvShow.producers);
            model.creators = dataService.getDisplayList(tvShow.creators);
            model.actors = dataService.getDisplayList(tvShow.actors);
            model.price = tvShow.price ? model.price.toFixed(2) : null;

            return model;
        };

        dataService.createTvShowFromModel = function (model) {

            function fillTabs(modelTab, modelField) {
                var tab = [];
                angular.forEach(modelTab, function (current) {
                    tab.push(current);
                });
                if (modelField) {
                    tab.push(modelField);
                }
                return tab;
            }

            return new TvShows ({
                tvShowName: model.name,
                season: model.season,
                episodes: model.episodes,
                partial: model.partial,
                lastSeen: model.lastSeen,
                seen: model.seen,
                bought: model.bought,
                price: model.price,
                producers: fillTabs(model.producersList, model.producer),
                creators: fillTabs(model.creatorsList, model.creator),
                actors: fillTabs(model.actorsList, model.actor),
                cover: model.cover,
                channel: model.channel,
                duration: model.duration,
                year: model.year,
                tvShowRate: model.tvShowRate,
                customFields: model.customFields,
                summary: model.summary
            });
        };

        return dataService;
}]);
