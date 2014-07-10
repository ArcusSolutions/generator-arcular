'use strict';

angular.module('Arcus.Utilities', [])

    .factory('SEOUtility', ['$rootScope',
        function($rootScope) {

            var _title = 'Welcome to <%= appname %>!';
            var _description = '';
            var _keywords = [];

            return {

                getTitle: function() {
                    return _title;
                },

                setTitle: function(title) {
                    _title = title;
                    $rootScope.$broadcast('SEO_TITLE_UPDATED');
                },

                getDescription: function() {
                    return _description;
                },

                setDescription: function(description) {
                    _description = description;
                    $rootScope.$broadcast('SEO_DESCRIPTION_UPDATED');
                },

                getKeywords: function() {
                    return _keywords.join(',');
                },

                addKeyword: function(keyword) {
                    _keywords.push(keyword);
                    $rootScope.$broadcast('SEO_KEYWORDS_UPDATED');
                },

                setKeywords: function(keywords) {
                    _keywords = keywords;
                    $rootScope.$broadcast('SEO_KEYWORDS_UPDATED');
                }

            };

        }])

    .factory('ModelGenerator', ['DEBUG_MODE',
        function(DEBUG_MODE) {

            return {
                generateFromData: function(name, model, json, optional) {
                    var errors = [];
                    if (optional == undefined) {
                        optional = [];
                    }

                    var copyableData = {};
                    for (var key in model) {
                        if (key == 'optionalFields' || typeof(model[key]) == "function") {
                            continue;
                        }

                        var property = json[key];

                        if (property == undefined && optional.indexOf(key) == -1) {
                            errors.push("JSON data does not have variable " + key);
                        } else if (typeof(property) != typeof(model[key]) && property != undefined && optional.indexOf(key) != -1) {
                            errors.push("Data type does not match for key "+key);
                        } else if (property != undefined) {
                            copyableData[key] = property;
                        }
                    }

                    if (errors.length == 0) {
                        for (var key in copyableData) {
                            if (model[key] === Object(model[key]) && !(model[key] instanceof Array)) {
                                var temp = {};
                                angular.copy(model[key], temp);
                                model[key] = this.generateFromData(name + "SubObject", temp, json[key], model[key].optionalFields);
                            } else {
                                model[key] = copyableData[key];
                            }
                        }

                        return model;
                    } else if (DEBUG_MODE) {
                        console.log('==== Model Build Failed: ' + name + ' ====');
                        console.log(errors);
                        console.log('==== / Model Build Failed ====');
                    }

                    return null;
                }

            };

        }]);