'use strict';

angular.module('<%= scriptAppName %>').controller('HeadCtrl', ['$rootScope', '$scope', 'SEOUtility',
    function($rootScope, $scope, SEOUtility) {

        $scope.title = SEOUtility.getTitle();
        $scope.description = SEOUtility.getDescription();
        $scope.keywords = SEOUtility.getKeywords();

        $scope.$on('SEO_TITLE_UPDATED', function() {
            $scope.title = SEOUtility.getTitle();
        });

        $scope.$on('SEO_DESCRIPTION_UPDATED', function() {
            $scope.description = SEOUtility.getDescription();
        });

        $scope.$on('SEO_KEYWORDS_UPDATED', function() {
            $scope.keywords = SEOUtility.getKeywords();
        });

    }]);