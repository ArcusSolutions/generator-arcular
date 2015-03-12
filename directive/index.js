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
        this.name = this._.camelize(this.name);
    },

    createFile: function() {
        this.log('Creating new Directive with name: ' + this.name);
        this.copy('app/views/directives/directive.html', 'app/views/directives/' + this.name + '/root.html');
        this.template('app/js/directives/_Directive.js', 'app/js/directives/' + this.name + '.js');
    },

    addFileToIndex: function() {
        this.log('Adding file reference to app/index.html');
        utils.rewriteFile({
            file: path.join('app/index.html'),
            needle: '<!-- arcular:directive -->',
            splicable: [
                '<script src="js/directives/' + this.name + '.js"></script>'
            ]
        });
        this.log('Directive created successfully!');
    }

});
