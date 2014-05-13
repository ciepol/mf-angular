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


app.factory('DataService', ['$rootScope','$http', '$routeParams', '$q', '$window', 'ExtrasService', function($rootScope, $http, $routeParams, $q, $window, ExtrasService) {
    var self = this;
    var _loadFromLocalStorage = function(name) {
        var s = angular.fromJson(localStorage[name]);
		console.log('loaded form local storage');
        return [s.pages, s.css, s.containers];
    };
	var _updateSiteVar = function(paramsArray) {
		if (!dataService.site) {dataService.site = {}}
		dataService.site.pages = paramsArray[0];
		dataService.site.css = paramsArray[1];
		dataService.site.containers = paramsArray[2];
		console.log('updatd site var');
		console.log(dataService.site);
	};
    var dataService = {
        site: null,
        availableWidgets: null,
        state: {
            cached: false
        },
        getAvailableWidgets: function() {
            /* to current page */
            return this.availableWidgets;
        },
        getContainerGuid: function(page, position) {
            return this.site.pages[page].containers[position];
        },
        debugSite: function() {
          console.log(this.site);
        },
        saveSite: function() {
            localStorage["MF"] = angular.toJson(this.site, true);
            localStorage.removeItem("MF-CACHE");
        },
        loadSite: function() {
            //console.log(this.site);
            var s = _loadFromLocalStorage('MF');
            //console.log(this.site);
			_updateSiteVar(s);
            //console.log(this.site);

            //this.site = angular.fromJson(localStorage["MF"]);
            //$rootScope.$broadcast('site.update');
        },
        loadCache: function() {
            var s = _loadFromLocalStorage('MF-CACHE');
            _updateSiteVar(s);
            //this.site = angular.fromJson(localStorage["MF-CACHE"]);
            this.setCached(false);
            //$rootScope.$broadcast('site.update');
        },
        setCached: function(bool) {
            this.state.cached = bool;
        },
        getSite: function() {
            // returns promise only because we want to know when JSON data from http is ready
            // doesn't matter what exactly we return in it
            var promise;
            if (this.site) {
                promise = $q.when(true);
            } else {
                if (typeof localStorage['MF'] === 'undefined') {
                    promise = $http({method: 'GET', url: '/data/data.json'}).success(function (data) {
                        console.log('getting site from JSON data');
                        console.log(data[0]);
                        _updateSiteVar([data[0].pages, data[0].css, data[0].containers]);
                    });
                } else {
                    //by now localStorage is like server at production
                    console.log('site loaded from server [* but server is in localStorage :P]');
                    this.loadSite();
                    promise = $q.when(true);
                }
            }
            if (typeof localStorage['MF-CACHE'] !== 'undefined') {
                console.log('cached site present');
                this.setCached(true);
            }
            return promise;
        },
        getPages: function() {
            return this.site ? this.site.pages : [];
        },
        getContainers: function(page) {
            var page = page || $routeParams.url; /* to current page if not set */

            if (this.site) {
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
                //$rootScope.$broadcast('site.update');
                //self.updateAndBroadcast();
            } else {
                console.log(page);
                console.error('"page" parameter error');
            }
        },
        addContainer: function(position) {
            var position = position || this.site.pages[$routeParams.url].containers.length; //if no position then at the end
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

            //$rootScope.$broadcast('site.update');
            //self.updateAndBroadcast();
			_storeLocalCache();
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
            //$rootScope.$broadcast('site.update');
            //self.updateAndBroadcast();
			_storeLocalCache();
        },
        removeWidget: function(containerIndex, widgetIndex) {
            var page = $routeParams.url;

            var guid = this.getContainerGuid(page, containerIndex);
            this.site.containers[guid].widgets.splice(widgetIndex, 1);
            //$rootScope.$broadcast('site.update');
            //self.updateAndBroadcast();
			_storeLocalCache();
        },
        moveWidget: function(srcCoords, dstCoords) {
            var page = $routeParams.url;

            //copy
            var guid = this.getContainerGuid(page, srcCoords[0]);
            var widget = angular.copy(this.site.containers[guid].widgets[srcCoords[1]]);
            console.log('copy done');

            console.log(this.site.containers[guid].widgets.length);

            //remove old
            this.removeWidget(srcCoords[0], srcCoords[1]);
            console.log('removed done');
            console.log(this.site.containers[guid].widgets.length);
            //console.log(this.site.containers[guid].widgets);
            //console.log(this.site.containers);

            //append
            this.appendWidget(widget, dstCoords[0], dstCoords[1]);
            //console.log(this.site.containers[guid].widgets);
            //console.log(this.site.containers);
            console.log(this.site.containers[guid].widgets.length);
            console.log('widget: ');
            console.log(widget);
            console.log('moved from: ' + srcCoords  + ' to ' + dstCoords );
            //$rootScope.$broadcast('site.update');
        }
    };

    var _updateAndBroadcast = function() {
        localStorage["MF-CACHE"] = angular.toJson(dataService.site, true);
        $rootScope.$broadcast('site.update');
    };
	
	var _storeLocalCache = function() {
        localStorage["MF-CACHE"] = angular.toJson(dataService.site, true);
    }



    $http({method: 'GET', url: '/data/widgets.json'}).
        success(function(data, status, headers, config) {
            dataService.availableWidgets = data;
            console.log('------------------------------g----------');
            console.log(dataService.availableWidgets);
            //$rootScope.$broadcast('xxx.update');
        });

    $window.onbeforeunload = function() {
        //LiveReload is being used on dev station and is annoying..., we don't want alert every 30 seconds
        if (!LiveReload && typeof localStorage['MF-CACHE'] !== 'undefined') {
            return function() { return 'Twoja stronia nie została zapisana, czy na pewno chcesz opuścić edytor?'};
        } else {
            return null;
        }
    };
    console.log('just befeore returning dataService');
    return dataService;
}]);

app.controller('SiteCtrl', ['$rootScope', '$scope', '$routeParams', 'DataService', function($rootScope, $scope, $routeParams, DataService) {
    $scope.state = DataService.state;

    $scope.loaded = false;
    $scope.lang = 'pl_PL';

    DataService.getSite().then(function (result) {
        console.log('then promise:');
        console.log(result);
        $scope.site = DataService.site;
        $scope.loaded = true;
    }, function (result) {
        console.log('error promise:');
    });
    /*$rootScope.$on('site.update',function() {
        console.log('boradcst received!!!!!!!!!!!!!!!!');
        $scope.site = DataService.site;
    });*/


    $scope.$on('$routeChangeSuccess', function(event, current) {
        if (typeof $routeParams.url !== 'undefined') {
            $scope.currentPage = $routeParams.url;
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
}]);

app.directive('container', ['$rootScope', 'DataService', function($rootScope, DataService) {
    return {
        restrict: 'E',
        templateUrl: '/views/container.html',
        replace: true,
        link: function(scope, element, attrs) {
            var _getWidgetPosition = function(item) {
                var container = item.parent('.container');
                return $('.widget', container).index(item);
            };
            var _getWidgetContainerPosition = function(item) {
                var container = item.parent('.container');
                return $('#main .container').index(container);
            };
            var _getWidgetCoords = function(item) {
                return [_getWidgetContainerPosition(item), _getWidgetPosition(item)];
            };
            var _setWidgetCoordsData = function(item) {
                $.data(item, 'widgetCoords',_getWidgetCoords(item));
            };
            var _getWidgetCoordsData = function(item) {
                return $.data(item, 'widgetCoords');
            };
            if (scope.editorMode) {
                angular.element(element).sortable({
                    connectWith: ".container",
                    handle: ".drag-handle",
                    placeholder: 'drag-placeholder',
                    forcePlaceholderSize: true,
                    start: function(event, ui) {
                        _setWidgetCoordsData(ui.item);
                    },
                    /*stop: function(event, ui) {
                    },*/
                    update: function(event, ui) {

                        if (!ui.sender) {
                            //var srcCoords = ui.item.attr('id').replace('widget-', '').split('-');
                            //array containing position [containerIndex, widgetIndex]

                            //var newContainer = ui.item.parent('.container');
                            //var newContainerIndex = newContainer.attr('id').replace('container-', '');

                            //var dstWidgetPos = $('.widget', newContainer).index(ui.item);
                            //console.log([newContainerIndex, dstWidgetPos]);

                            console.log(_getWidgetCoordsData(ui.item));
                            console.log(_getWidgetCoords(ui.item));

                            DataService.moveWidget(_getWidgetCoordsData(ui.item), _getWidgetCoords(ui.item));
                        }
                    }
                });
            }
        }
    }
}]);

app.directive('widget', function() {
    return {
        restrict: 'E',
        templateUrl: '/views/widget.html',
        replace: true
    }
});
app.directive('widgetSwitches', function() {
    return {
        restrict: 'E',
        templateUrl: '/views/widgetswitches.html',
        replace: true,
        link: function(scope, element, attrs) {
            var widget = $(element).parent('.widget');
            if (scope.editorMode) {
                $(element).hover(function() {
                    widget.append('<div class="element-overlay" />');
                }, function() {
                    $('.element-overlay', widget).remove();
                });
            }
        }
    }
});

app.directive('text', function() {
    return {
        restrict: 'E',
        templateUrl: '/views/widgets/text.html',
        replace: true
    }
});

app.directive('dynamicStyle', function() {
    return {
        restrict: 'A',
        scope: {
            css: '='
        },
        templateUrl: '/views/style.html',
        replace: true
    }
});

app.filter('inArray', function($filter){
    return function(list, arrayFilter, element){
        if(arrayFilter){
            return $filter("filter")(list, function(listItem){
                return arrayFilter.indexOf(listItem[element]) != -1;
            });
        }
    };
});