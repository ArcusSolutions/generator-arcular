'use strict';

angular.module('<%= scriptAppName %>').directive('<%= cameledName %>', [
    function() {

        return {
            restrict: 'AE',
            replace: true,
            templateUrl: '/views/directives/<%= cameledName %>/root.html',
            link: function(scope, element, attrs) {

            }
        };

    }]);