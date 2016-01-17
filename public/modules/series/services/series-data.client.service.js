/**
 * Created by Kaze on 24/02/2015.
 */

'use strict';

angular.module('series').factory('SeriesDataService', ['Series',
    function (Series) {
        var dataService = {};

        function getSeasonTab(array) {
            var tab = [];

            angular.forEach(array, function (current) {
                tab.push({
                    name: current.seasonId,
                    episodes: current.episodes
                });
            });

            return tab;
        }

        function getLimitedList(array) {
            var limitedList = [];
            angular.forEach(array, function(current, idx) {
                if (idx < array.length - 1) {
                    limitedList.push(current.trim());
                }
            });
            return limitedList;
        }

        function getListLastOne(array) {
            return array.length > 0 ? array[array.length - 1].trim() : '';
        }

        function fillBaseSeriesModel(series) {
            return {
                seriesType: series.type,
                seriesName: series.series,
                seriesRate: series.seriesRate,
                seen: series.seen,
                bought: series.bought,
                seasonList: getSeasonTab(series.seasons),
                lastSeenSeason: series.lastSeenSeason || undefined,
                lastSeenEpisode: series.lastSeenEp || undefined,
                year: series.year || undefined,
                cover: series.cover || undefined,
                price: series.price || undefined,
                seriesProducersList: series.producers,
                //producer: getListLastOne(series.producers),
                seriesCreatorsList: series.creators,
                //creator: getListLastOne(series.creators),
                seriesActorsList: series.actors,
                //actor: getListLastOne(series.actors),
                channel: series.channel || undefined,
                duration: series.duration || undefined,
                summary: series.summary || undefined,
                customFields: series.customFields
            };
        }

        dataService.fillModelViewFromSeries = function (series) {
            return fillBaseSeriesModel(series);
        };

        dataService.initSeriesModel = function () {
            return {
                seriesType: 'tvshows',
                seriesRate: 7,
                seriesActorsList: [],
                seriesProducersList: [],
                seriesCreatorsList: [],
                seen: 'NOTSEEN',
                bought: true,
                customFields: []
            };
        };

        dataService.createSeriesFromModel = function (model) {

            function fillTabs(modelTab, modelField) {
                if (modelTab.length === 0 && modelField === '')
                    return undefined;
                var tab = [];
                angular.forEach(modelTab, function (current) {
                    tab.push(current);
                });
                if (modelField) {
                    tab.push(modelField);
                }
                return tab;
            }

            function fillSeasonsTab(modelSeasons) {
                var tab = [];

                angular.forEach(modelSeasons, function (current) {
                    tab.push({
                        seasonId: current.name,
                        episodes: current.episodes
                    });
                });

                return tab;
            }

            return new Series({
                type: model.seriesType ? model.seriesType : 'tvshows' ,
                series: model.seriesName,
                seriesRate: model.seriesRate || 7,
                seen: model.seen,
                bought: model.bought,
                seasons: fillSeasonsTab(model.seasonList),
                lastSeenSeason: model.lastSeenSeason || undefined,
                lastSeenEp: model.lastSeenEpisode || undefined,
                year: model.year || undefined,
                cover: model.cover || undefined,
                price: model.price || undefined,
                producers: fillTabs(model.seriesProducersList, model.producer),
                creators: fillTabs(model.seriesCreatorsList, model.creator),
                actors: fillTabs(model.seriesActorsList, model.actor),
                channel: model.channel || undefined,
                duration: model.duration || undefined,
                summary: model.summary || undefined,
                customFields: model.customFields
            });
        };

        return dataService;
    }]);
