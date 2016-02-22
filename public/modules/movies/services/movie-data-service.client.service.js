'use strict';

angular.module('movies').factory('MovieDataService', [
    'TypesMovieService', 'lodash',
    function(TypeService, _) {

        var movieServices = {};

        function pushPeopleToTab(list, item) {
            var itemsTab = [];

            angular.forEach(list, function (current) {
                itemsTab.push(current);
            });

            if (item) {
                itemsTab.push(item);
            }

            return itemsTab;
        }

        movieServices.initMovieModelLists = function(movieModel, list) {
            if (!movieModel[list]) {
                movieModel[list] = [];
            }
        };

        movieServices.initAllLists = function (model) {
            movieServices.initMovieModelLists(model, 'actorsList');
            movieServices.initMovieModelLists(model, 'producersList');
            movieServices.initMovieModelLists(model, 'directorsList');
            movieServices.initMovieModelLists(model, 'scenaristsList');
        };

        movieServices.getLimitedList = function (array) {
            var limitedList = [];

            angular.forEach(array, function(current, idx) {
                if (idx < array.length - 1) {
                    limitedList.push(current.trim());
                }
            });

            return limitedList;
        };

        movieServices.getDisplayList = function (array) {
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

        movieServices.fillMovieModel = function (movie) {
            return {
                typeList: TypeService.getTypes(),
                seen: movie.seen,
                selectedType: TypeService.getType(movie.type),
                title: movie.title,
                collectionName: movie.collectionName ? movie.collectionName : undefined,
                episode: parseInt(movie.episode) ? parseInt(movie.episode) : undefined,
                displayActors: movieServices.getDisplayList(movie.actors),
                actorsList: movieServices.getLimitedList(movie.actors),
                actor: movie.actors[movie.actors.length - 1],
                displayProducers: movieServices.getDisplayList(movie.producers),
                producersList: movieServices.getLimitedList(movie.producers),
                producer: movie.producers[movie.producers.length - 1],
                displayDirectors: movieServices.getDisplayList(movie.directors),
                directorsList: movieServices.getLimitedList(movie.directors),
                director: movie.directors[movie.directors.length - 1],
                displayScenarists: movieServices.getDisplayList(movie.scenarists),
                scenaristsList: movieServices.getLimitedList(movie.scenarists),
                scenarist: movie.scenarists[movie.scenarists.length - 1],
                releasedDate: movie.releasedDate ? new Date(movie.releasedDate) : undefined,
                duration: parseInt(movie.duration),
                price: parseFloat(movie.price),
                bought: movie.bought,
                cover: movie.cover,
                movieRate: movie.movieRate,
                customFields: movie.customFields ? movie.customFields : [],
                summary: movie.summary
            };
        };

        movieServices.createMovieFromMovieModel = function (model) {
            var actorsTab = pushPeopleToTab(model.actorsList, model.actor);
            var producersTab = pushPeopleToTab(model.producersList, model.producer);
            var directorsTab = pushPeopleToTab(model.directorsList, model.director);
            var scenaristsTab = pushPeopleToTab(model.scenaristsList, model.scenarist);

            if (!model.collectionName || model.collectionName === '') {
                model.episode = 0;
            }

            return {
                type: model.selectedType ? model.selectedType.value : '',
                title: model.title,
                collectionName: model.collectionName,
                episode: model.episode,
                actors: actorsTab,
                producers: producersTab,
                directors: directorsTab,
                scenarists: scenaristsTab,
                releasedDate: model.releasedDate,
                price: model.price || undefined,
                seen: model.seen,
                bought: model.bought,
                duration: model.duration,
                cover: model.cover,
                movieRate: model.movieRate,
                customFields: model.customFields,
                summary: model.summary
            };
        };

        function sortAsc (a, b) {
            return a - b;
        }

        function sortMovies (a, b) {
            return a.episode - b.episode;
        }

        function sortCollections (a, b) {
            return a.name > b.name ? 1 : -1;
        }

        movieServices.computeMissing = function (collections, limit) {
            collections = _.filter(collections, function (item) {
                return item._id !== null && item._id !== '';
            });
            _.forEach(collections, function (element) {
                var volumes = [];

                element.missing = 0;

                _.forEach(element.data, function (book) {
                    volumes.push(parseInt(book.episode));
                });
                volumes.sort(sortAsc);

                var max = limit || volumes[volumes.length - 1];
                for (var i = 1; i < max; i++) {
                    if (_.indexOf(volumes, i) < 0) {
                        element.missing += 1;
                        element.data.push({
                            collectionName: element._id,
                            episode: i,
                            bought: false
                        });
                    }
                }
                element.data.sort(sortMovies);
            });

            collections.sort(sortCollections);

            return collections;
        };

        return movieServices;
    }
]);
