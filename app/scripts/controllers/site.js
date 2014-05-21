'use strict';

angular.module('mfAngularApp').controller('SiteCtrl', ['$rootScope', '$scope', '$location','$routeParams', '$http', 'DataService', function($rootScope, $scope, $location, $routeParams, $http, DataService) {
    //$scope.settings = {};
    $scope.availableLanguages = {};

    //$scope.site = DataService.getSite();

    /*DataService.init().then(function(data) {
        console.log('[SiteCtrl] getting site after init()');
        $scope.site = DataService.getSite();
    });*/

    /*$http.get('/data/data.json').success(function(data) {
        $scope.site = data[0];
    }).error(function(data, status) {
        alert('Error loading data.jsnon:\ndata: ' + data + '\nstatus:' + status);
    });*/
    $http.get('/data/languages.json').success(function(data) {
        $scope.availableLanguages = data[0];
    }).error(function(data, status) {
        alert('Error loading languages.jsnon:\ndata: ' + data + '\nstatus:' + status);
    });

    /*$scope.$on('$routeChangeSuccess', function(event, current) {
        if (typeof $routeParams.url !== 'undefined') {
            $scope.site = DataService.getSite();
            console.log('route change');
            console.log($scope.site);
            $scope.settings.editorMode = $location.path().search(/\/edit\/|\/add\//) == 0;
            $scope.currentPage = $routeParams.url;
            $scope.currentLang = $routeParams.lang;
            $scope.title = $scope.site.pages[$scope.currentPage].name;
            //$scope.cached = DataService.cached;
        } else {
            console.log('routeParams undefined!!!!');
        }
    });*/

    $scope.debugSite = function() {
        $('body').append('<div id="mf-debug"><textarea>' + JSON.stringify($scope.site, null, 4) + '</textarea></div>');
        $('#mf-debug').click(function() {
            $(this).remove();
        });
        var editor = CodeMirror.fromTextArea($("#mf-debug > textarea")[0], {
            mode: "application/ld+json",
            lineWrapping: true
        });
        console.log($scope.site);
    };

    $scope.$watchCollection('site', function(newData, oldData) {
        console.log('[SiteCtrl] watching for site changes: [oldData/newData] ----------------');
        console.log(oldData);
        console.log(newData);
        console.log('-------------------------------------------------------------------');
    });


    /*$scope.state = DataService.state;
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
    };*/

    /*$scope.setLang = function(lang) {
        EditorDataService.setLang(lang);
        console.log('$scope.lang');
        console.log($scope.lang);
    }*/
}]);