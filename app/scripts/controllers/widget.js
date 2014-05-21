'use strict';

angular.module('mfAngularApp').controller('WidgetCtrl', ['$scope', '$http', '$routeParams', '$location', 'DataService', 'ExtrasService', function ($scope, $http, $routeParams, $location,  DataService, ExtrasService) {
    $scope.removeWidget = function() {
                                 //widgetIndex, containerIndex
        DataService.removeWidget($scope.$index, $scope.$parent.$index, $scope.currentPage);
    };

}]);