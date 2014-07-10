'use strict';

angular.module('<%= scriptAppName %>').factory('<%= classedName %>DataService', ['$q', '$http',
    function ($q, $http) {

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