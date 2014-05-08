'use strict';

angular.module('mfAngularApp').controller('PageCtrl', ['$scope', '$http', '$routeParams', '$location', 'DataService', 'ExtrasService', function ($scope, $http, $routeParams, $location,  DataService, ExtrasService) {
    $scope.editorMode = $location.path().search(/\/edit\/|\/add\//) == 0;
    $scope.containers = [];
    $scope.availableWidgets = [];
    $scope.page = $routeParams.url;

    $scope.lang = 'pl_PL';

    $scope.$on('site.update', function(e) {
        console.log('apdejt!!!');
        console.log(DataService.site);
        $scope.containers = DataService.getContainers();
    });
    $scope.$watch('page', function() {
        console.log('updejt - page chaned!');
        $scope.containers = DataService.getContainers();
    });

    $scope.addContainer = function() {
        var position = $scope.containers.length;
        DataService.addContainer(position);
    };

    $scope.removeContainer = function(position) {
        DataService.removeContainer(position);
    };

    $scope.removeWidget = function(containerPosition, widgetPosition) {
        DataService.removeWidget(containerPosition, widgetPosition);
    };

    $scope.saveSite = function() {
        DataService.saveSite();
    };
    $scope.loadSite = function() {
        DataService.loadSite();
    };


    $scope.$watchCollection('containers', function(newData, oldData) {
        console.log(oldData);
        console.log(newData);
        console.log('**********');
    });
}]);