'use strict';

angular.module('movies').factory('MovieDataService', ['TypesMovieService', 'Movies',
    function(TypeService, Movies) {

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

            return movieModel;
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
                releasedDate: movie.releasedDate ? movie.releasedDate.split('T')[0] : undefined,
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

            return new Movies ({
                type: model.selectedType ? model.selectedType.value : '',
                title: model.title,
                collectionName: model.collectionName,
                episode: model.episode,
                actors: actorsTab,
                producers: producersTab,
                directors: directorsTab,
                scenarists: scenaristsTab,
                releasedDate: model.releasedDate,
                price: model.price,
                seen: model.seen,
                bought: model.bought,
                duration: model.duration,
                cover: model.cover,
                movieRate: model.movieRate,
                customFields: model.customFields,
                summary: model.summary
            });
        };

        return movieServices;
    }
]);
