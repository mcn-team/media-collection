/**
 * Created by Kaze on 24/02/2015.
 */

'use strict';

angular.module('books').controller('BookAutoAddController', ['$scope', '$modalInstance', 'BookData', 'Books', 'MissingVolumes',
    function ($scope, $modalInstance, BookData, Books, MissingVolumes) {
        $scope.listMissing = [];

        console.log(BookData);
        $scope.infoMedia = [
            {key: 'type', display: 'Type', checked: true},
            {key: 'authors', display: 'Auteurs', checked: true},
            {key: 'publisher', display: 'Éditeur', checked: true},
            {key: 'publishingDate', display: 'Date de publication', checked: true},
            {key: 'pageCount', display: 'Pages', checked: true},
            {key: 'price', display: 'Prix', checked: true},
            {key: 'bookRate', display: 'Note', checked: true},
            {key: 'customFields', display: 'Champs personnalisés', checked: true}
        ];
        $scope.infoStatus = {
            read: BookData.read,
            bought: BookData.bought
        };
        $scope.media = BookData;
        for (var i = 0; i < MissingVolumes.length; i++) {
            $scope.listMissing.push({
                displayName: $scope.media.collectionName + ' T. ' + MissingVolumes[i],
                volumeId: MissingVolumes[i],
                isChecked: true
            });
        }

        $scope.checkList = function (status) {
            angular.forEach($scope.listMissing, function (current) {
                current.isChecked = status !== undefined ? status : !current.isChecked;
            });
        };

        $scope.validateModal = function () {
            $scope.isUploading = true;
            angular.forEach($scope.listMissing, function (cuurent) {
                var book = new Books({
                    collectionName: $scope.media.collectionName,
                    volume: cuurent.volumeId,
                    title: '',
                    cover: '',
                    summary: '',
                    isbn: '',
                    bought: $scope.infoStatus.bought,
                    read: $scope.infoStatus.read
                });
                angular.forEach($scope.infoMedia, function (current) {
                    if (current.checked) {
                        book[current.key] = $scope.media[current.key];
                    }
                });
                book.$save(function(response) {},
                    function(errorResponse) {
                    $modalInstance.dismiss(errorResponse.data.message);
                });
            });
            $modalInstance.close();
        };

        $scope.cancelModal = function () {
            $modalInstance.dismiss();
        };
    }
]);
