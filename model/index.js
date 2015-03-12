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
        this.name = this._.classify(this.name + ' Model');
    },

    createFile: function() {
        this.log('Creating new Model with name: ' + this.name);
        this.template('app/js/models/_Model.js', 'app/js/models/' + this.name + '.js');
    },

    addFileToIndex: function() {
        this.log('Adding file reference to app/index.html');
        utils.rewriteFile({
            file: path.join('app/index.html'),
            needle: '<!-- arcular:model -->',
            splicable: [
                '<script src="js/models/' + this.name + '.js"></script>'
            ]
        });
        this.log('Model created successfully!');
    }

});
