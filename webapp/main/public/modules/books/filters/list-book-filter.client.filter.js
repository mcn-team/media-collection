'use strict';

angular.module('books').filter('listBookFilter', [
    function() {
        return function(ngRepeatItems, searchText) {
            var newBookList = [];

            function chkSearchTextInAuthors(authors, search) {
                for (var i = 0; i < authors.length; i++) {
                    if (authors[i] && angular.lowercase(authors[i]).indexOf(angular.lowercase(search)) >= 0) {
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
                    checkInfosItem(item.publisher, searchText) || chkSearchTextInAuthors(item.authors, searchText)) {

                    newBookList.push(item);
                }
            });

            if (!searchText && newBookList.length <= 0) {
                newBookList = ngRepeatItems;
            }

            return newBookList;
        };
    }
]);
