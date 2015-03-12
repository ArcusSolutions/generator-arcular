angular.module('<%= appname %>').factory('<%= name %>', ['$q', '$http',
    function($q, $http) {
        'use strict';

        return {

            getCollection: function() {
                var deferred = $q.defer();

                $http({
                    method: 'GET',
                    url: '#'
                }).then(function() {
                    deferred.resolve();
                }, function() {
                    deferred.reject();
                });

                return deferred.promise;
            }

        };

    }]);
