"use strict";var app=angular.module("mfAngularApp",["ngRoute","ui.bootstrap"]);app.config(["$routeProvider","$locationProvider",function(a,b){a.when("/edit/:url/:container?/:widget?",{templateUrl:"/views/edit.html",controller:"PageCtrl"}).when("/edit",{redirectTo:"/edit/home"}).when("/add/:url/:container?/:widget?",{templateUrl:"/views/edit.html",controller:"AddCtrl"}).when("/add",{redirectTo:"/add/home"}).when("/:url",{templateUrl:"/views/page.html",controller:"PageCtrl"}).otherwise({redirectTo:"/home"}),b.html5Mode(!0)}]),app.service("ExtrasService",["$rootScope",function(){return{guid:function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a){var b=16*Math.random()|0,c="x"==a?b:3&b|8;return c.toString(16)})}}}]),app.service("DataService",["$rootScope","$http","$routeParams","$q","$window","ExtrasService",function(a,b,c,d,e,f){var g=this,h={site:null,availableWidgets:null,cached:!1,getAvailableWidgets:function(){return this.availableWidgets},getContainerGuid:function(a,b){return this.site.pages[a].containers[b]},saveSite:function(){localStorage.MF=angular.toJson(this.site,!0),localStorage.removeItem("MF-CACHE")},loadSite:function(){this.site=angular.fromJson(localStorage.MF),a.$broadcast("site.update")},loadCache:function(){this.site=angular.fromJson(localStorage["MF-CACHE"]),h.cached=!1,a.$broadcast("site.update")},setCached:function(a){this.cached=a},getSite:function(){return this.site?this.site:[]},getPages:function(){return this.site?this.site.pages:[]},getContainers:function(a){var a=a||c.url;if(this.site){for(var b=[],d=this.site.pages[a]?this.site.pages[a].containers:this.site.pages.home.containers,e=d.length,f=0;e>f;f++)b.push(this.site.containers[d[f]]);return b}return[]},appendContainer:function(a,b){var d=c.url;if(d&&this.site.pages[d]){var e=this.site.pages[d].containers.indexOf(a);e>-1&&this.site.pages[d].containers.splice(e,1),this.site.pages[d].containers.splice(b,0,a),console.log("container added"),console.log(this.site.pages[d].containers),console.log("*************"),g.updateAndBroadcast()}else console.log(d),console.error('"page" parameter error')},addContainer:function(a){var a=a||this.site.pages[c.url].containers.length,b=f.guid();this.site.containers[b]={guid:b,layout:!1,widgets:[]},this.appendContainer(b,a)},removeContainerByGuid:function(a){this.site.pages.length;console.log("removing container by guid"),console.log(this.site.pages);for(var b in this.site.pages){console.log(b),console.log(this.site.pages[b].containers);var c=this.site.pages[b].containers.indexOf(a);c>-1&&this.site.pages[b].containers.splice(c,1),console.log(this.site.pages[b].containers)}g.updateAndBroadcast()},removeContainer:function(a){var b=c.url,d=this.site.pages[b].containers[a];delete this.site.containers[d],this.removeContainerByGuid(d)},appendWidget:function(a,b,d){var e=c.url,f=this.getContainerGuid(e,b);return d>this.site.containers[f].widgets.length?(console.error("[ADD] position bigger than array length"),!1):(this.site.containers[f].widgets.splice(d,0,a),void g.updateAndBroadcast())},removeWidget:function(a,b){var d=c.url,e=this.getContainerGuid(d,a);this.site.containers[e].widgets.splice(b,1),g.updateAndBroadcast()}};return this.updateAndBroadcast=function(){localStorage["MF-CACHE"]=angular.toJson(h.site,!0),a.$broadcast("site.update")},"undefined"!=typeof localStorage["MF-CACHE"]&&(console.log("cached site present"),h.cached=!0),"undefined"==typeof localStorage.MF?b({method:"GET",url:"/data/data.json"}).success(function(b){h.site=b[0],console.log("site loaded from server"),console.log(h.site),a.$broadcast("site.update"),a.$emit("site.update")}):(console.log("site loaded from server [* but server is in localStorage :P]"),h.loadSite()),b({method:"GET",url:"/data/widgets.json"}).success(function(a){h.availableWidgets=a,console.log("------------------------------g----------"),console.log(h.availableWidgets)}),e.onbeforeunload=function(){return LiveReload||"undefined"==typeof localStorage["MF-CACHE"]?null:function(){return"Twoja stronia nie została zapisana, czy na pewno chcesz opuścić edytor?"}},h}]),app.controller("SiteCtrl",["$rootScope","$scope","$routeParams","DataService",function(a,b,c,d){console.log("++++++++++++++++++start SITE ++++++++++++++++++"),b.site=d.site,console.log(b.site),console.log(c),b.$on("site.update",function(){console.log("aaaaapdejjjjtjtjjtjtjtjtjttj")}),b.$on("$routeChangeSuccess",function(){"undefined"!=typeof c.url?b.title=d.site.pages[c.url].name:console.log("routeParams undefined!!!!")}),b.$watchCollection("$routeParams",function(a){console.log(a)}),console.log("++++++++++++++++++end SITE ++++++++++++++++++")}]),app.directive("container",function(){return{restrict:"E",templateUrl:"/views/container.html",replace:!0}}),app.directive("widget",function(){return{restrict:"E",templateUrl:"/views/widget.html",replace:!0}}),app.directive("text",function(){return{restrict:"E",templateUrl:"/views/widgets/text.html",replace:!0}}),app.directive("dynamicStyle",function(){return{restrict:"A",scope:{css:"="},templateUrl:"/views/style.html",replace:!0}}),app.filter("inArray",["$filter",function(a){return function(b,c,d){return c?a("filter")(b,function(a){return-1!=c.indexOf(a[d])}):void 0}}]),angular.module("mfAngularApp").controller("PageCtrl",["$scope","$http","$routeParams","$location","DataService","ExtrasService",function(a,b,c,d,e){a.editorMode=0==d.path().search(/\/edit\/|\/add\//),a.currentPage=c.url,a.lang="pl_PL",a.site=e.site,a.pages=e.getPages(),a.cached=e.cached,console.log(a.cached),a.loaded=1,a.$on("site.update",function(){console.log("apdejt!!!"),console.log(e.site),a.loaded=!0}),a.addContainer=function(){e.addContainer()},a.removeContainer=function(a){e.removeContainer(a)},a.removeWidget=function(a,b){e.removeWidget(a,b)},a.saveSite=function(){e.saveSite()},a.loadSite=function(){e.loadSite()},a.loadCache=function(){$("#dialog_cached").remove(),e.loadCache()},a.closeCacheDialog=function(){$("#dialog_cached").remove(),e.setCached(!1)}}]),angular.module("mfAngularApp").controller("AddCtrl",["$scope","$http","$routeParams","$location","DataService","ExtrasService",function(a,b,c,d,e){switch(a.editorMode=!0,a.addMode=!0,a.addType="page",a.pages=e.getPages(),a.$on("site.update",function(){console.log("apdejt!!!"),console.log(e.site),a.pages=e.getPages()}),a.widgets=[],b({method:"GET",url:"/data/widgets.json"}).success(function(b){console.log("---http-----"),a.widgets=b,console.log(a.widgets)}),a.addWidget=function(b){var f=c.container,g=c.widget;console.log("adding widget: "+b),console.log("to container: "+f);var h=a.widgets[b],i={type:h.type,pl_PL:h.langs};angular.extend(i,h.params),console.log(i),e.appendWidget(i,f,g),console.log("xx"),d.path("edit/"+c.url),console.log("xx")},console.log(c),Object.keys(c).length){case 1:break;case 2:a.addType="container";break;case 3:a.addType="widget";break;default:console.error("[ADD] wrong params!!")}}]);