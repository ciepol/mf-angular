'use strict';

angular.module('mfAngularApp').controller('SiteCtrl', ['$rootScope', '$scope', '$routeParams', 'DataService', 'EditorDataService', function($rootScope, $scope, $routeParams, DataService, EditorDataService) {
    $scope.state = DataService.state;
    $scope.lang = 'pl_PL';

    EditorDataService.getAllData().then(function() {
        $scope.editorData = {
            widgets: EditorDataService.widgets,
            languages: EditorDataService.languages
        };
        $scope.lang = EditorDataService.currentLang;
        console.log($scope.editorData);
    });

    $scope.$on('$routeChangeSuccess', function(event, current) {
        if (typeof $routeParams.url !== 'undefined') {
            $scope.currentPage = $routeParams.url;
            $scope.lang = $routeParams.lang;
            $scope.site = DataService.site;
            $scope.title = DataService.site.pages[$scope.currentPage].name;
            //$scope.cached = DataService.cached;
        } else {
            console.log('routeParams undefined!!!!');
        }
    });

    $scope.$watchCollection('site', function(newData, oldData) {
        console.log('[SiteCtrl] watching for site changes: [oldData/newData] ----------------');
        console.log(oldData);
        console.log(newData);
        console.log('-------------------------------------------------------------------');
    });

    $scope.debugEditor = function() {
        EditorDataService.debugEditor();
    };

    $scope.loadCache = function() {
        $('#dialog_cached').remove();
        DataService.loadCache();
        //$scope.state = DataService.state;
    };
    $scope.closeCacheDialog = function() {
        $('#dialog_cached').remove();
        DataService.setCached(false);
        //$scope.state = DataService.state;
    };

    /*$scope.setLang = function(lang) {
        EditorDataService.setLang(lang);
        console.log('$scope.lang');
        console.log($scope.lang);
    }*/
}]);