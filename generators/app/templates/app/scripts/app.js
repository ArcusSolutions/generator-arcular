'use strict';

var app = angular.module('<%= scriptAppName %>', [<%= angularModules %>])

    .config(['$httpProvider', '$locationProvider',
        function ($httpProvider, $locationProvider) {

            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
            $httpProvider.defaults.withCredentials = true;
            $locationProvider.hashPrefix('!');

        }])

    .run(['$rootScope',<% if (uiRouterModule) { %> '$state',<% } %>
        function($rootScope<% if (uiRouterModule) { %>, $state<% } %>) {



        }]);