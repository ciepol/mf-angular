'use strict';

angular.module('mfAngularApp').controller('ContainerCtrl', ['$scope', '$http', '$routeParams', '$location', 'DataService', 'ExtrasService', function ($scope, $http, $routeParams, $location,  DataService, ExtrasService) {
    //console.log('$scope in ContainerCtrl');
    //console.log($scope);
    
    /*this.addWidget = function(widget, position) {
        position = position || $scope.widgets.length;
        DataService.appendWidget();
    };*/
    $scope.removeContainer = function() {
        DataService.removeContainer($scope.$index, $scope.currentPage);
    };

    $scope.setAsCustomContainer = function() {
        if (confirm('If you set container as page container all widgets will be removed.\nYou sure you wanna proceed?')) {
            DataService.setAsCustomContainer($scope.$index, $scope.currentPage);
        }
    };

    $scope.switchRow= function() {
        DataService.setRow(!$scope.container.row, $scope.$index, $scope.currentPage);
    };
}]);