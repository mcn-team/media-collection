/**
 * Created by Kaze on 04/03/2015.
 */

'use strict';

angular.module('wikipedia-api').controller('ApiSearchModalController', ['$scope', '$modalInstance', 'WikipediaExposed',
        'WikipediaChoices',
        function ($scope, $modalInstance, WikipediaExposed, WikipediaChoices) {
            $scope.choices = WikipediaChoices;

            $scope.selectedModel = {};

            $scope.choiceList = {
                title: { list: [], isChecked: true },
                authorsList: { list: [], isChecked: true },
                publisher: { list: [], isChecked: true },
                collectionName: { list: [], isChecked: true },
                pageCount: { list: [], isChecked: true },
                isbn: { list: [], isChecked: true },
                creatorsList: { list: [], isChecked: true },
                producersList: { list: [], isChecked: true },
                actorsList: { list: [], isChecked: true },
                channel: { list: [], isChecked: true },
                date: { list: [], isChecked: true }
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
                WikipediaExposed.searchById({ typeSearch: 'books', toSearch: item.pageId}).$promise.then(function (result) {
                    makeList(result);
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
                $modalInstance.close($scope.selectedModel);
            };

            $scope.cancelModal = function () {
                $modalInstance.dismiss('cancel');
            };
        }
    ]
);
