/**
 * Created by Kaze on 07/02/2015.
 */

'use strict';

angular.module('tv-shows').filter('listShowsFilter', [
    function () {
        return function (ngRepeatItems, searchText) {
            var newList = [];

            function chkSearchTextInList(list) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i] && angular.lowercase(list[i]).indexOf(angular.lowercase(searchText)) >= 0) {
                        return true;
                    }
                }
                return false;
            }

            function checkInfosItem(item) {
                return item && angular.lowercase(item).indexOf(angular.lowercase(searchText)) >= 0;
            }

            angular.forEach(ngRepeatItems, function(item) {
                if (checkInfosItem(item.tvShowName) || chkSearchTextInList(item.producers) || chkSearchTextInList(item.actors)) {
                    newList.push(item);
                }
            });

            if (!searchText && newList.length <= 0)
                newList = ngRepeatItems;
            return newList;
        };
    }
]);
