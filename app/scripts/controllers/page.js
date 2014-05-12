'use strict';

angular.module('mfAngularApp').controller('PageCtrl', ['$scope', '$http', '$routeParams', '$location', 'DataService', 'ExtrasService', function ($scope, $http, $routeParams, $location,  DataService, ExtrasService) {
    $scope.editorMode = $location.path().search(/\/edit\/|\/add\//) == 0;
    $scope.currentPage = $routeParams.url;
    $scope.lang = 'pl_PL';
    //$scope.site = DataService.site;
    $scope.pages = DataService.getPages();
    //$scope.containers = DataService.getContainers();
    $scope.cached = DataService.cached;
    console.log($scope.cached);
    $scope.loaded = 1//$scope.containers.length > 0;

	console.log($scope.site);
	
    $scope.$on('site.update', function(e) {
        console.log('[PageCtrl] update check');
        console.log(DataService.site);
        //$scope.containers = DataService.getPages();
        //$scope.containers = DataService.getContainers();
        $scope.loaded = true;
    });

    $scope.addContainer = function() {
        //var position = $scope.containers.length;
        DataService.addContainer();
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
    $scope.loadCache = function() {
        $('#dialog_cached').remove();
        DataService.loadCache();
    };
    $scope.closeCacheDialog = function() {
        $('#dialog_cached').remove();
        DataService.setCached(false);
    };

    $scope.$watchCollection('site', function(newData, oldData) {
        console.log('watching for site changes: [oldData/newData] ----------------');
		console.log(oldData);
		console.log(newData);
        console.log('-------------------------------------------------------------------');
    });


    /*$scope.$watchCollection('containers', function(newData, oldData) {
        console.log('watching for containres changes: [oldData/newData] ----------------');
        console.log(oldData);
        console.log(newData);
        console.log('-------------------------------------------------------------------');
    });*/
}]);