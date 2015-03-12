var app = angular.module('<%= name %>', [<%= angularDeps %>])

<% if (angularProviders.length) {%>
    .config(function(<%= angularProviders %>) {
        'use strict';


    })
<% } %>

    .run(['$rootScope', function($rootScope) {
        'use strict';


    }]);
