'use strict';

var app = angular.module('mfAngularApp', ['ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
        when('/edit/:url/:container?/:widget?', {
            templateUrl: '/views/edit.html',
            controller: 'PageCtrl'
        }).
        when('/edit', {
            redirectTo: '/edit/home'
        }).
        when('/add/:url/:container?/:widget?', {
            templateUrl: '/views/edit.html',
            controller: 'AddCtrl'
        }).
        when('/add', {
            redirectTo: '/add/home'
        }).
        when('/:url', {
            templateUrl: '/views/page.html',
            controller: 'PageCtrl'
        }).
        otherwise({
            redirectTo: '/home'
        });

    $locationProvider.html5Mode(true);
}]);

app.service('ExtrasService', ['$rootScope', function($rootScope) {
    return {
        guid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
                function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                }
            );
        }
    };
}]);


app.service('DataService', ['$rootScope','$http', '$routeParams', 'ExtrasService', function($rootScope, $http, $routeParams, ExtrasService) {
    var dataService = {
        site: null,
        availableWidgets: null,
        getAvailableWidgets: function() {
            /* to current page */
            return this.availableWidgets;
        },
        getContainerGuid: function(page, position) {
            return this.site.pages[page].containers[position];
        },
        saveSite: function() {
            localStorage["MF"] = angular.toJson(this.site, true);
        },
        loadSite: function() {
            this.site = angular.fromJson(localStorage["MF"]);
            $rootScope.$broadcast('site.update');
        },
        getContainers: function() {
            /* to current page */
            var page = $routeParams.url;

            if (page && this.site) {
                var result = [];
                var containersIds = this.site.pages[page] ? this.site.pages[page].containers : this.site.pages.home.containers;

                var len = containersIds.length;
                for (var i = 0; i < len; i++) {
                    result.push(this.site.containers[containersIds[i]]);
                }
                return result;
            } else {
                return [];
            }
        },
        appendContainer: function(containerGuid, position) {
            /* adds to current page */
            var page = $routeParams.url;

            if (page && this.site.pages[page]) {
                // remove old position from page containers
                var oldPos = this.site.pages[page].containers.indexOf(containerGuid);
                if (oldPos > -1) {
                    this.site.pages[page].containers.splice(oldPos, 1);
                }

                //adds  new
                this.site.pages[page].containers.splice(position, 0, containerGuid);

                console.log('container added');
                console.log(this.site.pages[page].containers);
                console.log('*************');
                $rootScope.$broadcast('site.update');
            } else {
                console.log(page);
                console.error('"page" parameter error');
            }
        },
        addContainer: function(position) {
            var guid = ExtrasService.guid();
            this.site.containers[guid] = {
                "guid": guid,
                "layout": false,
                "widgets": []
            };
            this.appendContainer(guid, position);
        },
        removeContainerByGuid: function(guid) {
            //remove from all pages
            var len = this.site.pages.length;
            console.log('removing container by guid');
            console.log(this.site.pages);
            for (var page in this.site.pages) {
                console.log(page);
                console.log(this.site.pages[page].containers);
                var pos = this.site.pages[page].containers.indexOf(guid);
                if (pos > -1) {
                    this.site.pages[page].containers.splice(pos, 1);
                }
                console.log(this.site.pages[page].containers);
            }

            $rootScope.$broadcast('site.update');
        },
        removeContainer: function(position) {
            //remove from all pages
            //if layout we should do alert

            var page = $routeParams.url;
            var guid = this.site.pages[page].containers[position];
            delete this.site.containers[guid];
            this.removeContainerByGuid(guid); //removes from every page
        },
        appendWidget: function(widget, containerIndex, position) {
            var page = $routeParams.url;
            var guid = this.getContainerGuid(page, containerIndex);

            if (position > this.site.containers[guid].widgets.length) {
                //prevents holes in array
                console.error('[ADD] position bigger than array length');
                return false;
            }

            this.site.containers[guid].widgets.splice(position, 0, widget);
            $rootScope.$broadcast('site.update');
        },
        removeWidget: function(containerIndex, widgetIndex) {
            var page = $routeParams.url;

            var guid = this.getContainerGuid(page, containerIndex);
            this.site.containers[guid].widgets.splice(widgetIndex, 1);
            $rootScope.$broadcast('site.update');
        }
    };

    $http({method: 'GET', url: 'data/data.json'}).
        success(function(data, status, headers, config) {
            dataService.site = data[0];
            console.log('----------------------uu---------');
            $rootScope.$broadcast('site.update');
        });

    $http({method: 'GET', url: 'data/widgets.json'}).
        success(function(data, status, headers, config) {
            dataService.availableWidgets = data[0];
            console.log('------------------------------g----------');
            console.log(dataService.availableWidgets);
            $rootScope.$broadcast('xxx.update');
        });

    return dataService;
}]);

app.directive('container', function() {
    return {
        restrict: 'E',
        templateUrl: '/views/container.html',
        replace: true
    }
});

app.directive('widget', function() {
    return {
        restrict: 'E',
        templateUrl: '/views/widget.html',
        replace: true
    }
});

app.directive('text', function() {
    return {
        restrict: 'E',
        templateUrl: '/views/widgets/text.html',
        replace: true
    }
});
