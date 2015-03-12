angular.module('<%= appname %>').directive('<%= name %>', [
    function() {
        'use strict';

        return {
            restrict: 'AE',
            replace: true,
            templateUrl: '/views/directives/<%= name %>/root.html',
            link: function(scope, element, attrs) {

            }
        };

    }]);
