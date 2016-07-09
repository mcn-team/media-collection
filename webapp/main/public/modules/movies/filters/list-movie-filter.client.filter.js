'use strict';

angular.module('movies').filter('listMovieFilter', [
    function() {
        return function(ngRepeatItems, searchText) {
            var newMovieList = [];

            function chkSearchText(people, search) {
                for (var i = 0; i < people.length; i++) {
                    if (people[i] && angular.lowercase(people[i]).indexOf(angular.lowercase(search)) >= 0) {
                        return true;
                    }
                }
                return false;
            }

            function checkInfosItem(item, search) {
                return item && angular.lowercase(item).indexOf(angular.lowercase(search)) >= 0;
            }

            angular.forEach(ngRepeatItems, function(item) {
                if (checkInfosItem(item.title, searchText) || checkInfosItem(item.collectionName, searchText) ||
                    chkSearchText(item.actors, searchText) || chkSearchText(item.producers, searchText) ||
                    chkSearchText(item.directors, searchText) || chkSearchText(item.scenarists, searchText)) {
                    newMovieList.push(item);
                }
            });

            if (!searchText && newMovieList.length <= 0) {
                newMovieList = ngRepeatItems;
            }

            return newMovieList;
        };
    }
]);
