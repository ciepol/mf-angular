'use strict';

angular.module('mfAngularApp').controller('AddCtrl', ['$scope', '$http', '$routeParams', '$location', 'DataService', 'ExtrasService', function ($scope, $http, $routeParams, $location, DataService, ExtrasService) {
    //$scope.currentPage = $routeParams.url;
    $scope.editorMode = true;
    $scope.addMode = true;
    $scope.addType = 'page';
    //$scope.pages = DataService.getPages();

    $scope.widgets = [];

    $http({method: 'GET', url: '/data/widgets.json'}).
        success(function(data, status, headers, config) {
            console.log('---http-----');
            $scope.widgets = data;
            console.log($scope.widgets)
        });

    $scope.addWidget = function(newWidgetIndex) {
        var containerId = $routeParams.container;
        var position = $routeParams.widget;
        console.log('adding widget: ' + newWidgetIndex);
        console.log('to container: ' + containerId);

        var prototype = $scope.widgets[newWidgetIndex];

        var widget = {
            "type": prototype.type
        };
        for (var l in $scope.site.languages) {
            widget[$scope.site.languages[l]] = prototype.langs;
        };

        angular.extend(widget, prototype.params);
        console.log(widget);
        DataService.appendWidget(widget, containerId, position);
        console.log('xx');
        $location.path('edit/' + $routeParams.lang + '/' + $routeParams.url);
        console.log('xx');
    };

    switch (Object.keys($routeParams).length) {
        case 2:
            //adding page after url
            //$scope.addType = 'page'; //already set
            break;
        case 3:
            //adding container at given position
            $scope.addType = 'container';
            break;
        case 4:
            //adding widget at given position
            $scope.addType = 'widget';
            break;
        default:
            console.error('[ADD] wrong params!!');
    }
}]);
