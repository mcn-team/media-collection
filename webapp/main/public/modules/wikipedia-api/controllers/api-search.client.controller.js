/**
 * Created by Kaze on 04/03/2015.
 */

'use strict';

angular.module('wikipedia-api').controller('ApiSearchModalController', [
    '$scope', '$uibModalInstance',
    'BookServices', 'WikipediaChoices',
    function ($scope, $uibModalInstance, BookServices, WikipediaChoices) {
        $scope.choices = WikipediaChoices;

        $scope.selectedModel = {};

        $scope.choiceList = {
            title: { list: [], isChecked: true, name: 'Titre' },
            authorsList: { list: [], isChecked: true, name: 'Auteurs' },
            publisher: { list: [], isChecked: true, name: 'Éditeur' },
            collectionName: { list: [], isChecked: true, name: 'Collection' },
            pageCount: { list: [], isChecked: true, name: 'Pages' },
            isbn: { list: [], isChecked: true, name: 'ISBN' },
            creatorsList: { list: [], isChecked: true, name: 'Créateurs' },
            producersList: { list: [], isChecked: true, name: 'Producteurs' },
            actorsList: { list: [], isChecked: true, name: 'Acteurs' },
            channel: { list: [], isChecked: true, name: 'Chaine' },
            date: { list: [], isChecked: true, name: 'Date' }
        };


        function makeList(result) {
            angular.forEach(Object.keys($scope.choiceList), function (current) {
                if (result.hasOwnProperty(current)) {
                    if (current.indexOf('List') !== -1 || current === 'isbn') {
                        $scope.choiceList[current].list.push(result[current]);
                    } else {
                        $scope.choiceList[current].list = result[current];
                    }
                    $scope.selectedModel[current] = $scope.choiceList[current].list[0];
                } else {
                    delete $scope.choiceList[current];
                }
            });
        }

        $scope.selectChoice = function (item) {
            $scope.selectedChoice = item;
            $scope.isSelected = true;

            BookServices.wikiSearchById(item.pageId).then(function (response) {
                makeList(response.data);
                $scope.isLoaded = true;
            });
        };

        $scope.validateModal = function () {
            angular.forEach(Object.keys($scope.choiceList), function (current) {
                if (!$scope.choiceList[current].isChecked) {
                    delete $scope.selectedModel[current];
                }
            });
            if ($scope.selectedModel.pageCount) {
                $scope.selectedModel.pageCount = Number($scope.selectedModel.pageCount);
            }
            $uibModalInstance.close($scope.selectedModel);
        };

        $scope.cancelModal = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
