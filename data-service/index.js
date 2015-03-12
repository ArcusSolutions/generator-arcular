'use strict';

var path    = require('path');
var utils   = require('../arcular.utils');
var yeoman  = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({

    initialize: function () {
        try {
            this.appname = require(path.join(process.cwd(), 'bower.json')).name;
        } catch (e) {
            this.appname = path.basename(process.cwd());
        }

        this.argument('name', {
            required: true,
            type: String,
            desc: 'The subgenerator name'
        });
        this.name = this._.classify(this.name + ' Data Service');
    },

    createFile: function() {
        this.log('Creating new Data Service with name: ' + this.name);
        this.template('app/js/data-services/_DataService.js', 'app/js/data-services/' + this.name + '.js');
    },

    addFileToIndex: function() {
        this.log('Adding file reference to app/index.html');
        utils.rewriteFile({
            file: path.join('app/index.html'),
            needle: '<!-- arcular:data-service -->',
            splicable: [
                '<script src="js/data-services/' + this.name + '.js"></script>'
            ]
        });
        this.log('Data Service created successfully!');
    }

});
