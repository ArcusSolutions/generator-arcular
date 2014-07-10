'use strict';

angular.module('<%= scriptAppName %>').config([<% if (uiRouterModule) { %>'$stateProvider', '$urlRouterProvider',<% } %>
    function(<% if (uiRouterModule) { %>$stateProvider, $urlRouterProvider<% } %>) {

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
            })

            /* --------------------------------------------------------- */
            /*  MAIN
            /* --------------------------------------------------------- */
            .state('main', {
                url: '/',
                controller: 'MainCtrl',
                templateUrl: '/views/main/root.html',
                onEnter: [function() {

                }]
            });
        <% } %>


    }]);