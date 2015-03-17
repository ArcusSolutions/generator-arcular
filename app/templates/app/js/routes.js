angular.module('<%= name %>').config([<% if (uiRouterModule) { %>'$stateProvider', '$urlRouterProvider',<% } %>
    function(<% if (uiRouterModule) { %>$stateProvider, $urlRouterProvider<% } %>) {
        'use strict';


        <% if (uiRouterModule) { %>
        $urlRouterProvider
            .when('', '/')
            .otherwise('/404');


        $stateProvider

            /* --------------------------------------------------------- */
            /*  404
             /* --------------------------------------------------------- */
            .state('404', {
                url: '/404',
                controller: '404Ctrl',
                templateUrl: '/views/404/root.html',
                onEnter: [function() {

                }]
            });

        <% } %>

    }]);
