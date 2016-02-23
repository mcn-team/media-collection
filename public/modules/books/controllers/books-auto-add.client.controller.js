/**
 * Created by Kaze on 24/02/2015.
 */

'use strict';

angular.module('books').controller('BookAutoAddController', [
    '$scope', '$uibModalInstance', 'lodash', 'BookData', 'MissingVolumes', 'BookServices',
    function ($scope, $uibModalInstance, _, BookData, MissingVolumes, BookServices) {
        $scope.listMissing = [];

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

        _.forEach(MissingVolumes, function (element) {
            $scope.listMissing.push({
                displayName: element.collectionName + ' T. ' + element.volume,
                volumeId: element.volume,
                isChecked: true
            });
        });

        $scope.checkList = function (status) {
            angular.forEach($scope.listMissing, function (current) {
                current.isChecked = status !== undefined ? status : !current.isChecked;
            });
        };

        $scope.validateModal = function () {
            $scope.isUploading = true;
            var payload = [];
            angular.forEach($scope.listMissing, function (cuurent) {
                var book = {
                    collectionName: $scope.media.collectionName,
                    volume: cuurent.volumeId,
                    title: '',
                    cover: '',
                    summary: '',
                    isbn: '',
                    bought: $scope.infoStatus.bought,
                    read: $scope.infoStatus.read
                };

                angular.forEach($scope.infoMedia, function (current) {
                    if (current.checked) {
                        book[current.key] = $scope.media[current.key];
                    }
                });

                payload.push(book);
            });

            BookServices.multipleAdd(payload).then(function (response) {}, function (errorResponse) {
                $uibModalInstance.dismiss(errorResponse);
            });

            $uibModalInstance.close();
        };

        $scope.cancelModal = function () {
            $uibModalInstance.dismiss();
        };
    }
]);
