'use strict';

angular.module('<%= scriptAppName %>').factory('<%= classedName %>Model', ['ModelGenerator',
    function (ModelGenerator) {

        var <%= classedName %>Model = function(data) {
            if (angular.isDefined(data)) {
                ModelGenerator.generateFromData('<%= classedName %>Model', this, data);
            }
        };

        <%= classedName %>Model.prototype = {

            id: 0,

            getId: function() {
                return this.id;
            }

        };

        return <%= classedName %>Model;

    }]);