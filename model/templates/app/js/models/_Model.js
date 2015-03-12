angular.module('<%= appname %>').factory('<%= name %>', ['ModelGenerator',
    function(ModelGenerator) {
        'use strict';

        var <%= name %> = function(data) {

            this.id = 0;

            if (angular.isDefined(data)) {
                ModelGenerator.generateFromData('<%= name %>', this, data, this.optionalFields);
            }

        };

        return <%= name %>;

    }]);
